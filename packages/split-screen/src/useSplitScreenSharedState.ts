import { useCallback, useEffect, useMemo } from 'react';
import useResizeObserver from 'use-resize-observer';

import { useFeatureGate } from '@trello/feature-gate-client';
import { useIsPlannerDisabled } from '@trello/personal-workspace';
import { useSharedState, useSharedStateSelector } from '@trello/shared-state';

import { DEFAULT_PANEL_WIDTHS, type PanelNames } from './Panels';
import {
  adjustPanelWidthsForToggledPanel,
  computePanelWidths,
} from './SplitScreenResizeHelpers';
import type { ConfigurationState } from './splitScreenSharedState';
import { splitScreenSharedState } from './splitScreenSharedState';

/**
 * Default configuration state for splitscreen if no value has ever been
 * set or if the feature flag is off
 */
const DEFAULT_PANEL_STATE = {
  board: true,
  inbox: false,
  planner: false,
  switcher: false,
  boardBlocked: false,
  panelWidths: { ...DEFAULT_PANEL_WIDTHS },
};

/**
 * Default configuration state for splitscreen in inbox board if no value has ever been
 * set or if the feature flag is off
 */
const DEFAULT_INBOX_PANEL_STATE = {
  board: true,
  inbox: true,
  planner: false,
  switcher: false,
  boardBlocked: true,
  panelWidths: { ...DEFAULT_PANEL_WIDTHS },
};

/**
 * Split screen full state. For use in the SplitScreenManager component
 * as the hook also subscribes to state changes and persists them to
 * localStorage
 */
export const useSplitScreenSharedState = ({
  isInboxBoard,
}: { isInboxBoard?: boolean } = {}) => {
  // use different shared state based on whether this is an inbox board
  // as we do not want to persist the inbox only state across different of boards
  const [panels, setPanels] = useSharedState(splitScreenSharedState);

  if (!panels.panelWidths.switcher) {
    panels.panelWidths.switcher = { ...DEFAULT_PANEL_WIDTHS.switcher };
  }

  const { value: isSplitScreenEnabled } = useFeatureGate(
    'trello_personal_productivity_release',
  );

  const isPlannerDisabled = useIsPlannerDisabled();

  const { width, ref } = useResizeObserver<HTMLElement>({
    onResize: () => {
      setPanels((state: ConfigurationState) => {
        const updatedPanelWidths = computePanelWidths({
          screenWidth: window.innerWidth,
          panels: state,
          storedPanelWidths: state.panelWidths,
        });

        return { ...state, panelWidths: updatedPanelWidths };
      });
    },
  });

  const screenWidth = width ?? window.innerWidth;

  const configuration: 'panels' | 'tabs' =
    screenWidth && screenWidth <= 450 ? 'tabs' : 'panels';

  /**
   * Memoized value for default panel widths to be used in the panels, to set initial widths if stored width is not present.
   */
  const defaultPanelWidths = useMemo(() => {
    return computePanelWidths({
      screenWidth: width,
      panels,
      storedPanelWidths: panels.panelWidths,
    });
  }, [panels, width]);

  const checkForMultiplePanels = useCallback(
    (state: ConfigurationState): boolean => {
      return (
        Number(state.board) +
          Number(state.inbox) +
          Number(state.planner) +
          Number(state.switcher) >
        1
      );
    },
    [],
  );

  /**
   * Memoized value for whether more than one panel is open
   */
  const areMultiplePanelsOpen = useMemo(() => {
    return isSplitScreenEnabled ? checkForMultiplePanels(panels) : false;
  }, [checkForMultiplePanels, isSplitScreenEnabled, panels]);

  /**
   * If the screen size changes from panels to tabs, then close
   * all but the right-most panel
   */
  useEffect(() => {
    if (isInboxBoard) {
      setPanels(() => {
        return DEFAULT_INBOX_PANEL_STATE;
      });
    } else if (isInboxBoard === false && panels.boardBlocked) {
      // reset Panel if isInboxBoard is explicitly set to false
      setPanels((state: ConfigurationState) => {
        return {
          ...state,
          boardBlocked: false,
        };
      });
    }

    // if planner is disabled in enterprise, we should close the planner panel
    if (isPlannerDisabled && panels.planner) {
      if (areMultiplePanelsOpen) {
        setPanels((state) => {
          return {
            ...state,
            planner: false,
          };
        });
      } else {
        // this is a workaround to handle the case where the planner panel is the only panel open
        setPanels(() => {
          return DEFAULT_PANEL_STATE;
        });
      }
    }

    if (configuration === 'tabs') {
      setPanels((state) => {
        if (state.board) {
          return {
            inbox: false,
            planner: false,
            board: true,
            switcher: false,
            boardBlocked: false,
            panelWidths: DEFAULT_PANEL_WIDTHS,
          };
        }
        if (state.planner) {
          return {
            inbox: false,
            planner: true,
            board: false,
            switcher: false,
            boardBlocked: false,
            panelWidths: DEFAULT_PANEL_WIDTHS,
          };
        }
        if (state.switcher) {
          return {
            inbox: false,
            planner: false,
            board: false,
            switcher: true,
            boardBlocked: false,
            panelWidths: DEFAULT_PANEL_WIDTHS,
          };
        }

        return {
          inbox: true,
          planner: false,
          board: false,
          switcher: false,
          boardBlocked: false,
          panelWidths: DEFAULT_PANEL_WIDTHS,
        };
      });
    }
  }, [
    areMultiplePanelsOpen,
    configuration,
    isInboxBoard,
    isPlannerDisabled,
    panels.boardBlocked,
    panels.planner,
    setPanels,
  ]);

  /**
   * Toggle the board panel. No-ops if no other panel is open
   * as you cannot close the last panel or if the feature flag
   * is off
   */
  const toggleBoard = useCallback(() => {
    setPanels((state) => {
      if (!isSplitScreenEnabled) {
        return DEFAULT_PANEL_STATE;
      }

      const board = !state.board;
      const switcher = state.switcher;
      if (!board && !state.inbox && !state.planner && !switcher) {
        return state;
      }
      if (board && configuration === 'tabs') {
        return {
          board,
          inbox: false,
          planner: false,
          switcher: false,
          boardBlocked: false,
          panelWidths: defaultPanelWidths,
        };
      }

      const updatedPanels = {
        inbox: state.inbox,
        planner: state.planner,
        board,
        switcher: state.switcher,
      };

      const toggledCollapsibleBoardPanelWidths = computePanelWidths({
        screenWidth: width,
        panels: updatedPanels,
        storedPanelWidths: state.panelWidths,
      });

      const adjustedCollapsiblePanelWidths = adjustPanelWidthsForToggledPanel({
        panelWidths: toggledCollapsibleBoardPanelWidths,
        panels: updatedPanels,
        toggledPanelName: 'board',
        screenWidth: width,
      });
      return { ...state, board, panelWidths: adjustedCollapsiblePanelWidths };
    });
  }, [
    setPanels,
    isSplitScreenEnabled,
    configuration,
    defaultPanelWidths,
    width,
  ]);

  /**
   * Toggle the inbox panel. No-ops if no other panel is open
   * as you cannot close the last panel or if the feature flag
   * is off
   */
  const toggleInbox = useCallback(() => {
    setPanels((state: ConfigurationState) => {
      if (!isSplitScreenEnabled) {
        return DEFAULT_PANEL_STATE;
      }
      const inbox = !state.inbox;
      if (!inbox && !state.board && !state.planner && !state.switcher) {
        return state;
      }
      if (inbox && configuration === 'tabs') {
        return {
          inbox,
          board: false,
          planner: false,
          switcher: false,
          boardBlocked: false,
          panelWidths: defaultPanelWidths,
        };
      }
      const updatedPanels = {
        inbox,
        planner: state.planner,
        board: state.board,
        switcher: state.switcher,
      };

      const toggledCollapsibleInboxPanelWidths = computePanelWidths({
        screenWidth: width,
        panels: updatedPanels,
        storedPanelWidths: state.panelWidths,
      });
      const adjustedCollapsiblePanelWidths = adjustPanelWidthsForToggledPanel({
        panelWidths: toggledCollapsibleInboxPanelWidths,
        panels: updatedPanels,
        toggledPanelName: 'inbox',
        screenWidth: width,
      });
      return { ...state, inbox, panelWidths: adjustedCollapsiblePanelWidths };
    });
  }, [
    setPanels,
    isSplitScreenEnabled,
    configuration,
    defaultPanelWidths,
    width,
  ]);

  /**
   * Toggle the planner panel. No-ops if no other panel is open
   * as you cannot close the last panel or if the feature flag
   * is off
   */
  const togglePlanner = useCallback(() => {
    setPanels((state: ConfigurationState) => {
      if (!isSplitScreenEnabled) {
        return DEFAULT_PANEL_STATE;
      }
      const planner = !state.planner;
      if (!planner && !state.board && !state.inbox && !state.switcher) {
        return state;
      }
      if (planner && configuration === 'tabs') {
        return {
          planner,
          board: false,
          inbox: false,
          switcher: false,
          boardBlocked: false,
          panelWidths: defaultPanelWidths,
        };
      }

      const updatedPanels = {
        inbox: state.inbox,
        planner,
        board: state.board,
        switcher: state.switcher,
      };

      const collapsiblePanelWidths = computePanelWidths({
        screenWidth: width,
        panels: updatedPanels,
        storedPanelWidths: state.panelWidths || defaultPanelWidths,
      });

      const adjustedCollapsiblePanelWidths = adjustPanelWidthsForToggledPanel({
        screenWidth: width,
        toggledPanelName: 'planner',
        panelWidths: collapsiblePanelWidths,
        panels: updatedPanels,
      });
      return {
        ...state,
        planner,
        panelWidths: adjustedCollapsiblePanelWidths,
      };
    });
  }, [
    setPanels,
    isSplitScreenEnabled,
    configuration,
    defaultPanelWidths,
    width,
  ]);

  /**
   * Toggle the switcher panel. No-ops if no other panel is open
   * as you cannot close the last panel or if the feature flag
   * is off
   */
  const toggleSwitcher = useCallback(() => {
    setPanels((state: ConfigurationState) => {
      if (!isSplitScreenEnabled) {
        return DEFAULT_PANEL_STATE;
      }
      const switcher = !state.switcher;
      if (!switcher && !state.board && !state.inbox && !state.planner) {
        return state;
      }
      if (switcher && configuration === 'tabs') {
        return {
          switcher,
          board: false,
          inbox: false,
          planner: false,
          boardBlocked: false,
          panelWidths: defaultPanelWidths,
        };
      }

      const updatedPanels = {
        inbox: state.inbox,
        planner: state.planner,
        board: state.board,
        switcher,
      };

      const collapsiblePanelWidths = computePanelWidths({
        screenWidth: width,
        panels: updatedPanels,
        storedPanelWidths: state.panelWidths || defaultPanelWidths,
      });

      const adjustedCollapsiblePanelWidths = adjustPanelWidthsForToggledPanel({
        screenWidth: width,
        toggledPanelName: 'switcher',
        panelWidths: collapsiblePanelWidths,
        panels: updatedPanels,
      });
      return {
        ...state,
        switcher,
        panelWidths: adjustedCollapsiblePanelWidths,
      };
    });
  }, [
    setPanels,
    isSplitScreenEnabled,
    configuration,
    defaultPanelWidths,
    width,
  ]);

  /**
   * Memoized value to determine if all three panels are open - for use
   * with split screen resizing
   */
  const areAllThreePanelsOpen = useMemo(() => {
    return isSplitScreenEnabled
      ? panels.board && panels.inbox && panels.planner
      : false;
  }, [isSplitScreenEnabled, panels]);

  /**
   * Memoized value to determine the position of the planner panel
   */
  const plannerPosition = useMemo(() => {
    if (areAllThreePanelsOpen) {
      return 'middle';
    }

    if (isSplitScreenEnabled && !areAllThreePanelsOpen && panels.inbox) {
      return 'rightmost';
    }

    return 'left';
  }, [areAllThreePanelsOpen, isSplitScreenEnabled, panels.inbox]);

  const isBoardOpenBlocked = useMemo(() => {
    return isSplitScreenEnabled ? panels.boardBlocked : false;
  }, [isSplitScreenEnabled, panels.boardBlocked]);

  const resizeAllPanelsToDefault = useCallback(() => {
    setPanels((state: ConfigurationState) => {
      const updatedPanelWidths = computePanelWidths({
        screenWidth: width,
        panels,
        storedPanelWidths: panels.panelWidths,
        returnDefaults: true,
      });

      return { ...state, panelWidths: updatedPanelWidths };
    });
  }, [panels, setPanels, width]);

  const updateResizedPanelWidth = useCallback(
    (panelName: PanelNames, newPanelWidth: number) => {
      setPanels((state: ConfigurationState) => {
        const panelWidths = state.panelWidths;

        panelWidths[panelName].width = newPanelWidth;

        return { ...state, panelWidths };
      });
    },
    [setPanels],
  );

  /**
   * Toggle a panel by name, rather than having to call the specific method
   */
  const togglePanel = useCallback(
    (panelName: PanelNames) => {
      if (panelName === 'board') {
        toggleBoard();
      } else if (panelName === 'inbox') {
        toggleInbox();
      } else if (panelName === 'planner') {
        togglePlanner();
      } else if (panelName === 'switcher') {
        toggleSwitcher();
      }
    },
    [toggleBoard, toggleInbox, togglePlanner, toggleSwitcher],
  );

  return {
    configuration,
    isSplitScreenEnabled,
    isBoardOpenBlocked,
    defaultPanelWidths,
    plannerPosition,
    panels: isSplitScreenEnabled ? panels : DEFAULT_PANEL_STATE,
    areMultiplePanelsOpen,
    resizeAllPanelsToDefault,
    togglePanel,
    toggleBoard,
    toggleInbox,
    togglePlanner,
    toggleSwitcher,
    updateResizedPanelWidth,
    ref,
  };
};

/**
 * Track whether more than one split screen panel is open
 * If feature flag is off, then always returns false
 *
 * @returns {boolean}
 */
export const useAreMultiplePanelsOpen = () => {
  const { value: isSplitScreenEnabled } = useFeatureGate(
    'trello_personal_productivity_release',
  );

  const { board, planner, inbox, switcher } = useSharedStateSelector(
    splitScreenSharedState,
    (state) => ({
      board: state.board,
      planner: state.planner,
      inbox: state.inbox,
      switcher: state.switcher,
    }),
  );

  if (!isSplitScreenEnabled) return false;

  return Number(board) + Number(inbox) + Number(planner) + Number(switcher) > 1;
};

/**
 * Track whether the board panel is open.
 * Returns false if the feature flag is off.
 * @returns {boolean}
 */
export const useIsBoardPanelOpen = () => {
  const { value: isSplitScreenEnabled } = useFeatureGate(
    'trello_personal_productivity_release',
  );
  return useSharedStateSelector(
    splitScreenSharedState,
    useCallback(
      ({ board }: ConfigurationState) => {
        if (!isSplitScreenEnabled) {
          return false;
        }
        return board;
      },
      [isSplitScreenEnabled],
    ),
  );
};

/**
 * Opens the board panel if it is closed and split screen is enabled.
 * @returns {function}
 */
export const useOpenBoardPanel = () => {
  const { value: isSplitScreenEnabled } = useFeatureGate(
    'trello_personal_productivity_release',
  );
  const isOpen = useIsBoardPanelOpen();
  const { toggleBoard } = useSplitScreenSharedState();

  return useCallback(() => {
    if (isSplitScreenEnabled && !isOpen) {
      toggleBoard();
    }
  }, [isOpen, isSplitScreenEnabled, toggleBoard]);
};

/**
 * Track whether the inbox panel is open.
 * Returns false if the feature flag is off.
 * @returns {boolean}
 */
export const useIsInboxPanelOpen = () => {
  const { value: isSplitScreenEnabled } = useFeatureGate(
    'trello_personal_productivity_release',
  );
  return useSharedStateSelector(
    splitScreenSharedState,
    useCallback(
      ({ inbox }: ConfigurationState) => {
        if (!isSplitScreenEnabled) {
          return false;
        }
        return inbox;
      },
      [isSplitScreenEnabled],
    ),
  );
};

/**
 * Track whether the planner panel is open.
 * Returns false if the feature flag is off.
 * @returns {boolean}
 */
export const useIsPlannerPanelOpen = () => {
  const { value: isSplitScreenEnabled } = useFeatureGate(
    'trello_personal_productivity_release',
  );
  return useSharedStateSelector(
    splitScreenSharedState,
    useCallback(
      ({ planner }: ConfigurationState) => {
        if (!isSplitScreenEnabled) {
          return false;
        }
        return planner;
      },
      [isSplitScreenEnabled],
    ),
  );
};

/**
 * Track whether the switcher panel is open.
 * Returns false if the feature flag is off.
 * @returns {boolean}
 */
export const useIsSwitcherPanelOpen = () => {
  const { value: isSplitScreenEnabled } = useFeatureGate(
    'trello_personal_productivity_release',
  );
  return useSharedStateSelector(
    splitScreenSharedState,
    useCallback(
      ({ switcher }: ConfigurationState) => {
        if (!isSplitScreenEnabled) {
          return false;
        }
        return switcher;
      },
      [isSplitScreenEnabled],
    ),
  );
};
