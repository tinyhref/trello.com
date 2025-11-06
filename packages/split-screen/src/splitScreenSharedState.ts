import { PersistentSharedState } from '@trello/shared-state';

import type { PanelWidths } from './Panels';
import { DEFAULT_PANEL_WIDTHS } from './Panels';

export const STORAGE_KEY = 'split-screen-configuration';

export interface ConfigurationState {
  inbox: boolean;
  planner: boolean;
  board: boolean;
  switcher: boolean;
  boardBlocked: boolean;
  panelWidths: PanelWidths;
}

export const splitScreenSharedState =
  new PersistentSharedState<ConfigurationState>(
    {
      board: true,
      inbox: false,
      planner: false,
      switcher: false,
      boardBlocked: false,
      panelWidths: {
        ...DEFAULT_PANEL_WIDTHS,
      },
    },
    { storageKey: STORAGE_KEY, syncAcrossBrowser: false },
  );
