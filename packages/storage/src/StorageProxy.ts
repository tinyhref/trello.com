import {
  // eslint-disable-next-line no-restricted-imports
  AtlBrowserStorageLocal,
  // eslint-disable-next-line no-restricted-imports
  AtlBrowserStorageSession,
} from '@atlassian/browser-storage-controls';
import { isEmbeddedDocument } from '@trello/browser';

import {
  type LocalStorageKey,
  type SessionStorageKey,
} from './data/storageKeys';
import { InMemoryStorage } from './InMemoryStorage';
import { isAtlBrowserStorageAvailable } from './isAtlBrowserStorageAvailable';
import { isNecessaryStorageItem } from './isNecessaryStorageItem';
import { isStorageAvailable } from './isStorageAvailable';
import type { StorageKind } from './StorageKind';
import { STORAGE_KINDS } from './StorageKind';
import type {
  ErrorListener,
  ErrorListenerArgs,
  Listener,
  ListenerArgs,
} from './types';

type StorageSource = 'atlassian' | 'memory' | 'window';

type AtlBrowserStorage =
  | typeof AtlBrowserStorageLocal
  | typeof AtlBrowserStorageSession;

type StorageKeyPrefix<TStorageKind extends StorageKind> =
  TStorageKind extends 'localStorage'
    ? LocalStorageKey
    : TStorageKind extends 'sessionStorage'
      ? SessionStorageKey
      : never;

/**
 * The StorageKey type consists of any string prefixed with a known
 * value from our storage keys registry.
 */
export type StorageKey<TStorageKind extends StorageKind> =
  `${StorageKeyPrefix<TStorageKind>}${string}`;

/**
 * Wrapper around the browser Storage APIs: localStorage and sessionStorage
 *
 * In special cases a fallback, in-memory store will be used. This should only
 * happen if Trello is being viewed within an embedded context and the browser
 * is preventing access to the Storage API
 */
export class StorageProxy<TStorageKind extends StorageKind> {
  private storage: AtlBrowserStorage | Storage;
  private listeners: Set<Listener>;
  private errorListeners: Set<ErrorListener>;
  private listenersSyncedAcrossBrowser: Set<Listener>;
  public storageSource: StorageSource = 'window';
  public storageKind: TStorageKind;

  private LISTENER_IGNORABLE_KEY_PREFIXES = /^(awc\.)/;

  constructor(storageKind: TStorageKind) {
    this.listeners = new Set();
    this.errorListeners = new Set();
    this.listenersSyncedAcrossBrowser = new Set();
    this.storageKind = storageKind;

    // Memory storage is only used in embedded contexts
    if (isEmbeddedDocument() && !isStorageAvailable(storageKind)) {
      this.storageSource = 'memory';
      this.storage = new InMemoryStorage();
    } else if (isAtlBrowserStorageAvailable(storageKind)) {
      this.storageSource = 'atlassian';

      if (storageKind === STORAGE_KINDS.SESSION_STORAGE) {
        this.storage = AtlBrowserStorageSession;
      } else {
        this.storage = AtlBrowserStorageLocal;
      }
    } else {
      this.storageSource = 'window';
      this.storage = window[storageKind];
    }
    window.addEventListener('storage', this.onStorage);
  }

  onStorage = (e: StorageEvent) => {
    const { key, oldValue, newValue } = e;
    if (!key || key.match(this.LISTENER_IGNORABLE_KEY_PREFIXES)) {
      return;
    }

    this.broadcastChangeFromOtherInstance({ key, oldValue, newValue });
  };

  listen(listener: Listener) {
    this.listeners.add(listener);
  }

  addErrorListener(listener: ErrorListener) {
    this.errorListeners.add(listener);
  }

  removeErrorListener(listener: ErrorListener) {
    this.errorListeners.delete(listener);
  }

  listenSyncedAcrossBrowser(listener: Listener) {
    this.listenersSyncedAcrossBrowser.add(listener);

    // If we change localStorage in the current tab, but are only
    // listening for changes in other tabs, the current tab's
    // listeners won't get run. Thus, we add *all* browser-synced
    // listeners to the list of local listeners
    this.listen(listener);
  }

  unlisten(listener: Listener) {
    this.listeners.delete(listener);
    this.listenersSyncedAcrossBrowser.delete(listener);
  }

  broadcastLocalChange(args: ListenerArgs) {
    this.listeners.forEach((listener: Listener) => {
      listener(args);
    });
  }

  broadcastError(args: ErrorListenerArgs) {
    this.errorListeners.forEach((listener: ErrorListener) => {
      listener(args);
    });
  }

  broadcastChangeFromOtherInstance(args: ListenerArgs) {
    this.listenersSyncedAcrossBrowser.forEach((listener: Listener) => {
      listener(args);
    });
  }

  /**
   * Ensures that the storage source is set to the correct value when the storage is available.
   * Memory storage is not handled here, as it is only used in embedded contexts.
   */
  ensureStorageSource() {
    if (isAtlBrowserStorageAvailable(this.storageKind)) {
      // if we are currently using window storage, we need to switch to AtlBrowserStorage,
      // as it is now available
      if (this.storageSource === 'window') {
        this.storageSource = 'atlassian';

        if (this.storageKind === STORAGE_KINDS.SESSION_STORAGE) {
          this.storage = AtlBrowserStorageSession;
        } else {
          this.storage = AtlBrowserStorageLocal;
        }
      }
    } else if (this.storageSource === 'atlassian') {
      // AtlBrowserStorage is no longer available, so we need to switch to window storage
      this.storageSource = 'window';
      this.storage = window[this.storageKind];
    }
  }

  isEnabled() {
    return !!this.storage;
  }

  /**
   * Sets a new value in storage.
   * Note: MUST be called with a strongly typed StorageKey
   */
  set(
    name: StorageKey<TStorageKind>,
    value: boolean | number | object | string,
  ) {
    try {
      // only verify storage source on set, so that we don't switch sources after setting
      this.ensureStorageSource();

      if (this.storage) {
        const oldValue = this.getRaw(name);
        const newValue = JSON.stringify(value);

        if (
          this.storageSource === 'atlassian' &&
          isNecessaryStorageItem(name)
        ) {
          this.storage.setStrictlyNecessaryItem(name, newValue);
        } else {
          this.storage.setItem(name, newValue);
        }

        this.broadcastLocalChange({ key: name, oldValue, newValue });
      }
    } catch (error) {
      console.warn(error);
      this.broadcastError({
        key: name,
        error,
      });
    }
  }

  /**
   * Gets the requested item from storage.
   * Note: MUST be called with a strongly typed StorageKey
   */
  get(name: StorageKey<TStorageKind>) {
    let retVal = null;
    const rawValue = this.getRaw(name);
    if (rawValue) {
      try {
        retVal = JSON.parse(rawValue);
      } catch (ex) {
        console.warn(ex);
      }
    }

    return retVal;
  }

  getRaw(name: StorageKey<TStorageKind>): string | null {
    return this.storage ? this.storage.getItem(name) : null;
  }

  /**
   * Removes the item from storage.
   * Note: MUST be called with a strongly typed StorageKey
   */
  unset(name: StorageKey<TStorageKind>): void {
    if (this.storage && this.getRaw(name) !== null) {
      this.storage.removeItem(name);
    }
  }

  /**
   * Returns a list of all keys managed by this storage proxy.
   * The list returned is strongly typed and can be used to with any
   * of the other accessor methods.
   */
  getAllKeys = (): StorageKey<TStorageKind>[] => {
    const keySource =
      this.storageSource === 'window' ? this.storage : this.storage.storage;

    return keySource
      ? (Object.keys(keySource) as StorageKey<TStorageKind>[])
      : [];
  };
}

export const TrelloStorage = new StorageProxy(STORAGE_KINDS.LOCAL_STORAGE);
export const TrelloSessionStorage = new StorageProxy(
  STORAGE_KINDS.SESSION_STORAGE,
);
