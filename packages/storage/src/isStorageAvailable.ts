import { isQuotaExceededError } from './isQuotaExceededError';
import type { StorageKind } from './StorageKind';

/**
 * Checks that the Storage API (localStorage or sessionStorage) is supported
 * and available.
 * Browsers can signal inaccessible storage at different points, this attempts
 * to cover all browser behavior by storing a test item.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#testing_for_availability
 *
 * @param type
 * @returns boolean
 */
export function isStorageAvailable(type: StorageKind): boolean {
  let storage;
  try {
    storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e: unknown) {
    // acknowledge QuotaExceededError only if there's something already stored
    return !!(isQuotaExceededError(e) && storage && storage.length !== 0);
  }
}
