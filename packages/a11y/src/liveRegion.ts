/**
 * Utility functions for managing the global live region for screen readers
 */

/**
 * Injects a message to the global live region for screen readers
 * @param message - The message to announce to screen readers
 */
export const injectToLiveRegion = (message: string): void => {
  const liveRegion = document.getElementById('global-live-region');
  if (liveRegion) {
    liveRegion.textContent = message;
  }
};

/**
 * Clears the global live region
 */
export const clearLiveRegion = (): void => {
  const liveRegion = document.getElementById('global-live-region');
  if (liveRegion) {
    liveRegion.textContent = '';
  }
};

/**
 * Injects a message to the live region and clears it after a delay
 * @param message - The message to announce to screen readers
 * @param delay - Time in milliseconds before clearing the message (default: 3000)
 */
export const announceToLiveRegion = (
  message: string,
  delay: number = 3000,
): (() => void) => {
  injectToLiveRegion(message);

  // Clear the message after the specified delay
  const timeoutId = setTimeout(() => {
    clearLiveRegion();
  }, delay);

  return () => clearTimeout(timeoutId);
};
