import type FullCalendar from '@fullcalendar/react';
import cx from 'classnames';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FunctionComponent,
  type ReactNode,
} from 'react';
import { useDebouncedCallback } from 'use-debounce';
import useResizeObserver from 'use-resize-observer';

import { isMemberLoggedIn, useMemberId } from '@trello/authentication';
import { useBoardSwitcherMode } from '@trello/board-switcher';
import { isEmbeddedDocument } from '@trello/browser';
import { smartScheduledCardsSharedState } from '@trello/business-logic/planner';
import { doElementsOverlap } from '@trello/dom';
import { useFeatureGate } from '@trello/feature-gate-client';
import { useGpuAcceleratedFeatures } from '@trello/gpu';
import {
  SpotlightManager,
  SpotlightTarget,
  SpotlightTransition,
} from '@trello/nachos/experimental-onboarding';
import { useIsInboxBoardPassContextVals } from '@trello/personal-workspace';
import { PlannerRefProvider } from '@trello/planner';
import { useSharedStateSelector } from '@trello/shared-state';
import {
  islandOverlapSharedState,
  useSplitScreenResize,
  useSplitScreenSharedState,
  type PanelNames,
} from '@trello/split-screen';
import { UFOSegment } from '@trello/ufo';

import { TrelloBoard } from 'app/src/components/Board';
import { legacyBoardModelsSharedState } from 'app/src/components/Board/legacyBoardModelsSharedState';
import { LazyBoardSwitcherPanel } from 'app/src/components/BoardSwitcher';
import {
  BulkActionIslandEntryComponent,
  BulkActionLoadingIsland,
  bulkActionSelectedCardsSharedState,
} from 'app/src/components/BulkAction';
import { LazyInboxContainer } from 'app/src/components/Inbox';
import { INBOX_ROOT_ID } from 'app/src/components/Inbox/Inbox.constants';
import { useInboxSocketSubscription } from 'app/src/components/Inbox/useInboxSocketSubscription';
import {
  INBOX_AND_PLANNER_PANEL_SPOTLIGHT,
  INBOX_PANEL_SPOTLIGHT,
  PLANNER_PANEL_SPOTLIGHT,
  useNewInviteeCombinedPPDiscoverySpotlightTour,
  useNewInviteeStaggeredPPDiscoverySpotlightTour,
} from 'app/src/components/NewInviteePpDiscoverySpotlight';
import {
  INBOX_SPOTLIGHT,
  usePersonalProductivitySpotlightTour,
} from 'app/src/components/PersonalProductivityOnboarding';
import { LazyPlanner } from 'app/src/components/Planner';
import { useIsSmartScheduleM2Enabled } from 'app/src/components/SmartSchedule';
import {
  SplitScreenPanel,
  SplitScreenResizeDivider,
} from 'app/src/components/SplitScreenPanel';
import { PanelNavigation } from './PanelNavigation';
import { RovoIsland } from './RovoIsland';

import * as styles from './SplitScreenManager.module.less';

const ConditionalSpotlightWrapper: FunctionComponent<{
  children: ReactNode;
  shouldWrap: boolean;
  renderSpotlight: () => ReactNode;
  spotlightTargetName: string;
  wrapperClassName?: string;
}> = ({
  children,
  shouldWrap,
  renderSpotlight,
  spotlightTargetName,
  wrapperClassName,
}) => {
  if (shouldWrap) {
    return (
      <>
        <SpotlightTarget name={spotlightTargetName}>
          {wrapperClassName ? (
            <div className={wrapperClassName}>{children}</div>
          ) : (
            children
          )}
        </SpotlightTarget>
        <SpotlightTransition>{renderSpotlight()}</SpotlightTransition>
      </>
    );
  }
  return children;
};

const SplitScreen: FunctionComponent = () => {
  const board = useSharedStateSelector(
    legacyBoardModelsSharedState,
    useCallback((state) => state.board, []),
  );

  const memberId = useMemberId();
  const boardId = board.model?.get('id') ?? null;
  const workspaceId = board.model?.get('idOrganization') ?? '';
  const isInboxBoard = useIsInboxBoardPassContextVals({
    boardId,
    memberId,
  });
  const screenManagerRef = useRef<HTMLDivElement>(null);
  const fullCalendarRef = useRef<FullCalendar>(null);

  const {
    ref,
    configuration,
    panels,
    areMultiplePanelsOpen,
    isBoardOpenBlocked,
    toggleBoard,
    toggleInbox,
    togglePlanner,
    toggleSwitcher,
    resizeAllPanelsToDefault,
    defaultPanelWidths,
  } = useSplitScreenSharedState({
    isInboxBoard,
  });

  const switcherRef = useRef<HTMLDivElement>(null);
  const inboxRef = useRef<HTMLDivElement>(null);
  const plannerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const islandRef = useRef<HTMLDivElement>(null);

  const checkForIslandOverlap = useCallback(() => {
    if (!islandRef.current) {
      return;
    }
    const islandNav = islandRef.current.firstElementChild as HTMLElement;

    const state: Record<string, boolean> = {};

    if (panels.switcher && switcherRef.current) {
      const isOverlapping = doElementsOverlap(switcherRef.current, islandNav);
      state.switcher = isOverlapping;
    }
    if (panels.inbox && inboxRef.current) {
      const isOverlapping = doElementsOverlap(inboxRef.current, islandNav);
      state.inbox = isOverlapping;
    }
    if (panels.planner && plannerRef.current) {
      const isOverlapping = doElementsOverlap(plannerRef.current, islandNav);
      state.planner = isOverlapping;
    }
    if (panels.board && boardRef.current) {
      const isOverlapping = doElementsOverlap(boardRef.current, islandNav);
      state.board = isOverlapping;
    }

    islandOverlapSharedState.setValue(state);
  }, [panels.switcher, panels.inbox, panels.planner, panels.board]);

  const debouncedCheckForIslandOverlap = useDebouncedCallback(
    checkForIslandOverlap,
    10,
  );

  useResizeObserver<HTMLDivElement>({
    ref: screenManagerRef,
    onResize: checkForIslandOverlap,
  });

  useEffect(() => {
    checkForIslandOverlap();
    // check for overlap on mount. the resize observer will handle it otherwise.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { sendResizeAnalyticsEvent } = useSplitScreenResize();

  const [switcherWidth, setSwitcherWidth] = useState(
    panels.panelWidths.switcher?.width ?? 0,
  );
  const [inboxWidth, setInboxWidth] = useState(panels.panelWidths.inbox.width);
  const [plannerWidth, setPlannerWidth] = useState(
    panels.panelWidths.planner.width,
  );
  const [boardWidth, setBoardWidth] = useState(panels.panelWidths.board.width);

  const [isSwitcherCollapsed, setIsSwitcherCollapsed] = useState(
    !panels.switcher,
  );
  const [isInboxCollapsed, setIsInboxCollapsed] = useState(!panels.inbox);
  const [isPlannerCollapsed, setIsPlannerCollapsed] = useState(!panels.planner);
  const [isBoardCollapsed, setIsBoardCollapsed] = useState(!panels.board);

  const isGpuAcceleratedFeaturesEnabled = useGpuAcceleratedFeatures();
  const [enableTransitions, setEnableTransitions] = useState(
    isGpuAcceleratedFeaturesEnabled,
  );

  // isGpuAcceleratedFeaturesEnabled is async, so we need to make sure we
  // update it when the value changes. Also, its a boolean and can only change
  // on browser restart. So this useEffect should max only run twice.
  useEffect(() => {
    setEnableTransitions(isGpuAcceleratedFeaturesEnabled);
  }, [isGpuAcceleratedFeaturesEnabled]);

  useInboxSocketSubscription();

  const { renderActiveSpotlight: renderPersonalProductivitySpotlight } =
    usePersonalProductivitySpotlightTour({
      source: 'inbox',
      boardId,
    });

  const boardSwitcherMode = useBoardSwitcherMode();

  const shouldRenderSwitcherPanel =
    boardSwitcherMode === 'panel' || configuration === 'tabs';

  const hasBulkSelectedCards = useSharedStateSelector(
    bulkActionSelectedCardsSharedState,
    useCallback((state) => {
      return Object.keys(state.selectedCards).length > 0;
    }, []),
  );

  const { isSmartScheduleLoading, hasSmartScheduledCards } =
    useSharedStateSelector(
      smartScheduledCardsSharedState,
      useCallback((state) => {
        return {
          isSmartScheduleLoading: state.isLoading,
          hasSmartScheduledCards: state.proposedEvents.length > 0,
        };
      }, []),
    );

  const isBulkActionLoading = useSharedStateSelector(
    bulkActionSelectedCardsSharedState,
    useCallback((state) => state.isLoading, []),
  );

  const isSmartScheduleM2Enabled = useIsSmartScheduleM2Enabled();

  const shouldShowLoadingIsland = isBulkActionLoading || isSmartScheduleLoading;

  const shouldShowBulkActionIsland =
    hasBulkSelectedCards ||
    (hasSmartScheduledCards && !isSmartScheduleM2Enabled);

  const toggleCallback = useCallback(() => {
    setBoardWidth(panels.panelWidths.board.width);
  }, [panels.panelWidths.board.width]);

  useEffect(() => {
    if (panels.inbox) {
      setInboxWidth(panels.panelWidths.inbox.width);
    }
    if (panels.planner) {
      setPlannerWidth(panels.panelWidths.planner.width);
    }
    if (panels.board) {
      setBoardWidth(panels.panelWidths.board.width);
    }
    if (panels.switcher) {
      setSwitcherWidth(panels.panelWidths.switcher.width);
    }
  }, [
    panels.inbox,
    panels.planner,
    panels.board,
    panels.switcher,
    panels.panelWidths,
  ]);

  const handleDoubleClick = useCallback(() => {
    resizeAllPanelsToDefault();

    if (inboxWidth !== defaultPanelWidths.inbox.width) {
      sendResizeAnalyticsEvent('inbox', defaultPanelWidths.inbox.width);
    }
    if (plannerWidth !== defaultPanelWidths.planner.width) {
      sendResizeAnalyticsEvent('planner', defaultPanelWidths.planner.width);
    }
    if (boardWidth !== defaultPanelWidths.board.width) {
      sendResizeAnalyticsEvent('board', defaultPanelWidths.board.width);
    }
    if (switcherWidth !== defaultPanelWidths.switcher.width) {
      sendResizeAnalyticsEvent('switcher', defaultPanelWidths.switcher.width);
    }

    setInboxWidth(defaultPanelWidths.inbox.width);
    setPlannerWidth(defaultPanelWidths.planner.width);
    setBoardWidth(defaultPanelWidths.board.width);
    setSwitcherWidth(defaultPanelWidths.switcher.width);
  }, [
    defaultPanelWidths.board.width,
    defaultPanelWidths.inbox.width,
    defaultPanelWidths.planner.width,
    defaultPanelWidths.switcher.width,
    inboxWidth,
    plannerWidth,
    boardWidth,
    switcherWidth,
    resizeAllPanelsToDefault,
    sendResizeAnalyticsEvent,
  ]);

  const handleSetPanelWidth = useCallback(
    (panelName: PanelNames, width: number) => {
      switch (panelName) {
        case 'inbox':
          setInboxWidth(width);
          setIsInboxCollapsed(width === 0);
          break;
        case 'planner':
          setPlannerWidth(width);
          setIsPlannerCollapsed(width === 0);
          break;
        case 'board':
          setBoardWidth(width);
          setIsBoardCollapsed(width === 0);
          break;
        case 'switcher':
          setSwitcherWidth(width);
          setIsSwitcherCollapsed(width === 0);
          break;
        default:
          break;
      }
    },
    [],
  );

  const shouldShowSwitcherDivider =
    panels.switcher && (panels.inbox || panels.planner || panels.board);
  const shouldShowInboxDivider =
    panels.inbox && (panels.planner || panels.board);
  const shouldShowPlannerDivider = panels.planner && panels.board;

  const {
    activeSpotlight: newInviteeActiveSpotlight,
    renderActiveSpotlight: renderNewInviteeCombinedPPDiscoverySpotlight,
  } = useNewInviteeCombinedPPDiscoverySpotlightTour();

  const {
    activeSpotlight: newInviteeStaggeredActiveSpotlight,
    renderActiveSpotlight: renderNewInviteeStaggeredPPDiscoverySpotlight,
  } = useNewInviteeStaggeredPPDiscoverySpotlightTour();

  return (
    <div className={styles.manager} ref={ref}>
      <PlannerRefProvider plannerRef={fullCalendarRef}>
        <SpotlightManager blanketIsTinted={true}>
          <div
            className={cx({
              [styles.splitscreen]: true,
              [styles.animate]: enableTransitions,
              [styles.tabs]: configuration === 'tabs',
              [styles.single]: !areMultiplePanelsOpen,
              [styles.extraUpperPadding]: isSmartScheduleM2Enabled,
            })}
            ref={screenManagerRef}
          >
            {shouldRenderSwitcherPanel && (
              <>
                <SplitScreenPanel
                  ref={switcherRef}
                  panelName="switcher"
                  isHidden={!panels.switcher}
                  panelWidth={switcherWidth}
                  enableTransitions={enableTransitions}
                  isCollapsed={isSwitcherCollapsed && switcherWidth === 0}
                  onResize={debouncedCheckForIslandOverlap}
                  shouldGrow={
                    (isInboxCollapsed || !panels.inbox) &&
                    (isPlannerCollapsed || !panels.planner) &&
                    (isBoardCollapsed || !panels.board)
                  }
                >
                  {panels.switcher && <LazyBoardSwitcherPanel />}
                </SplitScreenPanel>
                <SplitScreenResizeDivider
                  leftPreviousWidth={panels.panelWidths.switcher?.width ?? 0}
                  rightPreviousWidth={
                    panels.inbox
                      ? panels.panelWidths.inbox.width
                      : panels.planner
                        ? panels.panelWidths.planner.width
                        : panels.panelWidths.board.width
                  }
                  enableTransitionsCallback={setEnableTransitions}
                  shouldHideDivider={!shouldShowSwitcherDivider}
                  isRightMostDivider={
                    Number(panels.inbox) +
                      Number(panels.planner) +
                      Number(panels.board) ===
                    1
                  }
                  leftPanelName="switcher"
                  rightPanelName={
                    panels.inbox
                      ? 'inbox'
                      : panels.planner
                        ? 'planner'
                        : 'board'
                  }
                  handleSetWidthCallback={handleSetPanelWidth}
                  handleDoubleClick={handleDoubleClick}
                />
              </>
            )}
            <ConditionalSpotlightWrapper
              shouldWrap={
                newInviteeActiveSpotlight === INBOX_AND_PLANNER_PANEL_SPOTLIGHT
              }
              renderSpotlight={renderNewInviteeCombinedPPDiscoverySpotlight}
              spotlightTargetName={INBOX_AND_PLANNER_PANEL_SPOTLIGHT}
              wrapperClassName={styles.inboxAndPlannerPanel}
            >
              <SplitScreenPanel
                ref={inboxRef}
                panelName="inbox"
                isHidden={!panels.inbox}
                panelWidth={inboxWidth}
                enableTransitions={enableTransitions}
                isCollapsed={isInboxCollapsed && inboxWidth === 0}
                onResize={debouncedCheckForIslandOverlap}
                shouldGrow={
                  (isPlannerCollapsed || !panels.planner) &&
                  (isBoardCollapsed || !panels.board)
                }
              >
                <ConditionalSpotlightWrapper
                  shouldWrap={
                    newInviteeActiveSpotlight !==
                    INBOX_AND_PLANNER_PANEL_SPOTLIGHT
                  }
                  renderSpotlight={
                    newInviteeStaggeredActiveSpotlight === INBOX_PANEL_SPOTLIGHT
                      ? renderNewInviteeStaggeredPPDiscoverySpotlight
                      : renderPersonalProductivitySpotlight
                  }
                  spotlightTargetName={INBOX_SPOTLIGHT}
                  wrapperClassName={styles.inboxContent}
                >
                  <UFOSegment name="inbox-view">
                    <div
                      // The skip navigation link uses this ID to help users jump straight to this section of the screen.
                      id={INBOX_ROOT_ID}
                      className={cx(styles.inboxContent, {
                        // Explicitly set `single` class here rather than inferring it from the parent
                        // in styles because when in spotlight tour, this component no longer is a child of `splitscreen`.
                        [styles.single]: !areMultiplePanelsOpen,
                      })}
                    >
                      {panels.inbox && <LazyInboxContainer />}
                    </div>
                  </UFOSegment>
                </ConditionalSpotlightWrapper>
              </SplitScreenPanel>
              <SplitScreenResizeDivider
                leftPreviousWidth={panels.panelWidths.inbox.width}
                rightPreviousWidth={
                  panels.planner
                    ? panels.panelWidths.planner.width
                    : panels.panelWidths.board.width
                }
                enableTransitionsCallback={setEnableTransitions}
                shouldHideDivider={!shouldShowInboxDivider}
                isRightMostDivider={
                  Number(panels.planner) + Number(panels.board) === 1
                }
                leftPanelName="inbox"
                rightPanelName={panels.planner ? 'planner' : 'board'}
                handleSetWidthCallback={handleSetPanelWidth}
                handleDoubleClick={handleDoubleClick}
              />
              <ConditionalSpotlightWrapper
                shouldWrap={
                  newInviteeStaggeredActiveSpotlight === PLANNER_PANEL_SPOTLIGHT
                }
                renderSpotlight={renderNewInviteeStaggeredPPDiscoverySpotlight}
                spotlightTargetName={PLANNER_PANEL_SPOTLIGHT}
                wrapperClassName={styles.plannerContent}
              >
                <SplitScreenPanel
                  ref={plannerRef}
                  panelName="planner"
                  isHidden={!panels.planner}
                  panelWidth={plannerWidth}
                  enableTransitions={enableTransitions}
                  isCollapsed={isPlannerCollapsed && plannerWidth === 0}
                  onResize={debouncedCheckForIslandOverlap}
                  shouldGrow={isBoardCollapsed || !panels.board}
                >
                  <div
                    // The skip navigation link uses this ID to help users jump straight to this section of the screen.
                    id="trello-planner-root"
                    className={cx(styles.content, {
                      // Explicitly set `single` class here rather than inferring it from the parent
                      // in styles because when in spotlight tour, this component no longer is a child of `splitscreen`.
                      [styles.single]: !areMultiplePanelsOpen,
                    })}
                  >
                    {panels.planner && (
                      <LazyPlanner
                        screenManagerRef={screenManagerRef}
                        plannerRef={fullCalendarRef}
                      />
                    )}
                  </div>
                </SplitScreenPanel>
              </ConditionalSpotlightWrapper>
            </ConditionalSpotlightWrapper>
            <SplitScreenResizeDivider
              leftPreviousWidth={panels.panelWidths.planner.width}
              rightPreviousWidth={panels.panelWidths.board.width}
              enableTransitionsCallback={setEnableTransitions}
              shouldHideDivider={!shouldShowPlannerDivider}
              isRightMostDivider={panels.board}
              leftPanelName="planner"
              rightPanelName="board"
              handleSetWidthCallback={handleSetPanelWidth}
              handleDoubleClick={handleDoubleClick}
            />
            <SplitScreenPanel
              ref={boardRef}
              panelName="board"
              isHidden={!panels.board}
              panelWidth={boardWidth}
              enableTransitions={enableTransitions}
              isCollapsed={isBoardCollapsed && boardWidth === 0}
              onResize={debouncedCheckForIslandOverlap}
              shouldGrow
            >
              <UFOSegment name="board-view">
                <div
                  // The skip navigation link uses this ID to help users jump straight to this section of the screen.
                  id="trello-board-root"
                  className={styles.content}
                >
                  <TrelloBoard />
                </div>
              </UFOSegment>
            </SplitScreenPanel>
          </div>
          <PanelNavigation
            {...panels}
            islandRef={islandRef}
            configuration={configuration}
            toggleInbox={toggleInbox}
            togglePlanner={togglePlanner}
            toggleBoard={toggleBoard}
            toggleSwitcher={toggleSwitcher}
            isBoardOpenBlocked={isBoardOpenBlocked}
            toggleCallback={toggleCallback}
            hiddenForBulkActions={
              shouldShowBulkActionIsland || shouldShowLoadingIsland
            }
          />
          {configuration === 'panels' && (
            <RovoIsland workspaceId={workspaceId} />
          )}
          {shouldShowLoadingIsland && <BulkActionLoadingIsland />}
          <BulkActionIslandEntryComponent
            isVisible={shouldShowBulkActionIsland && !shouldShowLoadingIsland}
          />
        </SpotlightManager>
      </PlannerRefProvider>
    </div>
  );
};

export const SplitScreenManager: FunctionComponent = () => {
  const { value: isPersonalProdEnabled } = useFeatureGate(
    'trello_personal_productivity_release',
  );

  if (!isPersonalProdEnabled || isEmbeddedDocument() || !isMemberLoggedIn()) {
    return <TrelloBoard />;
  }

  return <SplitScreen />;
};
