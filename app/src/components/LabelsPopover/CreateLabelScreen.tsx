import type { ApolloCache, NormalizedCacheObject } from '@apollo/client';
import type { FunctionComponent } from 'react';
import { useCallback, useContext, useState } from 'react';

import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { intl } from '@trello/i18n';
import type { CardLabelType } from '@trello/labels';

import { useCreateLabelMutation } from './CreateLabelMutation.generated';
import { EditLabelContent } from './EditLabelContent';
import { findExistingLabel } from './findExistingLabel';
import type { LabelsPopoverBoardQuery } from './LabelsPopoverBoardQuery.generated';
import { LabelsPopoverBoardDocument } from './LabelsPopoverBoardQuery.generated';
import type { LabelsPopoverCardQuery } from './LabelsPopoverCardQuery.generated';
import { LabelsPopoverCardDocument } from './LabelsPopoverCardQuery.generated';
import { LabelsPopoverContext } from './LabelsPopoverContext';
import { useSelectLabel } from './useSelectLabel';

type Cache = ApolloCache<NormalizedCacheObject>;

// Dedupe the new label in case it was added optimistically somehow.
const hasLabel = (labels: { id: string }[], idLabel: string) =>
  labels.some(({ id }) => id === idLabel);

const updateBoardCache = (
  idBoard: string,
  cache: Cache,
  newLabel: CardLabelType,
) => {
  const data = cache.readQuery<LabelsPopoverBoardQuery>({
    query: LabelsPopoverBoardDocument,
    variables: { idBoard },
  });
  if (data?.board?.labels && !hasLabel(data.board.labels, newLabel.id)) {
    cache.writeQuery({
      query: LabelsPopoverBoardDocument,
      variables: { idBoard },
      data: {
        board: {
          ...data.board,
          labels: [...data.board.labels, newLabel],
        },
      },
    });
  }
};

const updateCardCache = (
  idCard: string | null,
  cache: Cache,
  newLabel: CardLabelType,
) => {
  if (!idCard) {
    return;
  }
  const data = cache.readQuery<LabelsPopoverCardQuery>({
    query: LabelsPopoverCardDocument,
    variables: { idCard },
  });
  if (data?.card?.labels && !hasLabel(data.card.labels, newLabel.id)) {
    cache.writeQuery({
      query: LabelsPopoverCardDocument,
      variables: { idCard },
      data: {
        card: {
          ...data?.card,
          labels: [...data.card.labels, newLabel],
        },
      },
    });
  }
};

export const CreateLabelScreen: FunctionComponent = () => {
  const {
    source,
    idBoard,
    idOrganization,
    idCard,
    idList,
    isEditable,
    labelsOnBoard,
    labelsSelectedOnCard,
    setCurrentLabel,
    setSearchQuery,
    onLabelSelected,
    pop,
    setShouldSetFocusOnCreateNewLabelButton,
  } = useContext(LabelsPopoverContext);

  const [createLabel] = useCreateLabelMutation();
  const [isSaving, setIsSaving] = useState(false);
  const selectLabel = useSelectLabel({
    idBoard,
    idCard,
    idList,
    isBoardEditable: isEditable,
    labelsSelectedOnCard,
    onLabelSelected,
    source: 'labelCreateScreen',
    popoverSource: source,
  });
  const onSave = useCallback(
    async (_label: CardLabelType) => {
      if (isSaving) {
        return;
      }

      const label = { ..._label, name: _label.name?.trim() };
      // If the label is a duplicate of an existing label, bail out and try to
      // select it instead. On the board sidebar, this should no-op.
      const existingLabel = findExistingLabel(labelsOnBoard, label);
      if (existingLabel) {
        selectLabel(existingLabel);
      } else {
        setIsSaving(true);
        const traceId = Analytics.startTask({
          taskName: 'create-label',
          source: 'labelCreateScreen',
        });
        try {
          await createLabel({
            variables: {
              name: label.name,
              color: label.color,
              idBoard,
              idCard,
              traceId,
            },
            // Forcefully update the Apollo cache with the newly created label.
            update(cache, result) {
              const newLabel = result.data?.createLabel;
              if (!newLabel) {
                return;
              }
              updateBoardCache(idBoard, cache, newLabel);
              updateCardCache(idCard, cache, newLabel);
              onLabelSelected?.(newLabel, 'select');
            },
          });
          Analytics.taskSucceeded({
            taskName: 'create-label',
            source: 'labelCreateScreen',
            traceId,
          });
          Analytics.sendTrackEvent({
            action: 'created',
            actionSubject: 'label',
            source: 'labelCreateScreen',
            containers: formatContainers({
              idBoard,
              idOrganization,
              idCard,
              idList,
            }),
            attributes: {
              color: label.color,
              popoverSource: source,
              taskId: traceId,
            },
          });
        } catch (error) {
          Analytics.taskFailed({
            taskName: 'create-label',
            source: 'labelCreateScreen',
            traceId,
            error,
          });
        }
      }

      setCurrentLabel(null);
      setSearchQuery('');
      setIsSaving(false);
      setShouldSetFocusOnCreateNewLabelButton(true);

      pop();
    },
    [
      createLabel,
      idBoard,
      idCard,
      idList,
      idOrganization,
      isSaving,
      labelsOnBoard,
      onLabelSelected,
      pop,
      selectLabel,
      setCurrentLabel,
      setSearchQuery,
      source,
      setShouldSetFocusOnCreateNewLabelButton,
    ],
  );

  return (
    <EditLabelContent
      saveText={intl.formatMessage({
        id: 'templates.labels_popover.create',
        defaultMessage: 'Create',
        description: 'Button to create a new label in popover screen.',
      })}
      onSave={onSave}
      isSaving={isSaving}
    />
  );
};
