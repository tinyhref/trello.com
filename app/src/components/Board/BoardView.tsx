import cx from 'classnames';
import type { FunctionComponent } from 'react';
import { useCallback, useEffect, useRef } from 'react';

import { useMemberId } from '@trello/authentication';
import { useBoardMembers } from '@trello/business-logic-react/board';
import { useDynamicBoardTokens } from '@trello/dynamic-tokens/dynamic-board-tokens';
import { useBoardHasPremiumFeature } from '@trello/entitlements';
import { useFeatureGate } from '@trello/feature-gate-client';
import { useGpuAcceleratedFeatures } from '@trello/gpu';
import { useBoardId } from '@trello/id-context';
import { Key, Scope, useShortcut } from '@trello/keybindings';
import { isActiveRoute, routerState } from '@trello/router';
import { navigate } from '@trello/router/navigate';
import { RouteId } from '@trello/router/routes';
import { useSharedState, useSharedStateSelector } from '@trello/shared-state';
import {
  islandOverlapSharedState,
  useAreMultiplePanelsOpen,
} from '@trello/split-screen';
import type { BoardTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';
import { useLazyComponent } from '@trello/use-lazy-component';

import { getBoardUrl } from 'app/scripts/controller/urls';
import { LabelState } from 'app/scripts/view-models/LabelState';
import { BoardBanners } from 'app/src/components/BoardBanners';
import { SingleBoardCalendarView } from 'app/src/components/BoardCalendarView';
import { LazyBoardHeader } from 'app/src/components/BoardHeader';
import { BoardLimitsWarnings } from 'app/src/components/BoardLimitsWarnings';
import { LazyBoardListView } from 'app/src/components/BoardListView';
import { LazyBoardPowerUpsDirectory } from 'app/src/components/BoardPowerUpsDirectory';
import { openCardBack } from 'app/src/components/CardFront/openCardBack';
import { LazyPluginBoardBar } from 'app/src/components/Plugins/LazyPluginBoardBar';
import { PluginBoardBarState } from 'app/src/components/Plugins/PluginBoardBarState';
import { useIsKeyboardShortcutsEnabled } from 'app/src/components/Shortcuts/useIsKeyboardShortcutsEnabled';
import { SingleBoardTableView } from 'app/src/components/TableView/SingleBoardTableView';
import { TimelineViewWrapper } from 'app/src/components/TimelineViewWrapper';
import { BoardViewBoundary } from './BoardViewBoundary';
import { legacyBoardModelsSharedState } from './legacyBoardModelsSharedState';
import { useBoardFiltersOnBoardView } from './useBoardFiltersOnBoardView';
import { boardPageState } from './useBoardPageState';
import { useBoardWelcomeMessageFlag } from './useBoardWelcomeMessageFlag';
import { useIsEligibleForBoardInviteeOnboarding } from './useIsEligibleForBoardInviteeOnboarding';
import { useReadBoardNotifications } from './useReadBoardNotifications';

import * as styles from './BoardView.module.less';

function BoardViewSwitcher({
  boardId,
  isCalendarPowerUpEnabled,
}: {
  boardId: string;
  isCalendarPowerUpEnabled: boolean;
}) {
  const { secondaryView, primaryView } = useSharedStateSelector(
    boardPageState,
    useCallback(
      (state) => ({
        secondaryView: state.secondaryViewParams?.view,
        primaryView: state.primaryViewParams?.view,
      }),
      [],
    ),
  );

  const { value: useCalendarViewInPlaceOfPup } = useFeatureGate(
    'trello_xf_use_view_for_calendar_powerup',
  );

  const BoardDashboardView = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "board-dashboard-view" */ 'app/src/components/BoardDashboardView'
      ),
    { preload: false, namedImport: 'BoardDashboardView' },
  );

  const BoardButlerView = useLazyComponent(
    () =>
      import(/* webpackChunkName: "board-butler-view" */ './BoardButlerView'),
    { preload: false, namedImport: 'BoardButlerView' },
  );

  const LegacyCalendarPowerUpView = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "legacy-calendar-view" */ './LegacyCalendarPowerUpView'
      ),
    { preload: false, namedImport: 'LegacyCalendarPowerUpView' },
  );

  const hasViewsFeature = useBoardHasPremiumFeature(boardId, 'views');

  const MapView = useLazyComponent(
    () =>
      import(/* webpackChunkName: "map-view" */ 'app/src/components/MapView'),
    { preload: false, namedImport: 'MapView' },
  );

  switch (secondaryView) {
    case 'power-up':
    case 'power-ups':
      return (
        <BoardViewBoundary
          feature="Board Power Ups"
          ownershipArea="trello-web-eng"
        >
          <LazyBoardPowerUpsDirectory />
        </BoardViewBoundary>
      );
    case 'butler': {
      return (
        <BoardViewBoundary
          feature="Board Butler"
          ownershipArea="trello-electric"
        >
          <BoardButlerView boardId={boardId} />
        </BoardViewBoundary>
      );
    }
    case 'calendar': {
      if (isCalendarPowerUpEnabled) {
        return (
          <BoardViewBoundary
            feature="Board Calendar"
            ownershipArea="trello-electric"
          >
            {useCalendarViewInPlaceOfPup ? (
              <SingleBoardCalendarView
                idBoard={boardId}
                navigateToCard={(id) => {
                  openCardBack(id);
                }}
                showCloseButton={true}
              />
            ) : (
              <LegacyCalendarPowerUpView boardId={boardId} />
            )}
          </BoardViewBoundary>
        );
      }
      break;
    }
    default:
      break;
  }

  if (!hasViewsFeature) {
    return <LazyBoardListView />;
  }

  switch (primaryView) {
    case 'calendar-view':
      return (
        <BoardViewBoundary
          feature="Board Calendar View"
          ownershipArea="trello-electric"
        >
          <SingleBoardCalendarView
            idBoard={boardId}
            navigateToCard={(id) => {
              openCardBack(id);
            }}
          />
        </BoardViewBoundary>
      );
    case 'table':
      return (
        <BoardViewBoundary
          feature="Board Table"
          ownershipArea="trello-electric"
        >
          <SingleBoardTableView
            idBoard={boardId}
            navigateToCard={(id) => {
              openCardBack(id);
            }}
          />
        </BoardViewBoundary>
      );
    case 'timeline':
      return (
        <BoardViewBoundary
          feature="Board Timeline"
          ownershipArea="trello-electric"
        >
          <TimelineViewWrapper
            idBoard={boardId}
            navigateToCard={(id: string) => {
              openCardBack(id);
            }}
          />
        </BoardViewBoundary>
      );
    case 'dashboard':
      // TODO: Implement loading and error handling states for Dashboard view.
      return (
        <BoardViewBoundary
          feature="Board Dashboard"
          ownershipArea="trello-electric"
        >
          <BoardDashboardView
            navigateToBoardView={() => {
              const boardUrl = getBoardUrl(boardId);
              navigate(boardUrl, { trigger: true });
            }}
          />
        </BoardViewBoundary>
      );
    case 'map':
      return (
        <BoardViewBoundary feature="Board Map" ownershipArea="trello-web-eng">
          <MapView />
        </BoardViewBoundary>
      );
    case 'board':
    default:
      return <LazyBoardListView />;
  }
}

export const BoardView: FunctionComponent = () => {
  const boardId = useBoardId();
  const isKeyboardShortcutsEnabled = useIsKeyboardShortcutsEnabled();
  const board = useSharedStateSelector(
    legacyBoardModelsSharedState,
    useCallback((state) => state.board.model, []),
  );
  const boardViewRef = useRef<HTMLDivElement | null>(null);

  const {
    getMemberPermissionLevel,
    getMemberType,
    loading: loadingMembers,
  } = useBoardMembers(boardId);
  const memberId = useMemberId();

  const isInviteAcceptRoute = useSharedStateSelector(
    routerState,
    useCallback(
      (state) => isActiveRoute(state, RouteId.INVITE_ACCEPT_BOARD),
      [],
    ),
  );

  const isEligibleForBoardInviteeOnboarding =
    useIsEligibleForBoardInviteeOnboarding();
  const { showWelcomeMessageFlag } = useBoardWelcomeMessageFlag();

  useEffect(() => {
    if (isEligibleForBoardInviteeOnboarding) {
      showWelcomeMessageFlag();
    }
  }, [isEligibleForBoardInviteeOnboarding, showWelcomeMessageFlag]);

  const [pluginBoardBarOptions] = useSharedState(PluginBoardBarState);

  const { value: isPluginBoardBarModernized } = useFeatureGate(
    'xf_plugin_modernization_board_bar',
  );

  const isGpuAcceleratedFeaturesEnabled = useGpuAcceleratedFeatures();
  const areMultiplePanelsOpen = useAreMultiplePanelsOpen();
  const isIslandOverlapping = useSharedStateSelector(
    islandOverlapSharedState,
    useCallback((state) => state.board, []),
  );

  useEffect(() => {
    const permLevel = getMemberPermissionLevel(memberId);
    if (
      !loadingMembers &&
      permLevel === 'none' &&
      // getMemberType returns undefined for ghosts, do not redirect ghosts
      getMemberType(memberId) !== undefined &&
      !isInviteAcceptRoute
    ) {
      navigate('/', { trigger: true });
    }
  }, [
    getMemberPermissionLevel,
    loadingMembers,
    memberId,
    isInviteAcceptRoute,
    getMemberType,
  ]);

  useShortcut(
    (event) => {
      // const wasShowingLabelText = LabelState.getShowText();
      LabelState.toggleText();
      event.preventDefault();
      // const toggleValue = wasShowingLabelText ? 'hide' : 'show';
      // TODO: Implement analytics
      // sendShortcutEvent('toggleLabelTextShortcut', { toggleValue });
    },
    {
      scope: Scope.Board,
      key: Key.SemiColon,
      enabled: isKeyboardShortcutsEnabled,
    },
  );

  useDynamicBoardTokens({
    ref: boardViewRef,
    dynamicTokens: [
      'dynamic.button',
      'dynamic.star',
      'dynamic.text',
      'dynamic.background',
    ],
  });

  useReadBoardNotifications({ boardId });
  useBoardFiltersOnBoardView();

  const boardCanvasRef = useRef<HTMLDivElement>(null);

  /**
   * PERFORMANCE OPTIMIZATION:
   *
   * The board view can be rendered for a board route or a card route.
   * If the user navigates directly to a card route, we want to defer the render
   * path for the board canvas in order to priorize the card back ASAP.
   *
   * If the board canvas has ever rendered because the user has navigated to a
   * board route, the board canvas element ref should still be connected, so we
   * will keep it live.
   *
   * This should also automatically handle navigations from board to board
   * (e.g. navigating directly to a card on another board).
   */
  const shouldRenderBoardCanvas = useSharedStateSelector(
    routerState,
    useCallback(
      (state) =>
        boardCanvasRef.current?.isConnected ||
        isActiveRoute(state, RouteId.BOARD) ||
        isActiveRoute(state, RouteId.INVITE_ACCEPT_BOARD),
      [],
    ),
  );

  // This is really just a safe check for TS, but it might also be possible that
  // the board model gets set to null before this component has unmounted. Therefore,
  // to be safe we just return null here.
  if (!board) {
    return null;
  }

  return (
    <div
      ref={boardViewRef}
      className={'board-wrapper'}
      data-testid={getTestId<BoardTestIds>('board-view')}
    >
      <div
        className={cx('board-main-content', {
          [styles.animate]: isGpuAcceleratedFeaturesEnabled,
          [styles.islandOverlap]: isIslandOverlapping,
          [styles.singlePanel]: !areMultiplePanelsOpen,
        })}
      >
        <BoardBanners />
        <div
          className={cx(
            'board-header',
            'u-clearfix',
            // Unfortunately this selector is used in the BoardName component to resize
            // the input. Ideally this should be removed.
            'js-board-header',
            'board-header-redesign-blur',
          )}
        >
          <LazyBoardHeader legacyBoardModel={board} />
        </div>
        <BoardLimitsWarnings />

        {shouldRenderBoardCanvas && (
          <div
            className="board-canvas"
            ref={boardCanvasRef}
            data-testid={getTestId<BoardTestIds>('board-canvas')}
          >
            <BoardViewSwitcher
              boardId={boardId}
              isCalendarPowerUpEnabled={board.isPowerUpEnabled('calendar')}
            />
          </div>
        )}
        {pluginBoardBarOptions.isOpen && isPluginBoardBarModernized && (
          <LazyPluginBoardBar
            boardHeight={boardViewRef.current?.offsetHeight}
            url={pluginBoardBarOptions.url}
            accentColor={pluginBoardBarOptions.accentColor}
            height={pluginBoardBarOptions.height}
            resizable={pluginBoardBarOptions.resizable}
            title={pluginBoardBarOptions.title}
            actions={pluginBoardBarOptions.actions}
            callback={pluginBoardBarOptions.callback}
          />
        )}
      </div>
      {/* .js-fill-board-menu */}
    </div>
  );
};
