import { SharedState } from '@trello/shared-state';

import type { Action } from './PluginHeader';

interface PluginModalOptions {
  accentColor: string;
  actions: Action[];
  fullscreen: boolean;
  title: string;
  isOpen: boolean;
  url: string;
  height: number;
}

export const PluginModalState = new SharedState<PluginModalOptions>({
  accentColor: '',
  actions: [],
  fullscreen: false,
  title: '',
  isOpen: false,
  url: '',
  height: 0,
});
