import type { FunctionComponent, MouseEvent } from 'react';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { intl } from '@trello/i18n';
import { useBoardId, useCardId, useWorkspaceId } from '@trello/id-context';
import { MemberIcon } from '@trello/nachos/icons/member';
import { usePopover } from '@trello/nachos/popover';
import type { QuickCardEditorTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { LazyCardMembersPopover } from 'app/src/components/CardMembersPopover';
import { QuickCardEditorButton } from './QuickCardEditorButton';

interface ChangeMembersButtonProps {
  isBoardTemplate: boolean;
}

export const ChangeMembersButton: FunctionComponent<
  ChangeMembersButtonProps
> = ({ isBoardTemplate }) => {
  const boardId = useBoardId();
  const cardId = useCardId();
  const workspaceId = useWorkspaceId();

  const { popoverProps, toggle, triggerRef } = usePopover();

  const onClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      toggle();
    },
    [toggle],
  );

  if (isBoardTemplate) {
    return null;
  }

  return (
    <>
      <QuickCardEditorButton
        icon={<MemberIcon size="small" />}
        onClick={onClick}
        testId={getTestId<QuickCardEditorTestIds>(
          'quick-card-editor-change-members',
        )}
        ref={triggerRef}
        isSelected={popoverProps.isVisible}
        shortcutText={intl.formatMessage({
          id: 'templates.quick_card_editor.open-members',
          defaultMessage: 'Open members',
          description:
            'Tooltip text for opening the members popover for a card',
        })}
        shortcutKey={'m'}
        position="right"
      >
        <FormattedMessage
          id="templates.quick_card_editor.change-members"
          defaultMessage="Change members"
          description="Quick card editor Change members button"
        />
      </QuickCardEditorButton>
      <LazyCardMembersPopover
        cardId={cardId}
        boardId={boardId}
        workspaceId={workspaceId}
        popoverProps={popoverProps}
        source="cardDetailScreen"
        popoverTitle={intl.formatMessage({
          id: 'templates.quick_card_editor.change-members',
          defaultMessage: 'Change members',
          description:
            'Title for the card members popover in the quick card editor',
        })}
      />
    </>
  );
};
