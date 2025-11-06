import type { RefObject } from 'react';
import { useLayoutEffect } from 'react';

import { wasClickOutside } from '@trello/dom';

interface ClickOutsideHandler {
  ref: RefObject<HTMLElement>;
  onClickOutside: (event: MouseEvent) => void;
}

let handlers: ClickOutsideHandler[] = [];

// We capture the target of a mouse down event so we can prevent
// actions from occurring when a mouse down happens _inside_ the element,
// but the mouse-up happens outside of it
let mouseDownTarget: Element | null = null;
const onMouseDown = (event: MouseEvent) => {
  mouseDownTarget = event.target as Element | null;
};

const onClick = (event: MouseEvent) => {
  const clickTarget = event.target as Element | null;

  handlers.forEach((handler) => {
    if (
      wasClickOutside(handler.ref.current, clickTarget) &&
      wasClickOutside(handler.ref.current, mouseDownTarget)
    ) {
      handler.onClickOutside(event);
    }
  });
};

let initialized = false;

const addEventListeners = () => {
  document.addEventListener('click', onClick, true);
  document.addEventListener('mousedown', onMouseDown, true);
  initialized = true;
};

const removeEventListeners = () => {
  document.removeEventListener('click', onClick, true);
  document.removeEventListener('mousedown', onMouseDown, true);
  initialized = false;
};

const registerClickOutsideHandler = (
  ref: RefObject<HTMLElement>,
  onClickOutside: (event: MouseEvent) => void,
) => {
  handlers.push({
    ref,
    onClickOutside,
  });

  if (!initialized) {
    addEventListeners();
  }
};

const unregisterClickOutsideHandler = (
  ref: RefObject<HTMLElement>,
  onClickOutside: (event: MouseEvent) => void,
) => {
  handlers = handlers.filter(
    (handler) =>
      handler.ref !== ref && handler.onClickOutside !== onClickOutside,
  );

  if (initialized && handlers.length === 0) {
    removeEventListeners();
  }
};

/**
 * Adds event handlers to the document to detect if clicks are within or outside a provided ref.
 * If a click is outside the ref, the `handleClickOutside` callback will be called with the
 * click event.
 */
export function useClickOutside<T extends HTMLElement>({
  ref,
  handleClickOutside,
  enabled = true,
}: {
  ref: RefObject<T>;
  handleClickOutside: (e: MouseEvent) => void;
  enabled?: boolean;
}) {
  useLayoutEffect(() => {
    if (enabled) {
      registerClickOutsideHandler(ref, handleClickOutside);
    }

    return () => {
      unregisterClickOutsideHandler(ref, handleClickOutside);
    };
  }, [ref, handleClickOutside, enabled]);
}
