import type { FunctionComponent, MouseEventHandler } from 'react';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import { useBoardId, useCardId } from '@trello/id-context';
import { TrashIcon } from '@trello/nachos/icons/trash';
import type { QuickCardEditorTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { useDeleteCardMutation } from 'app/src/components/Archive/DeleteCardMutation.generated';
import { stopPropagationAndPreventDefault } from 'app/src/stopPropagationAndPreventDefault';
import { QuickCardEditorButton } from './QuickCardEditorButton';
export const DeleteCardButton: FunctionComponent = () => {
  const cardId = useCardId();
  const boardId = useBoardId();

  const [deleteCard] = useDeleteCardMutation();

  const handleDeleteButtonClick = useCallback<MouseEventHandler>(
    async (e) => {
      stopPropagationAndPreventDefault(e);
      const traceId = Analytics.startTask({
        taskName: 'delete-card',
        source: 'quickCardEditorInlineDialog',
      });
      Analytics.sendClickedButtonEvent({
        buttonName: 'deleteCardButton',
        source: 'quickCardEditorInlineDialog',
        containers: {
          card: { id: cardId },
          board: { id: boardId },
        },
        attributes: {
          taskId: traceId,
        },
      });
      try {
        await deleteCard({
          variables: { idCard: cardId, traceId },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteCard: {
              __typename: 'Card_DeleteResponse',
              success: true,
            },
          },
          update: (cache, result) => {
            if (result.data?.deleteCard) {
              cache.evict({
                id: cache.identify({ id: cardId, __typename: 'Card' }),
              });
            }
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
          containers: {
            card: { id: cardId },
            board: { id: boardId },
          },
          attributes: {
            taskId: traceId,
          },
        });
      } catch (err) {
        console.error(err);
        Analytics.taskFailed({
          taskName: 'delete-card',
          source: 'quickCardEditorInlineDialog',
          traceId,
          error: err,
        });
      }
    },
    [boardId, cardId, deleteCard],
  );
  return (
    <QuickCardEditorButton
      icon={<TrashIcon size="small" />}
      onClick={handleDeleteButtonClick}
      testId={getTestId<QuickCardEditorTestIds>('quick-card-editor-delete')}
    >
      <FormattedMessage
        id="templates.quick_card_editor.delete"
        defaultMessage="Delete"
        description="Quick card editor delete button"
      />
    </QuickCardEditorButton>
  );
};
