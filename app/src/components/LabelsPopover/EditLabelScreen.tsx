import { useCallback, useContext, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { Button } from '@trello/nachos/button';

import { BoardMenuScreen } from 'app/src/components/BoardMenuPopover/BoardMenuScreen';
import { Screens as AddToCardPopoverScreens } from 'app/src/components/CardBackAddToCardMenu/Screens';
import { EditLabelContent } from './EditLabelContent';
import { findExistingLabel } from './findExistingLabel';
import { LabelsPopoverContext } from './LabelsPopoverContext';
import { LabelsPopoverScreen } from './LabelsPopoverScreen';
import { useUpdateLabelMutation } from './UpdateLabelMutation.generated';

export const EditLabelScreen = () => {
  const [updateLabel] = useUpdateLabelMutation();
  const {
    source,
    idBoard,
    idOrganization,
    idCard,
    idList,
    isSourceSidebarMenu,
    isOnAddToCardPopover,
    labelsOnBoard,
    currentLabel,
    setCurrentLabel,
    pop,
    push,
  } = useContext(LabelsPopoverContext);

  const onClickDeleteButton = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      e.stopPropagation();
      if (isSourceSidebarMenu) {
        push(BoardMenuScreen.LabelsDelete);
      } else if (isOnAddToCardPopover) {
        push(AddToCardPopoverScreens.DeleteLabel);
      } else {
        push(LabelsPopoverScreen.Delete);
      }
    },
    [isSourceSidebarMenu, isOnAddToCardPopover, push],
  );

  const exit = useCallback(() => {
    setCurrentLabel(null);
    pop();
  }, [setCurrentLabel, pop]);

  const [isSaving, setIsSaving] = useState(false);
  const onSave = useCallback(async () => {
    if (isSaving) {
      return;
    }

    if (!currentLabel) {
      return exit();
    }

    const label = { ...currentLabel, name: currentLabel.name?.trim(), idBoard };
    if (findExistingLabel(labelsOnBoard, label)) {
      return exit();
    }

    setIsSaving(true);
    const traceId = Analytics.startTask({
      taskName: 'edit-label',
      source: 'labelEditScreen',
    });

    try {
      const promise = updateLabel({
        variables: { label, traceId },
        optimisticResponse: {
          __typename: 'Mutation',
          updateLabel: {
            ...label,
            name: label.name || '',
            __typename: 'Label',
          },
        },
      });

      exit();

      await promise;

      Analytics.taskSucceeded({
        taskName: 'edit-label',
        source: 'labelEditScreen',
        traceId,
      });
      Analytics.sendTrackEvent({
        action: 'updated',
        actionSubject: 'label',
        source: 'labelEditScreen',
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
        taskName: 'edit-label',
        source: 'labelEditScreen',
        traceId,
        error,
      });
    }
    setIsSaving(false);
  }, [
    currentLabel,
    labelsOnBoard,
    idBoard,
    idOrganization,
    idCard,
    idList,
    isSaving,
    source,
    exit,
    updateLabel,
  ]);

  return (
    <EditLabelContent onSave={onSave} isSaving={isSaving}>
      <Button appearance="danger" onClick={onClickDeleteButton}>
        <FormattedMessage
          id="templates.labels_popover.delete"
          defaultMessage="Delete"
          description="The text of the delete button"
        />
      </Button>
    </EditLabelContent>
  );
};
