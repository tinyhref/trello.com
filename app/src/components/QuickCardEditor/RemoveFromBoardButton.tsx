import type { FunctionComponent } from 'react';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import { useCardId } from '@trello/id-context';
import { RemoveIcon } from '@trello/nachos/icons/remove';
import type { QuickCardEditorTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { useDeleteCardMutation } from 'app/src/components/Archive/DeleteCardMutation.generated';
import { useIsInboxBoard } from 'app/src/components/Inbox';
import { QuickCardEditorButton } from './QuickCardEditorButton';

interface RemoveFromBoardButtonProps {
  onClose: () => void;
}

export const RemoveFromBoardButton: FunctionComponent<
  RemoveFromBoardButtonProps
> = ({ onClose }) => {
  const cardId = useCardId();
  const [deleteCard] = useDeleteCardMutation();
  const isInbox = useIsInboxBoard();
  const onClick = useCallback(async () => {
    const traceId = Analytics.startTask({
      taskName: 'delete-card',
      source: 'quickCardEditorInlineDialog',
    });

    try {
      await deleteCard({
        variables: {
          idCard: cardId,
          traceId,
        },
      });

      Analytics.taskSucceeded({
        taskName: 'delete-card',
        source: 'quickCardEditorInlineDialog',
        traceId,
      });
      Analytics.sendTrackEvent({
        action: 'deleted',
        actionSubject: 'card',
        source: 'quickCardEditorInlineDialog',
        attributes: {
          taskId: traceId,
        },
        containers: {
          card: { id: cardId },
        },
      });
      onClose();
    } catch (error) {
      Analytics.taskFailed({
        taskName: 'delete-card',
        source: 'quickCardEditorInlineDialog',
        traceId,
        error,
      });
    }
  }, [deleteCard, cardId, onClose]);

  return (
    <QuickCardEditorButton
      icon={<RemoveIcon size="small" />}
      onClick={onClick}
      testId={getTestId<QuickCardEditorTestIds>('quick-card-editor-archive')}
    >
      {isInbox ? (
        <FormattedMessage
          id="templates.quick_card_editor.remove-from-inbox"
          defaultMessage="Remove from Inbox"
          description="Remove mirror card from Inbox"
        />
      ) : (
        <FormattedMessage
          id="templates.quick_card_editor.remove-from-board"
          defaultMessage="Remove from this board"
          description="Remove mirror card from this board"
        />
      )}
    </QuickCardEditorButton>
  );
};
