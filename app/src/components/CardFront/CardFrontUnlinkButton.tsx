import type { FunctionComponent, MouseEventHandler } from 'react';
import { useCallback, useContext } from 'react';

import LinkBrokenIcon from '@atlaskit/icon/core/link-broken';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { intl } from '@trello/i18n';
import { useCardId } from '@trello/id-context';
import { Button } from '@trello/nachos/button';
import { Popover, usePopover } from '@trello/nachos/popover';
import { Tooltip } from '@trello/nachos/tooltip';
import type { CardFrontTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { LazyUnlinkCardConfirmationContent } from 'app/src/components/Planner/LazyUnlinkCardConfirmationContent';
import { CardFrontContext } from './CardFrontContext';

import * as styles from './CardFrontUnlinkButton.module.less';

interface CardFrontUnlinkButtonProps {
  onPopoverStateChange: (isOpen: boolean) => void;
}

export const CardFrontUnlinkButton: FunctionComponent<
  CardFrontUnlinkButtonProps
> = ({ onPopoverStateChange }) => {
  const cardId = useCardId();
  const { plannerEventCardId } = useContext(CardFrontContext);
  const {
    popoverProps,
    triggerRef,
    hide: hidePopover,
    toggle,
  } = usePopover({
    onHide: () => onPopoverStateChange(false),
    onShow: () => onPopoverStateChange(true),
  });

  const onClick = useCallback<MouseEventHandler>(
    (event) => {
      Analytics.sendClickedButtonEvent({
        buttonName: 'cardFrontUnlinkButton',
        source: 'plannerCardFront',
        attributes: {
          personalProductivity: 'planner',
          containerType: 'planner',
          cardId,
        },
        containers: formatContainers({ cardId }),
      });
      event.preventDefault();
      event.stopPropagation();
      toggle();
    },
    [cardId, toggle],
  );

  const onHide = useCallback(() => {
    hidePopover();
    onPopoverStateChange(false);
  }, [hidePopover, onPopoverStateChange]);

  if (!plannerEventCardId || !cardId) {
    return null;
  }

  return (
    <>
      <Tooltip
        content={intl.formatMessage({
          id: 'templates.planner.unlink-card-from-event',
          defaultMessage: 'Unlink card from event',
          description: 'Tooltip for unlinking card from event button',
        })}
        isScreenReaderAnnouncementDisabled={true}
      >
        <Button
          ref={triggerRef}
          aria-label={intl.formatMessage({
            id: 'templates.planner.unlink-card-from-event',
            defaultMessage: 'Unlink card from event',
            description: 'Button for unlinking card from event button',
          })}
          className={styles.unlinkButton}
          iconBefore={
            <LinkBrokenIcon
              label={intl.formatMessage({
                id: 'templates.planner.unlink-card-from-event',
                defaultMessage: 'Unlink card from event',
                description: 'Button for unlinking card from event button',
              })}
              color="currentColor"
            />
          }
          onClick={onClick}
          testId={getTestId<CardFrontTestIds>('card-front-unlink-button')}
        />
      </Tooltip>

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
          onUnlinkSuccess={onHide}
          source={'plannerCardFront'}
        />
      </Popover>
    </>
  );
};
