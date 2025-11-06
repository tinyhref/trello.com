/**
 * Returns true if the browser has access to the ResizeObserver global, otherwise,
 * returns false.
 */
export function hasResizeObserver() {
  return 'ResizeObserver' in window;
}
