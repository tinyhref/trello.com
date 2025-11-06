import type { ReactNode } from 'react';

import { SharedState } from '@trello/shared-state';

export interface GlobalPopoverOptions {
  isOpen: boolean;
  triggerElement: HTMLElement | null;
  show: () => void;
  hide: () => void;
  toggle: () => void;
  title: string;
  reactElement: ReactNode | null;
}

export const GlobalPopoverState = new SharedState<GlobalPopoverOptions>({
  isOpen: false,
  triggerElement: null,
  toggle: () => {},
  hide: () => {},
  show: () => {},
  title: '',
  reactElement: null,
});
