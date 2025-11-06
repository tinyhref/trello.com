import type { MouseEvent as ReactMouseEvent } from 'react';
// Given a click on something that should act like a link, should we route it or
// let the browser handle it?  Consequences: routing when the browser should
// handle means that the current tab navigates instead of opening in a new tab
// or something like that; the opposite means we do a page reload instead of
// just a navigation.
export const isModifierKeyPressed = (e: MouseEvent | ReactMouseEvent) => {
  return Boolean(e.ctrlKey || e.metaKey || e.shiftKey || e.button);
};
