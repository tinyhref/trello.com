import { useMemo, useState, type FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import type { SourceType } from '@trello/analytics-types';
import { useBoardId, useWorkspaceId } from '@trello/id-context';
import type { CardLabelType } from '@trello/labels';
import { PopoverScreen } from '@trello/nachos/popover';
import type { LabelsPopoverTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { useBoardMenu } from 'app/src/components/BoardMenu/useBoardMenu';
import { BoardMenuScreen } from 'app/src/components/BoardMenuPopover/BoardMenuScreen';
import { CreateLabelScreen } from './CreateLabelScreen';
import { DeleteLabelScreen } from './DeleteLabelScreen';
import { EditLabelScreen } from './EditLabelScreen';
import { useLabelsPopoverBoardQuery } from './LabelsPopoverBoardQuery.generated';
import { LabelsPopoverContext } from './LabelsPopoverContext';
import { LabelsScreen } from './LabelsScreen';

const source: SourceType = 'boardMenuDrawerLabelsScreen';

export interface BoardMenuLabelsPopoverContentProps {
  hide: () => void;
  pop: () => void;
  push: (screen: number) => void;
}

export const BoardMenuLabelsScreen: FunctionComponent<
  BoardMenuLabelsPopoverContentProps
> = ({ hide, pop, push }) => {
  const boardId = useBoardId();
  const { canEditBoard } = useBoardMenu();
  const workspaceId = useWorkspaceId() ?? '';

  const [currentLabel, setCurrentLabel] = useState<CardLabelType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [
    shouldSetFocusOnCreateNewLabelButton,
    setShouldSetFocusOnCreateNewLabelButton,
  ] = useState(false);

  const { data } = useLabelsPopoverBoardQuery({
    variables: { idBoard: boardId },
    waitOn: ['CurrentBoardInfo'],
  });

  const labelsLimitPerBoard = data?.board?.limits?.labels?.perBoard;

  const labelsPopoverContextValue = useMemo(
    () => ({
      source,
      idBoard: boardId,
      idOrganization: workspaceId,
      idCard: null,
      idList: null,
      isEditable: canEditBoard,
      isSourceSidebarMenu: true,
      labelsOnBoard: data?.board?.labels ?? [],
      labelsSelectedOnCard: [],
      labelsLimitPerBoard,
      currentLabel,
      setCurrentLabel,
      searchQuery,
      setSearchQuery,
      shouldSetFocusOnCreateNewLabelButton,
      setShouldSetFocusOnCreateNewLabelButton,
      push,
      pop,
      hide,
    }),
    [
      boardId,
      workspaceId,
      canEditBoard,
      data?.board?.labels,
      labelsLimitPerBoard,
      currentLabel,
      setCurrentLabel,
      searchQuery,
      setSearchQuery,
      shouldSetFocusOnCreateNewLabelButton,
      setShouldSetFocusOnCreateNewLabelButton,
      push,
      pop,
      hide,
    ],
  );

  return (
    <LabelsPopoverContext.Provider value={labelsPopoverContextValue}>
      <PopoverScreen
        id={BoardMenuScreen.Labels}
        title={
          <FormattedMessage
            id="templates.labels_popover.labels"
            defaultMessage="Labels"
            description="The title of the labels popover screen"
          />
        }
      >
        <LabelsScreen />
      </PopoverScreen>
      <PopoverScreen
        id={BoardMenuScreen.LabelsCreate}
        testId={getTestId<LabelsPopoverTestIds>(
          'labels-popover-create-label-screen',
        )}
        title={
          <FormattedMessage
            id="templates.labels_popover.create-a-new-label"
            defaultMessage="Create a new label"
            description="The title of the create new labels popover screen"
          />
        }
      >
        <CreateLabelScreen />
      </PopoverScreen>
      <PopoverScreen
        id={BoardMenuScreen.LabelsEdit}
        testId={getTestId<LabelsPopoverTestIds>(
          'labels-popover-edit-label-screen',
        )}
        title={
          <FormattedMessage
            id="templates.labels_popover.edit-label"
            defaultMessage="Edit label"
            description="The title of the edit labels popover screen"
          />
        }
      >
        <EditLabelScreen />
      </PopoverScreen>
      <PopoverScreen
        id={BoardMenuScreen.LabelsDelete}
        testId={getTestId<LabelsPopoverTestIds>(
          'labels-popover-delete-label-screen',
        )}
        title={
          <FormattedMessage
            id="templates.labels_popover.delete-label"
            defaultMessage="Delete label"
            description="The title of the delete labels popover screen"
          />
        }
      >
        <DeleteLabelScreen />
      </PopoverScreen>
    </LabelsPopoverContext.Provider>
  );
};
