/**
 * For use in browsers that do not support ResizeObserver. Most polyfills for ResizeObserver
 * are around 2KB, which we don't want to include for all users to satisfy a tiny group.
 * Using this stub will not get functionality that relies on ResizeObserver to work, it will
 * just prevent it from throwing the error:
 *
 * `ReferenceError: Can't find variable: ResizeObserver`
 *
 * It can be added conditionally like this:
 *
 * ```
 * if (!hasResizeObserver()) {
 *   window.ResizeObserver = StubResizeObserver;
 * }
 * ```
 */
export class StubResizeObserver implements ResizeObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
}
