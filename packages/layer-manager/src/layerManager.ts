import { useEffect, useState } from 'react';

import type { UnbindFn } from './akPortalEventListener';
import {
  activeAkPortals,
  addAkPortalEventListener,
} from './akPortalEventListener';

// This value must stay in sync with `import { FLAG_GROUP_ID } from '@trello/nachos/experimental-flags';`.
// We duplicate the value because importing it would cause a circular dependency.
const FLAG_GROUP_ID = 'FlagGroup';

export const ELEVATION_ATTR = 'data-elevation';
export const ELEVATION_SELECTOR = `[${ELEVATION_ATTR}]`;

export const getElevation = (element: Element | null) => {
  if (!element) {
    return 0;
  }
  const closestElevatedElement = element.closest?.(ELEVATION_SELECTOR);
  const closestElevation = closestElevatedElement
    ? Number(closestElevatedElement.getAttribute(ELEVATION_ATTR))
    : 0;

  return closestElevation;
};

export const useCurrentElevation = (
  element: Element | null,
  { skip }: { skip: boolean } = { skip: false },
) => {
  const [elevation, setElevation] = useState(() =>
    element ? getElevation(element) : 0,
  );

  useEffect(() => {
    if (skip) {
      return;
    }

    let timeout: number;
    if (!element) {
      setElevation(0);
    } else {
      // Due to race conditions between "react" and "view" renderers, we could face the issues when "elevation" is counted incorrectly
      // With this async call, we're making sure that react renderer will go through the "Message Queue" and decrease the priority of the execution
      // related to the https://trello.atlassian.net/browse/TRELP-2602
      timeout = window.setTimeout(() => setElevation(getElevation(element)));
    }

    return () => {
      window.clearTimeout(timeout);
    };
  }, [element, skip]);

  return elevation;
};

export const getHighestVisibleElevation = () => {
  const elevatedElements = document.querySelectorAll(ELEVATION_SELECTOR);
  let highestElevation = 0;
  for (const elem of elevatedElements) {
    const elevation = elem ? Number(elem.getAttribute(ELEVATION_ATTR)) : 0;
    if (elevation > highestElevation) {
      highestElevation = elevation;
    }
  }

  return highestElevation;
};

// jQuery selectors can be comma-separated.
const IGNORED_OUTSIDE_CLICK_SELECTORS = [
  // Ignore clicks on Flags; these shouldn't be layered as visible elevation.
  `#${FLAG_GROUP_ID}`,
  // Ignore clicks in smart card Atlaskit portals.
  '.smart-links-hover-preview',
  // Ignore clicks in Atlaskit dialogs.
  '.atlaskit-portal [role="dialog"]',
  // Ignore clicks in Atlaskit tooltips.
  '.atlaskit-portal [role="tooltip"]',
  // Ignore clicks in Atlaskit dropdown menus.
  '.atlaskit-portal [role="menu"]',
  // Ignore clicks in Atlaskit buttons.
  '.atlaskit-portal [type="button"]',
  // Editor popovers
  '[data-editor-popup]',
].join(', ');

/**
 * Determines whether a clicked element was 'outside' a containerElement,
 * only returning 'true' for a container at the highest elevation.
 */
export const wasClickOutside = (
  containerElement: Element | null,
  clickedElement: Element | null,
): boolean => {
  // Ignore clicks that haven't specified a container element
  if (!containerElement || !clickedElement) {
    return false;
  }

  // Ignore clicks inside our element
  if (containerElement.contains(clickedElement)) {
    return false;
  }

  // Ignore clicks outside the <body> element, this happens
  // for some extensions (like Grammarly) that render their
  // own popovers outside the <body>
  if (!document.body.contains(clickedElement)) {
    return false;
  }

  if (clickedElement.closest?.(IGNORED_OUTSIDE_CLICK_SELECTORS)) {
    return false;
  }

  // Ignore clicks on active ak spotlights
  if (
    clickedElement.closest?.('.atlaskit-portal') &&
    (activeAkPortals.has('blanket') ||
      activeAkPortals.has('dialog') ||
      activeAkPortals.has('modal') ||
      activeAkPortals.has('spotlight'))
  ) {
    return false;
  }

  // Get our element's elevation
  const closestElevation = getElevation(containerElement);

  // Get the elevation of the click event
  const clickedElevation = getElevation(clickedElement);

  // Get the highest visible elevation
  const highestElevation = getHighestVisibleElevation();

  // If the element being clicked was at a lower elevation than our element,
  // and our element is at the highest elevation, we want to trigger our handler
  return (
    clickedElevation < closestElevation && closestElevation === highestElevation
  );
};

interface ClickOutsideHandler {
  element: Element;
  onClickOutside: (event: MouseEvent) => void;
}

let handlers: ClickOutsideHandler[] = [];

// We capture the target of a mouse down event so we can prevent
// layers from closing when a mouse down happens _inside_ the layer,
// but the mouse-up happens outside of it
let mouseDownTarget: Element | null = null;
const onMouseDown = (event: MouseEvent) => {
  mouseDownTarget = event.target as Element | null;
};

const onClickOrDragStart = (event: DragEvent | MouseEvent) => {
  const clickOrDragStartTarget = event.target as Element | null;

  handlers.forEach((handler) => {
    if (
      wasClickOutside(handler.element, clickOrDragStartTarget) &&
      wasClickOutside(handler.element, mouseDownTarget)
    ) {
      handler.onClickOutside(event);
    }
  });
};

let unbindAkPortalEventListener: UnbindFn;

let initialized = false;
const addEventListeners = () => {
  document.addEventListener('mousedown', onMouseDown, true);
  // eslint-disable-next-line @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop -- needed to close popovers when a drag starts
  document.addEventListener('dragstart', onClickOrDragStart, true);
  document.addEventListener('click', onClickOrDragStart, true);
  document.addEventListener('contextmenu', onClickOrDragStart, true);
  unbindAkPortalEventListener = addAkPortalEventListener();
  initialized = true;
};

const removeEventListeners = () => {
  document.removeEventListener('mousedown', onMouseDown, true);
  document.removeEventListener('dragstart', onClickOrDragStart, true);
  document.removeEventListener('click', onClickOrDragStart, true);
  document.removeEventListener('contextmenu', onClickOrDragStart, true);
  unbindAkPortalEventListener?.();
  initialized = false;
};

export const registerClickOutsideHandler = (
  element: Element,
  onClickOutside: (event: MouseEvent) => void,
) => {
  // When a new 'outside click handler' is registered, we want
  // to simulate a click outside on every currently registered layer
  // at higher or equal elevations. This is to ensure that cases like opening
  // a modal while a nested popover is open, will close _all_ the open popovers
  // (not just the top one)
  const newLayerElevation = getElevation(element);
  handlers
    .filter(
      (handler) =>
        // Don't check for strict equality - if the handler element was rendered
        // via Backbone, it would rerender, which would fail triple equals
        // and trigger a fake click; isEqualNode is sufficient.
        !handler.element.isEqualNode(element) &&
        handler.onClickOutside !== onClickOutside,
    )
    .forEach((handler) => {
      const registeredElevation = getElevation(handler.element);
      if (registeredElevation >= newLayerElevation) {
        const fakeEvent = new MouseEvent('click');
        handler.onClickOutside(fakeEvent);
      }
    });

  handlers.push({
    element,
    onClickOutside,
  });

  if (!initialized) {
    addEventListeners();
  }
};

export const unregisterClickOutsideHandler = (
  element: Element,
  onClickOutside: (event: MouseEvent) => void,
) => {
  handlers = handlers.filter(
    (handler) =>
      handler.element !== element && handler.onClickOutside !== onClickOutside,
  );

  if (initialized && handlers.length === 0) {
    removeEventListeners();
  }
};

interface UseClickOutsideHandlerArgs<T extends HTMLElement> {
  element: T | null;
  handleClickOutside: (e: MouseEvent) => void;
  skip?: boolean;
}

export const useClickOutsideHandler = <T extends HTMLElement>({
  element,
  handleClickOutside,
  skip,
}: UseClickOutsideHandlerArgs<T>) => {
  useEffect(() => {
    let timeout: number;

    if (!skip && element) {
      // Due to race conditions between "react" and "view" renderers, we could face the issues when "elevation" is counted incorrectly
      // With this async call, we're making sure that react renderer will go through the "Message Queue" and decrease the priority of the execution
      // related to the https://trello.atlassian.net/browse/TRELP-2602
      timeout = window.setTimeout(() => {
        registerClickOutsideHandler(element, handleClickOutside);
      });
    }

    return () => {
      if (element) {
        window.clearTimeout(timeout);
        unregisterClickOutsideHandler(element, handleClickOutside);
      }
    };
  }, [element, handleClickOutside, skip]);
};

export const reset = () => {
  removeEventListeners();
  handlers = [];
};
