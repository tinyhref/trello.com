import type {
  FunctionComponent,
  KeyboardEventHandler,
  MouseEventHandler,
} from 'react';
import { useCallback } from 'react';

import type { ActionSubjectIdType, SourceType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';
import { intl } from '@trello/i18n';
import { useBoardId, useCardId } from '@trello/id-context';
import { Button } from '@trello/nachos/button';
import { TrashIcon } from '@trello/nachos/icons/trash';
import { Tooltip } from '@trello/nachos/tooltip';
import type { CardFrontTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { useDeleteCardMutation } from 'app/src/components/Archive/DeleteCardMutation.generated';
import { stopPropagationAndPreventDefault } from 'app/src/stopPropagationAndPreventDefault';

import * as styles from './CardFrontDeleteButton.module.less';

interface CardFrontDeleteButtonProps {
  onClick?: () => void;
}

export const CardFrontDeleteButton: FunctionComponent<
  CardFrontDeleteButtonProps
> = ({ onClick: externalOnClick }) => {
  const cardId = useCardId();
  const boardId = useBoardId();

  const [deleteCardMutation] = useDeleteCardMutation();

  const handleDelete = useCallback(async () => {
    const traceId = Analytics.startTask({
      taskName: 'delete-card',
      source: 'cardView' as SourceType,
    });
    Analytics.sendClickedButtonEvent({
      buttonName: 'cardFrontDeleteButton' as ActionSubjectIdType,
      source: 'cardView' as SourceType,
      containers: {
        card: { id: cardId },
        board: { id: boardId },
      },
      attributes: {
        taskId: traceId,
      },
    });
    try {
      await deleteCardMutation({
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
        source: 'cardView' as SourceType,
        traceId,
      });
      Analytics.sendTrackEvent({
        action: 'deleted',
        actionSubject: 'card',
        source: 'cardView' as SourceType,
        containers: {
          card: { id: cardId },
          board: { id: boardId },
        },
        attributes: {
          taskId: traceId,
        },
      });
      externalOnClick?.();
    } catch (err) {
      console.error(err);
      Analytics.taskFailed({
        taskName: 'delete-card',
        source: 'cardView' as SourceType,
        traceId,
        error: err as Error,
      });
    }
  }, [boardId, cardId, deleteCardMutation, externalOnClick]);

  const handleClick = useCallback<MouseEventHandler>(
    (e) => {
      stopPropagationAndPreventDefault(e);
      handleDelete();
    },
    [handleDelete],
  );

  const handleKeyDown = useCallback<KeyboardEventHandler<HTMLButtonElement>>(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        stopPropagationAndPreventDefault(e);
        handleDelete();
      }
    },
    [handleDelete],
  );

  const tooltipLabel = intl.formatMessage({
    id: 'templates.card_front.delete-card',
    defaultMessage: 'Delete card',
    description: 'Tooltip content for the delete card button on card front',
  });

  return (
    <Tooltip content={tooltipLabel} isScreenReaderAnnouncementDisabled>
      <Button
        aria-label={tooltipLabel}
        className={styles.deleteButton}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        iconBefore={<TrashIcon color="currentColor" />}
        testId={getTestId<CardFrontTestIds>(
          'card-front-delete-button' as CardFrontTestIds,
        )}
      />
    </Tooltip>
  );
};
