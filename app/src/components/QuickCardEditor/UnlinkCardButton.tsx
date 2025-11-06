import type { FunctionComponent } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import LinkBrokenIcon from '@atlaskit/icon/core/link-broken';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { useBoardId, useWorkspaceId } from '@trello/id-context';
import { Popover, usePopover } from '@trello/nachos/popover';

import { LazyUnlinkCardConfirmationContent } from 'app/src/components/Planner/LazyUnlinkCardConfirmationContent';
import { QuickCardEditorButton } from './QuickCardEditorButton';

import * as styles from './UnlinkCardButton.module.less';

interface UnlinkCardButtonProps {
  cardId: string;
  plannerEventCardId: string;
  onClose: () => void;
}

export const UnlinkCardButton: FunctionComponent<UnlinkCardButtonProps> = ({
  cardId,
  plannerEventCardId,
  onClose,
}) => {
  const intl = useIntl();
  const boardId = useBoardId();
  const workspaceId = useWorkspaceId();
  const { popoverProps, triggerRef, hide, toggle } = usePopover();

  const handleClick = () => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'unlinkCardButton',
      source: 'quickCardEditorInlineDialog',
      attributes: {
        personalProductivity: 'planner',
        containerType: 'planner',
        cardId,
      },
      containers: formatContainers({
        cardId,
        boardId,
        workspaceId,
      }),
    });
    toggle();
  };

  return (
    <>
      <QuickCardEditorButton
        ref={triggerRef}
        icon={
          <div className={styles.iconWrapper}>
            <LinkBrokenIcon size="small" label="" spacing="compact" />
          </div>
        }
        onClick={handleClick}
      >
        <FormattedMessage
          id="templates.planner.unlink-from-event"
          defaultMessage="Unlink from event"
          description="Button to unlink card from planner event"
        />
      </QuickCardEditorButton>
      <Popover
        {...popoverProps}
        title={intl.formatMessage({
          id: 'templates.planner.unlink-card-from-event-question',
          defaultMessage: 'Unlink card from event?',
          description: 'Title for unlinking card from unlink popover',
        })}
      >
        <LazyUnlinkCardConfirmationContent
          cardId={cardId}
          plannerEventCardId={plannerEventCardId}
          onUnlinkSuccess={() => {
            hide();
            onClose();
          }}
          source={'quickEditOverlay'}
        />
      </Popover>
    </>
  );
};
