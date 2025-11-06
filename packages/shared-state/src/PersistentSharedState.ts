import {
  TrelloSessionStorage,
  TrelloStorage,
  type StorageKey,
  type StorageKind,
  type StorageProxy,
} from '@trello/storage';

import { SharedState } from './SharedState';

type PersistentSharedStateOptions =
  | {
      storageKey:
        | StorageKey<'localStorage'>
        | (() => StorageKey<'localStorage'>);
      /**
       * Whether to subscribe to changes in other tabs/windows
       * and sync the value in real time. Defaults to true
       */
      syncAcrossBrowser?: boolean;
      /**
       * Whether to use session storage instead of local storage.
       * Defaults to false
       */
      session?: false | undefined;
    }
  | {
      storageKey:
        | StorageKey<'sessionStorage'>
        | (() => StorageKey<'sessionStorage'>);
      /**
       * Whether to subscribe to changes in other tabs/windows
       * and sync the value in real time. Defaults to true
       */
      syncAcrossBrowser?: boolean;
      /**
       * Whether to use session storage instead of local storage.
       * Defaults to false
       */
      session: true;
    };

/**
 * Represents a shared value (can be observed and updated in a shared context)
 * that's also persisted in a lightweight way (think local/session store).
 *
 * See {@link SharedState}.
 */
export class PersistentSharedState<
  TValue extends boolean | number | object | string,
> extends SharedState<TValue> {
  #hasSyncLock: boolean = false;

  constructor(
    initialValue: TValue,
    {
      storageKey,
      session = false,
      syncAcrossBrowser = true,
    }: PersistentSharedStateOptions,
  ) {
    super(initialValue);

    const storage = session ? TrelloSessionStorage : TrelloStorage;

    const resolvedKey =
      typeof storageKey === 'function' ? storageKey() : storageKey;

    this.#initializeStorage(
      storage,
      resolvedKey,
      initialValue,
      syncAcrossBrowser,
    );
  }

  #initializeStorage<TStorageKind extends StorageKind>(
    storage: StorageProxy<TStorageKind>,
    key: StorageKey<TStorageKind>,
    initialValue: TValue,
    syncAcrossBrowser: boolean,
  ) {
    // Initialize the value from storage if it exists
    const existingValue = storage.get(key);
    if (existingValue !== null && existingValue !== initialValue) {
      this.setValue(existingValue);
    }

    // Subscribe to changes and update storage
    this.subscribe((value) => {
      if (this.#hasSyncLock) {
        return;
      }
      storage.set(key, value);
    });

    // Handle cross-browser synchronization if enabled
    if (syncAcrossBrowser) {
      storage.listenSyncedAcrossBrowser(({ key: eventKey, newValue }) => {
        if (eventKey !== key) {
          return;
        }

        const value =
          newValue !== null ? (JSON.parse(newValue) as TValue) : initialValue;

        this.#hasSyncLock = true;
        this.setValue(value);
        this.#hasSyncLock = false;
      });
    }
  }
}
