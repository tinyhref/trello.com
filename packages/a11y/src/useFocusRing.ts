import type {
  FocusEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
} from 'react';
import { useState } from 'react';

export interface FocusRingEventListeners {
  readonly onMouseEnter: MouseEventHandler;
  readonly onMouseLeave: MouseEventHandler;
  readonly onMouseDown: MouseEventHandler;
  readonly onKeyDown: KeyboardEventHandler;
  readonly onKeyUp: KeyboardEventHandler;
  readonly onBlur: FocusEventHandler;
}

/**
 * @param {object} externalEvents
 * mouse/keyboard events to be shimmed
 *
 * @return {array} [hasFocusRing, shimmedEvents]
 *
 * hasFocusRing: boolean; indicating if the component should display a focus
 * ring based on mouse interaction mouseEvents: object; containing shimmed
 *
 * shimmedEvents: object; shimmed mouse/keyboard events to help control focus ring state
 */
export const useFocusRing = (
  externalEvents: Partial<FocusRingEventListeners> = {},
): [boolean, FocusRingEventListeners] => {
  const [hasFocusRing, setHasFocusRing] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [wasActivatedByMouse, setWasActivatedByMouse] = useState(false);

  const enableFocusRing = (): void => {
    if (!isMouseOver || !wasActivatedByMouse) {
      setHasFocusRing(true);
    }
  };

  const shimmedEvents: FocusRingEventListeners = {
    onMouseEnter: (e) => {
      setIsMouseOver(true);
      setHasFocusRing(false);

      if (externalEvents.onMouseEnter) {
        externalEvents.onMouseEnter(e);
      }
    },
    onMouseLeave: (e) => {
      setIsMouseOver(false);
      setHasFocusRing(false);

      if (externalEvents.onMouseLeave) {
        externalEvents.onMouseLeave(e);
      }
    },
    onMouseDown: (e) => {
      setWasActivatedByMouse(true);
      setHasFocusRing(false);

      if (externalEvents.onMouseDown) {
        externalEvents.onMouseDown(e);
      }
    },
    onKeyDown: (e) => {
      setWasActivatedByMouse(false);
      enableFocusRing();

      if (externalEvents.onKeyDown) {
        externalEvents.onKeyDown(e);
      }
    },
    onKeyUp: (e) => {
      enableFocusRing();

      if (externalEvents.onKeyUp) {
        externalEvents.onKeyUp(e);
      }
    },
    onBlur: (e) => {
      setHasFocusRing(false);

      if (externalEvents.onBlur) {
        externalEvents.onBlur(e);
      }
    },
  };

  return [hasFocusRing, shimmedEvents];
};
