export type PanelNames = 'board' | 'inbox' | 'planner' | 'switcher';

export type Panels = {
  inbox: boolean;
  planner: boolean;
  board: boolean;
  switcher: boolean;
};

export type PanelWidth = {
  width: number;
  minWidth: number;
  maxWidth: number;
};

export type PanelWidths = {
  inbox: PanelWidth;
  planner: PanelWidth;
  board: PanelWidth;
  switcher: PanelWidth;
};

export const INBOX_MIN_WIDTH = 272;
export const PLANNER_MIN_WIDTH = 400;
export const BOARD_MIN_WIDTH = 400;
export const SWITCHER_MIN_WIDTH = 272;

export const DEFAULT_PANEL_WIDTHS = {
  inbox: {
    minWidth: INBOX_MIN_WIDTH,
    width: INBOX_MIN_WIDTH,
    maxWidth: INBOX_MIN_WIDTH,
  },
  planner: {
    minWidth: PLANNER_MIN_WIDTH,
    width: PLANNER_MIN_WIDTH,
    maxWidth: PLANNER_MIN_WIDTH,
  },
  board: {
    minWidth: BOARD_MIN_WIDTH,
    width: BOARD_MIN_WIDTH,
    maxWidth: BOARD_MIN_WIDTH,
  },
  switcher: {
    minWidth: SWITCHER_MIN_WIDTH,
    width: SWITCHER_MIN_WIDTH,
    maxWidth: SWITCHER_MIN_WIDTH,
  },
} as PanelWidths;
