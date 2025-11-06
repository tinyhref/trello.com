import type { RefObject } from 'react';

import { SharedState } from '@trello/shared-state';

interface ListComposerState {
  isOpen: boolean;
  position: number | null;
  triggerRef: RefObject<HTMLButtonElement> | null;
}

const defaultValue: ListComposerState = {
  isOpen: false,
  position: null,
  triggerRef: null,
};

export const listComposerState = new SharedState<ListComposerState>(
  defaultValue,
);

export const openListComposer = ({
  position,
  triggerRef,
}: {
  position: number;
  triggerRef?: RefObject<HTMLButtonElement> | null;
}) => {
  listComposerState.setValue({
    isOpen: true,
    position,
    triggerRef,
  });
};

export const closeListComposer = () => {
  listComposerState.setValue({
    ...defaultValue,
  });
};
