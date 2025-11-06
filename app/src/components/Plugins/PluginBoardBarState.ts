import { SharedState } from '@trello/shared-state';

import type { Action } from './PluginHeader';

type PluginBoardBarOptions = {
  isOpen: boolean;
  url: string;
  height: number;
  accentColor?: string | undefined;
  callback?: () => void;
  title?: string;
  actions?: Action[];
  resizable?: boolean;
};

export const PluginBoardBarState = new SharedState<PluginBoardBarOptions>({
  isOpen: false,
  url: '',
  height: 0,
  accentColor: undefined,
});
