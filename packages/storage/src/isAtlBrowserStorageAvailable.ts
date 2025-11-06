import {
  // eslint-disable-next-line no-restricted-imports
  AtlBrowserStorageLocal,
  // eslint-disable-next-line no-restricted-imports
  AtlBrowserStorageSession,
} from '@atlassian/browser-storage-controls';

import type { StorageKind } from './StorageKind';
import { STORAGE_KINDS } from './StorageKind';

/**
 * Function to check if the Atlassian Browser Storage feature is available.
 *
 * @returns boolean
 */
export function isAtlBrowserStorageAvailable(
  storageKind?: StorageKind,
): boolean {
  const isAtlBrowserStorageLocal = !!AtlBrowserStorageLocal?.isAvailable;
  const isAtlBrowserStorageSession = !!AtlBrowserStorageSession?.isAvailable;

  // we want to fail gracefully if the feature is not available
  if (storageKind === STORAGE_KINDS.LOCAL_STORAGE) {
    return isAtlBrowserStorageLocal;
  }

  if (storageKind === STORAGE_KINDS.SESSION_STORAGE) {
    return isAtlBrowserStorageSession;
  }

  return isAtlBrowserStorageLocal && isAtlBrowserStorageSession;
}
