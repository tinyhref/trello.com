/**
 * Determines whether an element is visible, or if it is hidden for any reason
 * (e.g. its parent is marked `display: none`).
 *
 * Refer to {@link useHasBeenInViewport} if you need to know whether the element
 * has been visible within the viewport.
 *
 * Implementation inspired by jQuery: https://github.com/jquery/jquery/blob/main/src/css/hiddenVisibleSelectors.js
 */
export function isVisible(el: HTMLElement) {
  return Boolean(el.offsetWidth && el.offsetHeight);
}
