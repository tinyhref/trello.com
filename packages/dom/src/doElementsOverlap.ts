/**
 * Checks if two HTML elements overlap each other.
 *
 * This function uses the bounding client rect of the elements to determine if they overlap.
 *
 * @param elementA - The first element to check for overlap
 * @param elementB - The second element to check for overlap
 * @returns true if the elements overlap, false otherwise
 */

export const doElementsOverlap = (
  elementA: HTMLElement,
  elementB: HTMLElement,
) => {
  const aRect = elementA.getBoundingClientRect();
  const bRect = elementB.getBoundingClientRect();

  return (
    ((aRect.top < bRect.bottom && aRect.top >= bRect.top) ||
      (aRect.bottom > bRect.top && aRect.bottom <= bRect.bottom) ||
      (aRect.bottom >= bRect.bottom && aRect.top <= bRect.top)) &&
    ((aRect.left < bRect.right && aRect.left >= bRect.left) ||
      (aRect.right > bRect.left && aRect.right <= bRect.right) ||
      (aRect.left < bRect.left && aRect.right > bRect.right))
  );
};
