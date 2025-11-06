import cx from 'classnames';
import { useCallback } from 'react';
import type { FunctionComponent, MouseEventHandler } from 'react';

import BoardsIcon from '@atlaskit/icon/core/boards';
import { Analytics } from '@trello/atlassian-analytics';
import {
  boardSwitcherOpenSharedState,
  useBoardSwitcherLayout,
  useBoardSwitcherMode,
} from '@trello/board-switcher';
import { intl } from '@trello/i18n';
import { getScreenFromUrl } from '@trello/marketing-screens';
import {
  useIsBoardPanelOpen,
  useIsInboxPanelOpen,
  useIsPlannerPanelOpen,
  useIsSwitcherPanelOpen,
  useSplitScreenSharedState,
} from '@trello/split-screen';
import { getTestId, type BoardSwitcherTestIds } from '@trello/test-ids';
import { usePressTracing } from '@trello/ufo';

import { IslandNavButton } from 'app/src/components/IslandNav';
import { LazySpotlightPulse } from 'app/src/components/Onboarding';
import { useBoardSwitcherButtonPulseAndSpotlight } from 'app/src/components/PersonalProductivityOnboarding/useBoardSwitcherButtonPulseAndSpotlight';
import { ShortcutTooltip } from 'app/src/components/ShortcutTooltip';

import * as styles from './BoardSwitcherButton.module.less';

interface BoardSwitcherButtonProps {
  showLabels?: boolean;
  isDisabled?: boolean;
}

export const BoardSwitcherButton: FunctionComponent<
  BoardSwitcherButtonProps
> = ({ showLabels = false, isDisabled = false }) => {
  const isInboxOpen = useIsInboxPanelOpen();
  const isPlannerOpen = useIsPlannerPanelOpen();
  const isBoardOpen = useIsBoardPanelOpen();
  const isSwitcherOpen = useIsSwitcherPanelOpen();

  const traceInteraction = usePressTracing('board-switcher-view-press-tracing');

  const { shouldShowSpotlight } = useBoardSwitcherButtonPulseAndSpotlight();

  const boardSwitcherMode = useBoardSwitcherMode();

  const {
    configuration: splitScreenConfiguration,
    panels,
    toggleInbox,
    toggleBoard,
    togglePlanner,
    toggleSwitcher,
  } = useSplitScreenSharedState();

  const layout = useBoardSwitcherLayout();

  const onClickHandler = useCallback<MouseEventHandler>(
    async (event) => {
      traceInteraction(event); // trigger UFO tracing interaction

      Analytics.sendClickedButtonEvent({
        buttonName: 'boardSwitcherButton',
        source: getScreenFromUrl(),
        attributes: {
          isInboxOpen,
          isPlannerOpen,
          isBoardOpen,
          isSwitcherOpen,
          layout,
        },
      });

      if (splitScreenConfiguration === 'tabs') {
        if (isInboxOpen) {
          toggleInbox();
        }
        if (isPlannerOpen) {
          togglePlanner();
        }
        if (isBoardOpen) {
          toggleBoard();
        }
      }

      if (
        splitScreenConfiguration === 'tabs' ||
        boardSwitcherMode === 'panel'
      ) {
        toggleSwitcher();
      } else {
        boardSwitcherOpenSharedState.setValue({
          isOpen: true,
        });
      }
    },
    [
      boardSwitcherMode,
      isBoardOpen,
      isInboxOpen,
      isPlannerOpen,
      isSwitcherOpen,
      layout,
      splitScreenConfiguration,
      toggleBoard,
      toggleInbox,
      togglePlanner,
      toggleSwitcher,
      traceInteraction,
    ],
  );

  const title = intl.formatMessage({
    id: 'templates.split_screen.switch-boards',
    defaultMessage: 'Switch boards',
    description: 'Switch boards',
  });

  const button = (
    <ShortcutTooltip shortcutText={title} shortcutKey="b" position="top">
      <IslandNavButton
        icon={<BoardsIcon label="" />}
        onClick={onClickHandler}
        role="checkbox"
        testId={getTestId<BoardSwitcherTestIds>(
          'panel-nav-board-switcher-button',
        )}
        showLabels={showLabels}
        label={title}
        aria-label={title}
        isDisabled={isDisabled}
        isSelected={boardSwitcherMode === 'panel' && panels.switcher}
      />
    </ShortcutTooltip>
  );

  return (
    <div
      className={cx(styles.boardSwitcherButton, {
        [styles.withLabel]: showLabels,
      })}
    >
      {shouldShowSpotlight ? (
        <LazySpotlightPulse radius={8}>{button}</LazySpotlightPulse>
      ) : (
        button
      )}
    </div>
  );
};
