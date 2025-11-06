import { useCallback } from 'react';

import { ActionHistory } from '@trello/action-history';
import type { SourceType } from '@trello/analytics-types';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import type { CardLabelType } from '@trello/labels';

import { useUpdateCardLabelsMutation } from './UpdateCardLabelsMutation.generated';

export const useSelectLabel = ({
  idBoard,
  idCard,
  idList,
  isBoardEditable,
  labelsSelectedOnCard = [],
  onLabelSelected,
  source,
  popoverSource,
}: {
  idBoard?: string;
  idCard?: string | null;
  idList?: string | null;
  isBoardEditable: boolean;
  labelsSelectedOnCard?: CardLabelType[];
  onLabelSelected?: (
    label: CardLabelType,
    action: 'deselect' | 'select',
  ) => void;
  source: SourceType;
  popoverSource?: SourceType;
}): ((label: CardLabelType) => Promise<void>) => {
  const [updateCardLabels] = useUpdateCardLabelsMutation();
  return useCallback(
    async (label: CardLabelType) => {
      if (!isBoardEditable) {
        return;
      }

      const idLabels = labelsSelectedOnCard.map(({ id }) => id);
      const isSelected = idLabels.includes(label.id);

      // onLabelSelected operates as an escape hatch to add a card even if
      // idCard doesn't exist; e.g. in the card composer.
      if (onLabelSelected) {
        onLabelSelected(label, isSelected ? 'deselect' : 'select');
      }

      if (!idCard) {
        return;
      }

      const updatedLabels = isSelected
        ? labelsSelectedOnCard.filter(({ id }) => id !== label.id)
        : [...labelsSelectedOnCard, label];

      const traceId = Analytics.startTask({
        taskName: 'edit-card/idLabels',
        source,
      });

      try {
        ActionHistory.append(
          {
            type: isSelected ? 'remove-label' : 'add-label',
            idLabel: label.id,
          },
          {
            idCard,
            idBoard: idBoard ?? '',
            idList: idList ?? '',
            idLabels,
            idMembers: [], // isn't actually used, so don't bother hydrating.
          },
        );

        await updateCardLabels({
          variables: {
            idCard,
            idLabels: updatedLabels.map(({ id }) => id),
            traceId,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateCardLabels: {
              __typename: 'Card',
              id: idCard,
              labels: updatedLabels.map((l) => ({
                ...l,
                name: l.name ?? '',
                __typename: 'Label',
              })),
            },
          },
        });
        Analytics.taskSucceeded({
          taskName: 'edit-card/idLabels',
          source,
          traceId,
        });
        Analytics.sendTrackEvent({
          action: isSelected ? 'removed' : 'added',
          actionSubject: 'label',
          source,
          containers: formatContainers({ idCard, idBoard, idList }),
          attributes: { popoverSource, taskId: traceId, color: label.color },
        });
      } catch (error) {
        Analytics.taskFailed({
          taskName: 'edit-card/idLabels',
          source,
          traceId,
          error,
        });
      }
    },
    [
      idBoard,
      idCard,
      idList,
      isBoardEditable,
      labelsSelectedOnCard,
      source,
      popoverSource,
      onLabelSelected,
      updateCardLabels,
    ],
  );
};
