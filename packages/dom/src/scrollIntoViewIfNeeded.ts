/**
 * Polyfill for https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoViewIfNeeded.
 */

export const scrollIntoViewIfNeeded = (
  element: Element | null,
  options?: ScrollIntoViewOptions,
): void => {
  if (!element) {
    return;
  }

  const rect = element.getBoundingClientRect();

  if (rect.bottom > window.innerHeight) {
    element.scrollIntoView(options ?? false);
  } else if (rect.top < 0) {
    element.scrollIntoView(options);
  }
};
