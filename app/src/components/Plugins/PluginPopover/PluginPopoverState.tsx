import { SharedState } from '@trello/shared-state';

import { type Board } from 'app/scripts/models/Board';
import { type PluginPopoverScreenType } from '../PluginPopover/PluginPopoverScreen';

interface PluginPopoverOptions {
  isOpen: boolean;
  triggerElement: HTMLElement | null;
  title: string;
  popoverScreen: PluginPopoverScreenType | undefined;
  push: (screen: PluginPopoverScreenType) => void;
  hide: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any[];
  board: Board | null;
}

export const PluginPopoverState = new SharedState<PluginPopoverOptions>({
  isOpen: false,
  triggerElement: null,
  title: '',
  content: [],
  popoverScreen: undefined,
  push: () => {},
  hide: () => {},
  board: null,
});
