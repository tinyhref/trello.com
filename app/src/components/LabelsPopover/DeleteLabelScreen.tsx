import type { FunctionComponent, ReactNode } from 'react';
import { useCallback, useContext, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { type ApolloCache, type NormalizedCacheObject } from '@apollo/client';
import { useContextSelector } from 'use-context-selector';

import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { Button } from '@trello/nachos/button';

import { CardBackContext } from 'app/src/components/CardBack/CardBackContext';
import { useDeleteLabelMutation } from './DeleteLabelMutation.generated';
import { useLabelsPopoverBoardFragment } from './LabelsPopoverBoardFragment.generated';
import type { LabelsPopoverBoardQuery } from './LabelsPopoverBoardQuery.generated';
import { LabelsPopoverBoardDocument } from './LabelsPopoverBoardQuery.generated';
import type { LabelsPopoverCardQuery } from './LabelsPopoverCardQuery.generated';
import { LabelsPopoverCardDocument } from './LabelsPopoverCardQuery.generated';
import { LabelsPopoverContext } from './LabelsPopoverContext';

type Cache = ApolloCache<NormalizedCacheObject>;

const hasLabel = (labels: { id: string }[], idLabel: string) =>
  labels.some(({ id }) => id === idLabel);

const updateBoardCache = (idBoard: string, cache: Cache, idLabel: string) => {
  const data = cache.readQuery<LabelsPopoverBoardQuery>({
    query: LabelsPopoverBoardDocument,
    variables: { idBoard },
  });
  if (data?.board?.labels && hasLabel(data.board.labels, idLabel)) {
    cache.writeQuery({
      query: LabelsPopoverBoardDocument,
      variables: { idBoard },
      data: {
        board: {
          ...data.board,
          labels: data.board.labels.filter(({ id }) => id !== idLabel),
        },
      },
    });
  }
};

const updateCardCache = (
  idCard: string | null,
  cache: Cache,
  idLabel: string,
) => {
  if (!idCard) {
    return;
  }
  const data = cache.readQuery<LabelsPopoverCardQuery>({
    query: LabelsPopoverCardDocument,
    variables: { idCard },
  });
  if (data?.card?.labels && hasLabel(data.card.labels, idLabel)) {
    cache.writeQuery({
      query: LabelsPopoverCardDocument,
      variables: { idCard },
      data: {
        card: {
          ...data.card,
          labels: data.card.labels.filter(({ id }) => id !== idLabel),
        },
      },
    });
  }
};

export const DeleteLabelScreen: FunctionComponent = () => {
  const {
    source,
    currentLabel,
    idBoard,
    idOrganization,
    idCard,
    idList,
    pop,
    setCurrentLabel,
    onLabelDeleted,
  } = useContext(LabelsPopoverContext);

  const isOpenedFromSourceBoard = useContextSelector(
    CardBackContext,
    (state) => state.isOpenedFromSourceBoard,
  );

  const { data: boardData } = useLabelsPopoverBoardFragment({
    from: { id: idBoard },
    optimistic: true,
  });

  const boardName = boardData?.name;

  const [deleteLabel] = useDeleteLabelMutation();
  const [isDeleting, setIsDeleting] = useState(false);
  const onClickDeleteButton = useCallback(async () => {
    if (isDeleting) {
      return;
    }

    const idLabel = currentLabel?.id;
    if (!idLabel) {
      setCurrentLabel(null);
      pop(2);
      return;
    }

    setIsDeleting(true);
    const traceId = Analytics.startTask({
      taskName: 'delete-label',
      source: 'labelEditScreen',
    });

    try {
      await deleteLabel({
        variables: {
          idLabel,
          traceId,
        },
        // Forcefully update the Apollo cache to remove the deleted label.
        update(cache) {
          updateBoardCache(idBoard, cache, idLabel);
          updateCardCache(idCard, cache, idLabel);
        },
      });
      onLabelDeleted?.();
      Analytics.taskSucceeded({
        taskName: 'delete-label',
        source: 'labelEditScreen',
        traceId,
      });
      Analytics.sendTrackEvent({
        action: 'deleted',
        actionSubject: 'label',
        source: 'labelEditScreen',
        containers: formatContainers({
          idBoard,
          idOrganization,
          idCard,
          idList,
        }),
        attributes: { popoverSource: source, taskId: traceId },
      });
    } catch (error) {
      Analytics.taskFailed({
        taskName: 'delete-label',
        source: 'labelEditScreen',
        traceId,
        error,
      });
    }

    setCurrentLabel(null);
    setIsDeleting(false);
    // Pop with a depth of 2 to navigate back to the LabelsScreen.
    pop(2);
  }, [
    currentLabel?.id,
    deleteLabel,
    idBoard,
    idOrganization,
    idCard,
    idList,
    isDeleting,
    source,
    pop,
    setCurrentLabel,
    onLabelDeleted,
  ]);

  return (
    <div>
      <p>
        {!isOpenedFromSourceBoard ? (
          <FormattedMessage
            id="templates.labels_popover.there-is-no-undo-warning-mirror-card"
            defaultMessage="This will remove this label from all cards on the board <b>{boardName}</b>. This can't be undone."
            description="This will remove this label from all cards on the board {boardName}. This can't be undone."
            values={{
              boardName,
              b: (chunks: ReactNode) => <b>{chunks}</b>,
            }}
          />
        ) : (
          <FormattedMessage
            id="templates.labels_popover.there-is-no-undo-warning"
            defaultMessage="This will remove this label from all cards. There is no undo."
            description="This will remove this label from all cards. There is no undo."
          />
        )}
      </p>
      <Button
        appearance="danger"
        isLoading={isDeleting}
        onClick={onClickDeleteButton}
        size="fullwidth"
      >
        <FormattedMessage
          id="templates.labels_popover.delete"
          defaultMessage="Delete"
          description="Delete"
        />
      </Button>
    </div>
  );
};
