import { localStorageKeys, sessionStorageKeys } from './data/storageKeys';
import type { StorageKind } from './StorageKind';
import type { StorageKey } from './StorageProxy';

// Used to improve performance of isNecessaryStorageItem
const necessaryKeyPrefixes = [
  ...Object.entries(localStorageKeys).filter(
    ([, value]) => value.category === 'necessary',
  ),
  ...Object.entries(sessionStorageKeys).filter(
    ([, value]) => value.category === 'necessary',
  ),
].map(([key]) => key);

const isNecessaryCache: Record<string, boolean> = {};

/**
 * Check if a given storage item key is necessary.
 * @param key - The key to check.
 * @returns True if the key is necessary, false otherwise.
 */
export const isNecessaryStorageItem = (
  key: StorageKey<StorageKind>,
): boolean => {
  if (key in isNecessaryCache) {
    return isNecessaryCache[key];
  }

  const isKeyNecessary = necessaryKeyPrefixes.some((keyPrefix) =>
    key.startsWith(keyPrefix),
  );

  isNecessaryCache[key] = isKeyNecessary;
  return isKeyNecessary;
};
