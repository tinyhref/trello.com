/**
 * Returns `true` if the clicked element is outside the container element.
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

  return true;
};
