import cx from 'classnames';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type FunctionComponent,
} from 'react';

import BoardIcon from '@atlaskit/icon/core/board';
import InboxIcon from '@atlaskit/icon/core/inbox';
import { Analytics } from '@trello/atlassian-analytics';
import {
  boardSwitcherOpenSharedState,
  boardSwitcherSearchSharedState,
  useBoardSwitcherMode,
} from '@trello/board-switcher';
import { intl } from '@trello/i18n';
import type { ShortcutHandler } from '@trello/keybindings';
import {
  getKey,
  Key,
  Scope,
  useChordedShortcut,
  useShortcut,
} from '@trello/keybindings';
import { getScreenFromUrl } from '@trello/marketing-screens';
import { SpotlightTransition } from '@trello/nachos/experimental-onboarding';
import { useIsPlannerDisabled } from '@trello/personal-workspace';
import { useIsActiveRoute } from '@trello/router';
import { RouteId } from '@trello/router/routes';
import { useSharedState } from '@trello/shared-state';
import { useIsInboxPanelOpen } from '@trello/split-screen';
import type { BoardTestIds, InboxTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { useBoardIdFromBoardOrCardRoute } from 'app/src/components/Board/useBoardIdFromBoardOrCardRoute';
import {
  plannerCardAnimationState,
  resetInboxAnimation,
  type PlannerCardAnimationState,
} from 'app/src/components/InboxNotifications/plannerCardAnimationState';
import { useLoadQuickCaptureNotifications } from 'app/src/components/InboxNotifications/useLoadQuickCaptureNotifications';
import { useUnreadInboxNotifications } from 'app/src/components/InboxNotifications/useUnreadInboxNotifications';
import {
  IslandNav,
  IslandNavButton,
  IslandNavSeparator,
} from 'app/src/components/IslandNav';
import {
  ConditionalNewInviteeSpotlightWrapper,
  INBOX_AND_PLANNER_BUTTON_SPOTLIGHT,
  INBOX_BUTTON_SPOTLIGHT,
  useNewInviteeCombinedPPDiscoverySpotlightTour,
  useNewInviteeStaggeredPPDiscoverySpotlightTour,
} from 'app/src/components/NewInviteePpDiscoverySpotlight';
import {
  PANEL_NAVIGATION_SPOTLIGHT,
  usePersonalProductivitySpotlightTour,
} from 'app/src/components/PersonalProductivityOnboarding';
import { useIsKeyboardShortcutsEnabled } from 'app/src/components/Shortcuts/useIsKeyboardShortcutsEnabled';
import { ShortcutTooltip } from 'app/src/components/ShortcutTooltip';
import { BoardSwitcherButton } from './BoardSwitcherButton';
import { NotificationTooltip } from './NotificationTooltip';
import { PlannerNavigationButton } from './PlannerNavigationButton';

import * as styles from './PanelNavigation.module.less';

const INBOX_ANIMATION_TIMEOUT_RESET = 2000;
interface PanelNavigationProps {
  islandRef?: React.RefObject<HTMLDivElement>;
  configuration: 'panels' | 'tabs';
  inbox: boolean;
  board: boolean;
  planner: boolean;
  switcher?: boolean;
  isBoardOpenBlocked: boolean;
  toggleInbox: () => void;
  togglePlanner: () => void;
  toggleBoard: () => void;
  toggleSwitcher?: () => void;
  toggleCallback?: () => void;
  hiddenForBulkActions?: boolean;
}

export const PanelNavigation: FunctionComponent<PanelNavigationProps> = ({
  islandRef,
  configuration,
  inbox,
  planner,
  board,
  switcher = false,
  isBoardOpenBlocked,
  toggleInbox,
  togglePlanner,
  toggleBoard,
  toggleSwitcher,
  toggleCallback,
  hiddenForBulkActions = false,
}) => {
  const source = getScreenFromUrl();

  const isCardRoute = useIsActiveRoute(RouteId.CARD);

  const boardSwitcherMode = useBoardSwitcherMode();

  const setShouldFocusBoardSwitcherSearch = useCallback(
    (shouldFocus: boolean) => {
      boardSwitcherSearchSharedState.setValue({
        shouldFocus,
      });
    },
    [],
  );

  const isPlannerDisabled = useIsPlannerDisabled();
  const isKeyboardShortcutsEnabled = useIsKeyboardShortcutsEnabled();

  useLoadQuickCaptureNotifications();
  const unreadInboxNotifications = useUnreadInboxNotifications();
  const isInboxOpen = useIsInboxPanelOpen();
  const [{ showInboxAnimation }] = useSharedState<PlannerCardAnimationState>(
    plannerCardAnimationState,
  );
  const showInboxNotifications =
    !isInboxOpen &&
    unreadInboxNotifications &&
    unreadInboxNotifications.length > 0;
  const inboxIslandHovered = useRef(false);

  const inboxToggleHandler = useCallback(() => {
    if (inbox) {
      Analytics.sendClosedComponentEvent({
        componentType: 'panel',
        componentName: 'inboxPanel',
        source,
        attributes: {
          isInboxOpen: inbox,
          isPlannerOpen: planner,
          isBoardOpen: board,
          isSwitcherOpen: switcher,
        },
      });
    }

    toggleInbox();

    toggleCallback?.();
  }, [board, inbox, planner, source, toggleInbox, toggleCallback, switcher]);

  const plannerToggleHandler = useCallback(() => {
    if (isPlannerDisabled) {
      return;
    }

    if (planner) {
      Analytics.sendClosedComponentEvent({
        componentType: 'panel',
        componentName: 'plannerPanel',
        source,
        attributes: {
          isInboxOpen: inbox,
          isPlannerOpen: planner,
          isBoardOpen: board,
          isSwitcherOpen: switcher,
        },
      });
    }

    togglePlanner();
    toggleCallback?.();
  }, [
    board,
    inbox,
    isPlannerDisabled,
    planner,
    source,
    togglePlanner,
    toggleCallback,
    switcher,
  ]);

  const boardToggleHandler = useCallback(() => {
    if (board) {
      Analytics.sendClosedComponentEvent({
        componentType: 'panel',
        componentName: 'boardPanel',
        source,
        attributes: {
          isInboxOpen: inbox,
          isPlannerOpen: planner,
          isBoardOpen: board,
          isSwitcherOpen: switcher,
        },
      });
    } else {
      Analytics.sendViewedComponentEvent({
        componentType: 'panel',
        componentName: 'boardPanel',
        source,
        attributes: {
          isInboxOpen: inbox,
          isPlannerOpen: planner,
          isBoardOpen: board,
          isSwitcherOpen: switcher,
        },
      });
    }

    toggleBoard();
  }, [board, inbox, planner, source, toggleBoard, switcher]);

  const switcherToggleHandler = useCallback(() => {
    if (boardSwitcherMode === 'panel') {
      setShouldFocusBoardSwitcherSearch(false);
      toggleSwitcher?.();
      if (switcher) {
        Analytics.sendClosedComponentEvent({
          componentType: 'panel',
          componentName: 'boardSwitcherPanel',
          source,
          attributes: {
            isInboxOpen: inbox,
            isPlannerOpen: planner,
            isBoardOpen: board,
            isSwitcherOpen: switcher,
          },
        });
      }
    } else {
      setShouldFocusBoardSwitcherSearch(true);
      boardSwitcherOpenSharedState.setValue({
        isOpen: !boardSwitcherOpenSharedState.value.isOpen,
      });
    }
  }, [
    boardSwitcherMode,
    toggleSwitcher,
    setShouldFocusBoardSwitcherSearch,
    switcher,
    board,
    inbox,
    planner,
    source,
  ]);

  const onInboxButtonClick = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'inboxPanelButton',
      source,
      attributes: {
        isInboxOpen: inbox,
        isPlannerOpen: planner,
        isBoardOpen: board,
        isSwitcherOpen: switcher,
        unreadInboxNotificationsCount: unreadInboxNotifications?.length,
        awarenessElement: 'inbox',
      },
    });

    inboxToggleHandler();
  }, [
    inbox,
    planner,
    board,
    switcher,
    source,
    inboxToggleHandler,
    unreadInboxNotifications,
  ]);

  const onPlannerButtonClick = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'plannerPanelButton',
      source,
      attributes: {
        isInboxOpen: inbox,
        isPlannerOpen: planner,
        isBoardOpen: board,
        isSwitcherOpen: switcher,
      },
    });

    plannerToggleHandler();
  }, [inbox, planner, board, switcher, source, plannerToggleHandler]);

  const onBoardButtonClick = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'boardPanelButton',
      source,
      attributes: {
        isInboxOpen: inbox,
        isPlannerOpen: planner,
        isBoardOpen: board,
        isSwitcherOpen: switcher,
      },
    });

    boardToggleHandler();
  }, [inbox, planner, board, switcher, source, boardToggleHandler]);

  const onInboxIslandHover = useCallback(() => {
    if (showInboxNotifications && !inboxIslandHovered.current) {
      inboxIslandHovered.current = true;
      Analytics.sendUIEvent({
        action: 'hovered',
        actionSubject: 'button',
        actionSubjectId: 'inboxPanelButton',
        source,
        attributes: {
          isInboxOpen,
          unreadInboxNotificationsCount: unreadInboxNotifications?.length,
          awarenessElement: 'inbox',
        },
      });
    }
  }, [source, unreadInboxNotifications, isInboxOpen, showInboxNotifications]);

  const inboxShortcutHandler = useCallback(() => {
    Analytics.sendPressedShortcutEvent({
      shortcutName: 'inboxPanelShortcut',
      keyValue: 'g+i',
      source,
      attributes: {
        isInboxOpen: inbox,
        isPlannerOpen: planner,
        isBoardOpen: board,
        isSwitcherOpen: switcher,
      },
    });

    inboxToggleHandler();
  }, [board, inbox, inboxToggleHandler, planner, source, switcher]);

  const plannerShortcutHandler = useCallback(() => {
    Analytics.sendPressedShortcutEvent({
      shortcutName: 'plannerPanelShortcut',
      keyValue: 'g+p',
      source,
      attributes: {
        isInboxOpen: inbox,
        isPlannerOpen: planner,
        isBoardOpen: board,
        isSwitcherOpen: switcher,
      },
    });

    plannerToggleHandler();
  }, [board, inbox, planner, plannerToggleHandler, source, switcher]);

  const boardShortcutHandler = useCallback(() => {
    Analytics.sendPressedShortcutEvent({
      shortcutName: 'boardPanelShortcut',
      keyValue: 'g+b',
      source,
      attributes: {
        isInboxOpen: inbox,
        isPlannerOpen: planner,
        isBoardOpen: board,
        isSwitcherOpen: switcher,
      },
    });

    boardToggleHandler();
  }, [source, inbox, planner, board, boardToggleHandler, switcher]);

  const switcherShortcutHandler = useCallback(() => {
    Analytics.sendPressedShortcutEvent({
      shortcutName: 'boardSwitcherShortcut',
      keyValue: 'g+s',
      source,
      attributes: {
        isInboxOpen: inbox,
        isPlannerOpen: planner,
        isBoardOpen: board,
        isSwitcherOpen: switcher,
      },
    });

    switcherToggleHandler();
  }, [source, inbox, planner, board, switcherToggleHandler, switcher]);

  const boardSwitcherShortcutHandler = useCallback(() => {
    setShouldFocusBoardSwitcherSearch(true);
    toggleSwitcher?.();

    Analytics.sendPressedShortcutEvent({
      shortcutName: 'boardSwitcherShortcut',
      keyValue: 'b',
      source,
      attributes: {
        isInboxOpen: inbox,
        isPlannerOpen: planner,
        isBoardOpen: board,
        isSwitcherOpen: switcher,
      },
    });
  }, [
    source,
    inbox,
    planner,
    board,
    switcher,
    toggleSwitcher,
    setShouldFocusBoardSwitcherSearch,
  ]);

  // We don't want to enable the shortcut if the Switcher already open in panel
  // mode because the b shortcut to focus the search field is also registered by
  // the panel component and would conflict with this shortcut.
  const isBoardSwitcherShortcutEnabled =
    isKeyboardShortcutsEnabled && boardSwitcherMode === 'panel' && !switcher;

  useShortcut(boardSwitcherShortcutHandler, {
    scope: Scope.Global,
    key: Key.b,
    enabled: isBoardSwitcherShortcutEnabled,
  });

  const shortcutHandler = useCallback<ShortcutHandler>(
    (event) => {
      switch (getKey(event)) {
        case Key.b:
          boardShortcutHandler();
          break;
        case Key.i:
          inboxShortcutHandler();
          break;
        case Key.p:
          plannerShortcutHandler();
          break;
        case Key.s:
          switcherShortcutHandler();
          break;
        default:
          break;
      }
    },
    [
      boardShortcutHandler,
      inboxShortcutHandler,
      plannerShortcutHandler,
      switcherShortcutHandler,
    ],
  );

  useChordedShortcut(shortcutHandler, {
    scope: Scope.Global,
    key: Key.g,
    enabled: isKeyboardShortcutsEnabled,
  });

  const showLabels = configuration === 'panels';

  const inboxLabel = intl.formatMessage({
    id: 'templates.split_screen.inbox',
    defaultMessage: 'Inbox',
    description: 'Inbox',
  });

  const boardLabel = intl.formatMessage({
    id: 'templates.split_screen.board',
    defaultMessage: 'Board',
    description: 'Board',
  });

  const hideSpotlight = configuration === 'tabs';

  const boardId = useBoardIdFromBoardOrCardRoute();
  const { renderActiveSpotlight: renderPersonalProductivitySpotlight } =
    usePersonalProductivitySpotlightTour({
      source: 'panelNavigation',
      hideSpotlight,
      boardId,
    });

  const {
    renderActiveSpotlight: renderNewInviteeCombinedPPDiscoverySpotlight,
    activeSpotlight: newInviteeCombinedActiveSpotlight,
  } = useNewInviteeCombinedPPDiscoverySpotlightTour();

  const {
    renderActiveSpotlight: renderNewInviteeStaggeredPPDiscoverySpotlight,
    activeSpotlight: newInviteeStaggeredActiveSpotlight,
  } = useNewInviteeStaggeredPPDiscoverySpotlightTour();

  const inboxIslandNavButton = (
    <IslandNavButton
      icon={<InboxIcon label="" />}
      isDisabled={!switcher && !planner && !board}
      isSelected={inbox}
      onClick={onInboxButtonClick}
      role="checkbox"
      testId={getTestId<InboxTestIds>('panel-nav-inbox-button')}
      showLabels={showLabels}
      label={inboxLabel}
      aria-label={inboxLabel}
      className={cx({
        [styles.hasNotifications]: showInboxNotifications,
        [styles.hasPlannerAnimation]: showInboxAnimation,
      })}
      onMouseEnter={onInboxIslandHover}
    />
  );

  const isInboxButtonSpotlightActive = useMemo(() => {
    return (
      newInviteeCombinedActiveSpotlight === INBOX_BUTTON_SPOTLIGHT ||
      newInviteeStaggeredActiveSpotlight === INBOX_BUTTON_SPOTLIGHT
    );
  }, [newInviteeCombinedActiveSpotlight, newInviteeStaggeredActiveSpotlight]);

  const renderInboxButtonSpotlight = useCallback(() => {
    if (newInviteeCombinedActiveSpotlight === INBOX_BUTTON_SPOTLIGHT) {
      return renderNewInviteeCombinedPPDiscoverySpotlight();
    }
    if (newInviteeStaggeredActiveSpotlight === INBOX_BUTTON_SPOTLIGHT) {
      return renderNewInviteeStaggeredPPDiscoverySpotlight();
    }
    return null;
  }, [
    newInviteeCombinedActiveSpotlight,
    newInviteeStaggeredActiveSpotlight,
    renderNewInviteeCombinedPPDiscoverySpotlight,
    renderNewInviteeStaggeredPPDiscoverySpotlight,
  ]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showInboxNotifications) {
      timeout = setTimeout(() => {
        resetInboxAnimation();
      }, INBOX_ANIMATION_TIMEOUT_RESET);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [showInboxNotifications]);

  return (
    <IslandNav
      ref={islandRef}
      isFullWidth={configuration === 'tabs'}
      className={cx({
        [styles.configurationPanels]: configuration === 'panels',
        [styles.configurationTabs]: configuration === 'tabs',
        [styles.isCardRoute]: isCardRoute,
        [styles.hiddenForBulkActions]: hiddenForBulkActions,
      })}
      spotlightTargetName={PANEL_NAVIGATION_SPOTLIGHT}
      hideSpotlight={hideSpotlight}
    >
      <ConditionalNewInviteeSpotlightWrapper
        shouldWrap={
          newInviteeCombinedActiveSpotlight ===
          INBOX_AND_PLANNER_BUTTON_SPOTLIGHT
        }
        renderSpotlight={renderNewInviteeCombinedPPDiscoverySpotlight}
        spotlightTargetName={INBOX_AND_PLANNER_BUTTON_SPOTLIGHT}
        wrapperClassName={styles.inboxAndPlannerButtonContainer}
        hasTintedBlanket={true}
      >
        {isInboxButtonSpotlightActive ? (
          <ConditionalNewInviteeSpotlightWrapper
            shouldWrap={true}
            renderSpotlight={renderInboxButtonSpotlight}
            spotlightTargetName={INBOX_BUTTON_SPOTLIGHT}
            hasTintedBlanket={true}
          >
            {inboxIslandNavButton}
          </ConditionalNewInviteeSpotlightWrapper>
        ) : showInboxNotifications ? (
          <NotificationTooltip
            shortcutKey="g+i"
            shortcutText={intl.formatMessage(
              {
                id: 'templates.split_screen.unread-cards',
                defaultMessage:
                  '{unreadCount, plural, =11{10+ unread cards} one {# unread card} other {# unread cards}}',
                description: 'Number of unread cards in the inbox',
              },
              { unreadCount: Math.min(unreadInboxNotifications.length, 11) },
            )}
            position="top"
          >
            {inboxIslandNavButton}
          </NotificationTooltip>
        ) : (
          <ShortcutTooltip
            shortcutText={inboxLabel}
            shortcutKey="g+i"
            position="top"
          >
            {inboxIslandNavButton}
          </ShortcutTooltip>
        )}

        <PlannerNavigationButton
          showLabels={showLabels}
          isSelected={planner}
          isDisabled={isPlannerDisabled || (!switcher && !inbox && !board)}
          onClick={onPlannerButtonClick}
        />
      </ConditionalNewInviteeSpotlightWrapper>
      <ShortcutTooltip
        shortcutText={boardLabel}
        shortcutKey="g+b"
        position="top"
      >
        <IslandNavButton
          icon={<BoardIcon label="" />}
          isSelected={board}
          isDisabled={(!switcher && !inbox && !planner) || isBoardOpenBlocked}
          onClick={onBoardButtonClick}
          role="checkbox"
          testId={getTestId<BoardTestIds>('panel-nav-board-button')}
          showLabels={showLabels}
          label={boardLabel}
          aria-label={boardLabel}
        />
      </ShortcutTooltip>
      <IslandNavSeparator />

      <BoardSwitcherButton
        showLabels={showLabels}
        isDisabled={switcher && !inbox && !planner && !board}
      />

      <SpotlightTransition>
        {renderPersonalProductivitySpotlight()}
      </SpotlightTransition>
    </IslandNav>
  );
};
