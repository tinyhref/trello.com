import type { DragLocationHistory } from '@atlaskit/pragmatic-drag-and-drop/types';

import type { PanelNames, Panels, PanelWidth, PanelWidths } from './Panels';
import {
  INBOX_MIN_WIDTH,
  PLANNER_MIN_WIDTH,
  SWITCHER_MIN_WIDTH,
} from './Panels';

// The default widths also happen to be the min widths
const INBOX_DEFAULT_WIDTH = INBOX_MIN_WIDTH;
const PLANNER_DEFAULT_WIDTH = PLANNER_MIN_WIDTH;
const SWITCHER_DEFAULT_WIDTH = SWITCHER_MIN_WIDTH;

const DIVIDER_GUTTER_SIZE = 10;
const TOTAL_MARGIN = 16 * 2;

/**
 * Gets all panels that are currently open except the toggled panel.
 * @param panels - The current state of the panels.
 * @param toggledPanelName - The name of the panel that is being toggled.
 * @returns An array of panel names that are currently open.
 */
export const getOtherOpenPanels = (
  panels: Panels,
  toggledPanelName: PanelNames,
): PanelNames[] => {
  const allPanels: PanelNames[] = ['switcher', 'inbox', 'planner', 'board'];
  return allPanels.filter(
    (panelName) => panelName !== toggledPanelName && panels[panelName],
  );
};

/**
 * Distributes width reduction across multiple panels, prioritizing keeping panels above minimum width
 * @param widthToReduce - the width to reduce
 * @param targetPanels - the panels to distribute the width reduction across
 * @param panelWidths - the widths of the panels, including min and max, as stored in local storage
 * @returns the new widths of the panels
 */
export const distributeWidthReduction = (
  widthToReduce: number,
  targetPanels: PanelNames[],
  panelWidths: PanelWidths,
): Record<PanelNames, number> => {
  const result: Record<PanelNames, number> = {
    switcher: panelWidths.switcher.width,
    inbox: panelWidths.inbox.width,
    planner: panelWidths.planner.width,
    board: panelWidths.board.width,
  };

  // Single panel case - return the current widths
  if (targetPanels.length === 0) {
    return result;
  }

  // Multiple panels case - check if equal distribution would put any panel below minimum
  const equalShare = Math.round(widthToReduce / targetPanels.length);
  const panelsBelowMin = targetPanels.filter(
    (panel) =>
      panelWidths[panel].width - equalShare < panelWidths[panel].minWidth,
  );

  // If no panels would go below minimum, we candistribute equally
  if (panelsBelowMin.length === 0) {
    targetPanels.forEach((panel) => {
      result[panel] = panelWidths[panel].width - equalShare;
    });

    // If some panels would go below minimum, set them to minimum and redistribute remainder
  } else {
    const panelsNotBelowMin = targetPanels.filter(
      (panel) => !panelsBelowMin.includes(panel),
    );

    let remainingWidthToReduce = widthToReduce;

    // Set constrained panels to minimum width and reduce the remaining width by the diff
    panelsBelowMin.forEach((panel) => {
      const { minWidth, width } = panelWidths[panel];
      const reduction = width - minWidth;
      result[panel] = minWidth;
      remainingWidthToReduce -= reduction;
    });

    // Distribute remaining reduction across unconstrained panels
    if (panelsNotBelowMin.length > 0 && remainingWidthToReduce > 0) {
      const remainingShare = Math.round(
        remainingWidthToReduce / panelsNotBelowMin.length,
      );
      panelsNotBelowMin.forEach((panel) => {
        const newWidth = panelWidths[panel].width - remainingShare;
        const { minWidth } = panelWidths[panel];
        result[panel] = Math.max(newWidth, minWidth);
      });
    }
  }

  return result;
};

/**
 * Adjusts the panels' widths if needed, when toggling panels open, to ensure that the other
 * panels' widths are adjusted to accommodate the new panel as it comes into view.
 * @param screenWidth - the width of the screen provided by the resize observer
 * @param toggledPanelName - the name of the panel that is being toggled
 * @param panelWidths - the widths of the panels, including min and max, as stored in local storage
 * @param panels - the current state of the panels, in shared state
 * @returns the new widths of the panels
 */
export const adjustPanelWidthsForToggledPanel = ({
  screenWidth,
  toggledPanelName,
  panelWidths,
  panels,
}: {
  screenWidth: number | undefined;
  toggledPanelName: PanelNames;
  panelWidths: PanelWidths;
  panels: Panels;
}) => {
  const width = screenWidth || window.innerWidth;

  const totalNumPanelsOpen =
    Number(panels.switcher) +
    Number(panels.inbox) +
    Number(panels.planner) +
    Number(panels.board);

  const totalPanelWidths =
    (panels.switcher ? panelWidths['switcher'].width : 0) +
    (panels.inbox ? panelWidths['inbox'].width : 0) +
    (panels.planner ? panelWidths['planner'].width : 0) +
    (panels.board ? panelWidths['board'].width : 0);

  const availablePanelSpace =
    width - TOTAL_MARGIN - DIVIDER_GUTTER_SIZE * (totalNumPanelsOpen - 1);

  // If there's enough space for all panels, no adjustment needed
  if (availablePanelSpace >= totalPanelWidths) {
    return panelWidths;
  }

  const adjustedPanelWidths = { ...panelWidths };
  const toggledPanelWidth = panelWidths[toggledPanelName].minWidth;

  // Get all other open panels
  const otherOpenPanels = getOtherOpenPanels(panels, toggledPanelName);

  // Distribute the width reduction across other open panels
  const distributedWidths = distributeWidthReduction(
    toggledPanelWidth,
    otherOpenPanels,
    panelWidths,
  );

  // Apply the distributed widths
  otherOpenPanels.forEach((panel) => {
    adjustedPanelWidths[panel].width = distributedWidths[panel];
  });

  // Set the toggled panel to its desired width
  adjustedPanelWidths[toggledPanelName].width = toggledPanelWidth;

  return adjustedPanelWidths;
};

/**
 * Computes the max width of a panel based on the other panels open in the screen
 * @param screenWidth - the width of the screen provided by the resize observer
 * @param panels - the current state of the panels, in shared state
 * @param panelName - the name of the panel to compute the max width for
 * @param storedPanelWidths - the widths of the panels, including min and max, as stored in local storage
 * @returns the max width of the panel
 */
export const computePanelMaxWidth = ({
  screenWidth,
  panels,
  panelName,
  storedPanelWidths,
}: {
  screenWidth: number | undefined;
  panels: Panels;
  panelName: PanelNames;
  storedPanelWidths: PanelWidths;
}) => {
  // Use a default if the resize observer doesn't provide width, which it sometimes does not
  const containerWidth = (screenWidth ?? window.innerWidth) - TOTAL_MARGIN;

  const otherOpenPanels = getOtherOpenPanels(panels, panelName as PanelNames);

  // If no other panels are open, this panel can take the full container width
  if (otherOpenPanels.length === 0) {
    return containerWidth;
  }

  // Calculate total minimum width required by other open panels
  const totalOtherPanelsMinWidth = otherOpenPanels.reduce(
    (total, otherPanel) => total + storedPanelWidths[otherPanel].minWidth,
    0,
  );

  // Calculate available width after accounting for dividers and other panels' minimum widths
  const totalDividerWidth = DIVIDER_GUTTER_SIZE * otherOpenPanels.length;
  const availableWidth =
    containerWidth - totalDividerWidth - totalOtherPanelsMinWidth;

  // Ensure the panel can't be smaller than its minimum width
  const { minWidth } = storedPanelWidths[panelName];
  return Math.max(availableWidth, minWidth);
};

/**
 * Computes the width of a single panel based on the screen width, the panel name, and the current state of the panels
 * @param screenWidth - the width of the entire screen
 * @param panelName - the name of the panel you're computing width for
 * @param panels - the panels currently open, gathered from shared state
 * @returns the width of the panel
 */
export const computeSinglePanelWidths = ({
  screenWidth,
  panelName,
  panels,
  storedPanelWidths,
  returnDefaults,
  wasBoardCollapsed = false,
}: {
  screenWidth: number;
  panelName: PanelNames;
  panels: Panels;
  storedPanelWidths: PanelWidths;
  returnDefaults?: boolean;
  wasBoardCollapsed?: boolean;
}): PanelWidth => {
  const containerWidth = screenWidth - TOTAL_MARGIN;

  const panelWidth = (storedPanelWidths[panelName] as PanelWidth) ?? {
    width: 0,
    minWidth: 0,
    maxWidth: 0,
  };

  if (panelName === 'switcher') {
    if (returnDefaults || !panelWidth?.width) {
      panelWidth.width = SWITCHER_DEFAULT_WIDTH;
    } else {
      panelWidth.width = panelWidth.width ?? SWITCHER_MIN_WIDTH;
    }
  }

  if (panelName === 'inbox') {
    if (returnDefaults || !panelWidth.width) {
      panelWidth.width = INBOX_DEFAULT_WIDTH;
    } else {
      panelWidth.width = panelWidth.width ?? INBOX_MIN_WIDTH;
    }
  }

  if (panelName === 'planner') {
    if (returnDefaults || !panelWidth.width) {
      panelWidth.width = PLANNER_DEFAULT_WIDTH;
    } else {
      panelWidth.width = panelWidth.width ?? PLANNER_MIN_WIDTH;
    }
  }

  // Board is a special case because it's the only panel that doesn't have a default width
  // so we need to compute the width based on the other panels' widths
  if (panelName === 'board') {
    let computedWidth = containerWidth;

    if (panels.switcher) {
      computedWidth -=
        (storedPanelWidths.switcher.width || SWITCHER_MIN_WIDTH) +
        DIVIDER_GUTTER_SIZE;
    }
    if (panels.inbox) {
      computedWidth -=
        (storedPanelWidths.inbox.width || INBOX_MIN_WIDTH) +
        DIVIDER_GUTTER_SIZE;
    }
    if (panels.planner) {
      computedWidth -=
        (storedPanelWidths.planner.width || PLANNER_MIN_WIDTH) +
        DIVIDER_GUTTER_SIZE;
    }

    panelWidth.width = Math.max(
      computedWidth,
      storedPanelWidths.board.minWidth,
    );
  }

  panelWidth.maxWidth = computePanelMaxWidth({
    screenWidth,
    panels,
    panelName,
    storedPanelWidths,
  });

  // panelWidth.width = Math.min(panelWidth.width, panelWidth.maxWidth);
  return panelWidth;
};

/**
 * Computes the width of the inbox, planner, and board panels
 * based on the full size of the split screen container and the
 * current state of the panels
 * @param fullSplitScreenContainerSize - The width of the split screen container
 * @param panels - The current state of the panels. Need to use this to force a re-render in the Manager component.
 * @param storedPanelWidths - The widths of the panels currently, as stored in local storage
 * @returns The width of the inbox, planner, and board panels
 */
export const computePanelWidths = ({
  screenWidth,
  panels,
  storedPanelWidths,
  returnDefaults,
  wasBoardCollapsed = false,
}: {
  screenWidth: number | undefined;
  panels: Panels;
  storedPanelWidths: PanelWidths;
  returnDefaults?: boolean;
  wasBoardCollapsed?: boolean;
}): PanelWidths => {
  //use a backup if we don't have screen width from the resize observer, which we sometimes do not
  const width = screenWidth || window.innerWidth;

  return {
    inbox: computeSinglePanelWidths({
      screenWidth: width,
      panelName: 'inbox',
      panels,
      storedPanelWidths,
      returnDefaults,
    }),
    planner: computeSinglePanelWidths({
      screenWidth: width,
      panelName: 'planner',
      panels,
      storedPanelWidths,
      returnDefaults,
    }),
    board: computeSinglePanelWidths({
      screenWidth: width,
      panelName: 'board',
      panels,
      storedPanelWidths,
      returnDefaults,
    }),
    switcher: computeSinglePanelWidths({
      screenWidth: width,
      panelName: 'switcher',
      panels,
      storedPanelWidths,
      returnDefaults,
    }),
  };
};

/**
 * Computes the proposed new width of the panel based on the drag & drop divider's starting and current location,
 * as well as the stored width of the panel when the divider was last dropped.
 * @param location - the location information of the drag & drop divider
 * @param maxWidth - the maximum width of the panel
 * @param minWidth - the minimum width of the panel
 * @param previousWidth - the width of the panel when the divider was last dropped
 * @param isRighthandPanel - whether the panel is the righ-hand panel in this arrangement or not. If it is, we need to subtract width and not add.
 * @returns the proposed width of the panel. If the proposed width is less than half of the minimum width, it will return 0, indicating that the panel should be collapsed.
 */
export const getProposedPanelWidth = ({
  location,
  maxWidth,
  minWidth,
  previousWidth,
  isRighthandPanel,
}: {
  location: DragLocationHistory;
  maxWidth: number;
  minWidth: number;
  previousWidth: number;
  isRighthandPanel: boolean;
}): number => {
  const diffX = location.current.input.clientX - location.initial.input.clientX;

  const proposedWidth = isRighthandPanel
    ? previousWidth - diffX
    : previousWidth + diffX;

  if (proposedWidth < minWidth / 2) {
    return 0;
  }

  // Ensure we don't go below the min or above the max allowed widths
  return Math.min(Math.max(minWidth, proposedWidth), maxWidth);
};
