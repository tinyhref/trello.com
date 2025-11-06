/**
 * Checks if the error is a QuotaExceeded Error
 * QuotaExceeded looks a bit different depending on the browser
 *
 * @param e
 * @returns
 */
export function isQuotaExceededError(e: unknown): boolean {
  return (
    e instanceof DOMException &&
    // everything except Firefox
    (e.code === 22 ||
      // Firefox
      e.code === 1014 ||
      // test name field too, because code might not be present
      // everything except Firefox
      e.name === 'QuotaExceededError' ||
      // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
  );
}
