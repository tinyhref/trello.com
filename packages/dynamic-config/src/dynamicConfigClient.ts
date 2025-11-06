import { ConfigClient, ConfigCollection } from '@atlaskit/web-config-client';
import { getAaId, getMemberId } from '@trello/authentication';
import { isDesktop, isTouch } from '@trello/browser';
import {
  atlassianFeatureFlagClientKey,
  atlassianFeatureFlagClientUrl,
  environment,
  locale,
} from '@trello/config';
import { Poller } from '@trello/poller';
import { TrelloStorage } from '@trello/storage';

import type { RegisteredDynamicConfigFlagKey } from './data/dynamicConfigFlags';
import { dynamicConfigFlags } from './data/dynamicConfigFlags';
import {
  OVERRIDES_STORAGE_KEY,
  USER_DATA_CACHE_STORAGE_KEY,
  USER_DATA_CACHE_TIMEOUT,
} from './dynamicConfig.constants';
import type {
  ChangeListener,
  ChangeListenerMap,
  DynamicConfigFlagGroups,
  DynamicConfigUser,
  FlagSet,
  SupportedFlagTypes,
  UserData,
  UserDataCache,
} from './dynamicConfig.types';
import {
  dynamicConfigClientSharedState,
  type DynamicConfigClientSharedState,
} from './dynamicConfigClientSharedState';

/**
 * Given a flag key, return the default value for that flag.
 * @param flag key for the feature flag
 * @returns the default value for the feature flag
 */
const getDefaultFlagValue = (
  flag: RegisteredDynamicConfigFlagKey,
): SupportedFlagTypes | undefined => dynamicConfigFlags[flag]?.defaultValue;

/**
 * Type guard to check if a string is a valid dynamic config key.
 * @param flag potential dynamic config key
 * @returns Type guard for dynamic config keys
 */
const isRegisteredDynamicConfigFlagKey = (
  flag: string,
): flag is RegisteredDynamicConfigFlagKey => flag in dynamicConfigFlags;

type ConfigResult<T> = {
  value: T;
};

/**
 * Instanced object that manages the dynamic configuration client.
 */
export class DynamicConfigClient {
  private dynamicConfigUser: DynamicConfigUser | undefined;
  private changeListeners = {} as ChangeListenerMap;
  private initPromise: Promise<void>;
  // We're going to log all warnings and errors to this array so we can
  // display them in the dev console in the future
  private logs: string[] = [];
  // we're going to initililize a poller on every tab just in case
  // the user has closed the one tab making the requests
  private dynamicConfigPoller = new Poller(async (): Promise<void> => {
    await this.fetchConfig();
  });

  /**
   * The dynamic configuration fetched the flags endpoint.
   */
  public dynamicConfig: ConfigCollection | undefined;

  constructor() {
    // Create the initial feature flag user
    this.createInitialUser();

    // Subscribe to changes in the shared state
    dynamicConfigClientSharedState.subscribe(this.onSharedStateChange);

    // Initialize the dynamic config client with a fetch or a hydration
    this.initPromise = this.initializeDynamicConfig();

    // Start polling for config changes
    this.dynamicConfigPoller.start();
  }

  private createInitialUser = (): void => {
    const aaId = getAaId();
    const identifierValue = aaId;

    // Build up our flag user: we want to omit the `identifier` if the aaId
    // is not set, so that the client will generate a UUID
    this.dynamicConfigUser = {};
    if (identifierValue !== null) {
      this.dynamicConfigUser.identifier = {
        type: 'atlassianAccountId',
        value: identifierValue,
      };
    }

    // Add the attributes we know are present at startup
    this.dynamicConfigUser.custom = {
      isDesktop: isDesktop(),
      isTouch: isTouch(),
      locale,
    };

    // Attempt to load cached user information, and hydrate it if we are the same
    // user
    const userData: UserDataCache = TrelloStorage.get(
      USER_DATA_CACHE_STORAGE_KEY,
    );
    const isUserDataExpired =
      userData && Date.now() - userData.lastUpdated > USER_DATA_CACHE_TIMEOUT;
    const sameUser = userData?.key && userData.key === aaId;

    if (userData) {
      if (!isUserDataExpired && sameUser) {
        this.dynamicConfigUser = {
          ...this.dynamicConfigUser,
          custom: {
            ...this.dynamicConfigUser.custom,
            ...userData.data,
          },
        };
      } else {
        TrelloStorage.unset(USER_DATA_CACHE_STORAGE_KEY);
      }
    }
  };

  /**
   * Refines/updates the user data and updates the user data cache.
   * @param data: UserData - The user data to update.
   */
  refineUserData = (data: UserData): void => {
    const cacheData: UserDataCache = {
      lastUpdated: Date.now(),
      key: getMemberId(),
      data,
    };

    const currentUserData = this.dynamicConfigUser?.custom;

    TrelloStorage.set(USER_DATA_CACHE_STORAGE_KEY, cacheData);

    this.dynamicConfigUser = {
      ...this.dynamicConfigUser,
      custom: {
        ...this.dynamicConfigUser?.custom,
        ...data,
      },
    };

    if (JSON.stringify(currentUserData) !== JSON.stringify(data)) {
      this.fetchConfig(true);
    }
  };

  private initializeDynamicConfig = async (): Promise<void> => {
    const fetchedConfig = await this.fetchConfig();

    if (fetchedConfig) {
      this.dynamicConfig = fetchedConfig;
    } else {
      this.logWarning('Failed to initialize dynamic config');
    }
  };

  private logWarning = (message: string): void => {
    this.logs.push(message);

    if (environment === 'dev' || environment === 'local') {
      console.warn(message);
    }
  };

  /**
   * Determines if the config should be fetched.
   *
   * This attempts to safeguard fetching from this client if we're already fetching in another client
   *
   * @returns boolean
   */
  private shouldFetchConfig = (): boolean => {
    const now = Date.now();
    const nextFetchTime =
      dynamicConfigClientSharedState.value.timeStamp +
      (this.dynamicConfigPoller?.getCurrentInterval() || 0);

    return (
      !dynamicConfigClientSharedState.value.isFetching && now >= nextFetchTime
    );
  };

  /**
   * Fetches the dynamic config from the feature flag service.
   *
   * Ideally this should only be called from one client when the user has multiple tabs open
   *
   * @param force: boolean - Whether to force the fetch even if the config was recently fetched or is currently being fetched
   * @returns ConfigCollection | undefined
   */
  private fetchConfig = async (
    force = false,
  ): Promise<ConfigCollection | undefined> => {
    if (this.shouldFetchConfig() || force) {
      dynamicConfigClientSharedState.setValue({
        isFetching: true,
      });

      try {
        const fetchedConfig = await ConfigClient.fetch({
          ffsBaseUrl: atlassianFeatureFlagClientUrl,
          ffsApiKey: atlassianFeatureFlagClientKey,
          // User context to evaluate the configuration against
          context: {
            namespace: 'trello_web',
            identifiers: {
              atlassianAccountId: this.dynamicConfigUser?.identifier?.value,
            },
            // Custom attributes to evaluate the configuration against
            // We can use this to pass in any additional context that we want to use
            metadata: {
              ...this.dynamicConfigUser?.custom,
            },
          },
        });

        if (fetchedConfig?.toJson) {
          dynamicConfigClientSharedState.setValue({
            config: fetchedConfig.toJson('standard'),
            isFetching: false,
            timeStamp: Date.now(),
          });
        }

        return fetchedConfig;
      } catch (error) {
        this.logWarning(`Error fetching dynamic config: ${error}`);
      } finally {
        dynamicConfigClientSharedState.setValue({
          isFetching: false,
        });
      }
    } else {
      if (dynamicConfigClientSharedState.value.config) {
        return ConfigCollection.fromValues(
          dynamicConfigClientSharedState.value.config,
        );
      }
    }
  };

  private onSharedStateChange = (
    state: DynamicConfigClientSharedState,
  ): void => {
    if (state.isFetching) {
      return;
    }

    if (state.config) {
      const previousFlags = this.dynamicConfig ? this.all() : undefined;

      this.dynamicConfig = ConfigCollection.fromValues(state.config);

      const currentFlags = this.all();
      const changedFlags = this.getChangedFlags(currentFlags, previousFlags);

      changedFlags.forEach((changedFlag) => {
        const value = this.get(changedFlag);
        this.trigger(changedFlag, value);
      });
    }
  };

  private getChangedFlags = (
    current: DynamicConfigFlagGroups,
    previous: DynamicConfigFlagGroups = {
      remote: {} as FlagSet,
      overrides: {} as FlagSet,
    },
  ): Set<RegisteredDynamicConfigFlagKey> => {
    const changedFlags = new Set<RegisteredDynamicConfigFlagKey>([]);

    function compareConfigs(o1: FlagSet, o2: FlagSet) {
      const keys = new Set([...Object.keys(o1), ...Object.keys(o2)]);

      keys.forEach((key) => {
        if (!isRegisteredDynamicConfigFlagKey(key)) {
          // this is a flag returned from the feature flag service that we don't know about
          return;
        }

        const flag = key as RegisteredDynamicConfigFlagKey;
        const newValue = JSON.stringify(o1[flag]);
        const oldValue = JSON.stringify(o2[flag]);

        if (newValue !== oldValue) {
          changedFlags.add(flag);
        }
      });
    }

    compareConfigs(current.remote, previous?.remote);
    compareConfigs(current.overrides, previous?.overrides);

    return changedFlags;
  };

  private getConfigFromKey = (key: RegisteredDynamicConfigFlagKey) => {
    const defaultValue = getDefaultFlagValue(key);

    switch (typeof defaultValue) {
      case 'boolean':
        return this.dynamicConfig?.getBoolean(key);
      case 'string':
        return this.dynamicConfig?.getString(key);
      case 'number':
        return this.dynamicConfig?.getNumber(key);
      case 'object':
        if (Array.isArray(defaultValue)) {
          if (defaultValue.length === 0) {
            // we don't know what type the list is, so we'll check both
            const stringList = this.dynamicConfig?.getStringList(key);
            const numberList = this.dynamicConfig?.getNumberList(key);
            return stringList || numberList;
          } else if (typeof defaultValue[0] === 'string') {
            return this.dynamicConfig?.getStringList(key);
          } else if (typeof defaultValue[0] === 'number') {
            return this.dynamicConfig?.getNumberList(key);
          }
        }
        return undefined;
      case 'undefined':
        this.logWarning(`No default value found for ${key}`);
        return undefined;
      default:
        return undefined;
    }
  };

  private getConfig = <T extends SupportedFlagTypes>(
    key: RegisteredDynamicConfigFlagKey,
  ): ConfigResult<SupportedFlagTypes> => {
    const flagConfig = this.getConfigFromKey(key);

    if (!flagConfig) {
      this.logWarning(
        `No dynamic config found for ${key}, returning default value: ${getDefaultFlagValue(
          key,
        )}`,
      );
      return { value: getDefaultFlagValue(key) } as ConfigResult<T>;
    }

    if ('error' in flagConfig) {
      this.logWarning(
        `Error encountered while evaluating dynamic config for ${key}: ${flagConfig.error}`,
      );
      return { value: getDefaultFlagValue(key) } as ConfigResult<T>;
    }

    return flagConfig;
  };

  private getConfigValue = <T>(key: RegisteredDynamicConfigFlagKey): T => {
    const override = this.getOverride(key);

    if (typeof override !== 'undefined') {
      return override as T;
    }

    const flagConfig = this.getConfig(key);
    return flagConfig.value as T;
  };

  /**
   * Gets all flags from the dynamic config.
   * @returns object - The object containing all flags from the dynamic config.
   */
  all = (): DynamicConfigFlagGroups => {
    const remote = {} as FlagSet;

    // This is ugly, but we have no other method for getting all flags from the dynamic config
    const fetchedFlags: Record<
      RegisteredDynamicConfigFlagKey,
      { value: SupportedFlagTypes }
    > = this.dynamicConfig?.toJson
      ? JSON.parse(this.dynamicConfig.toJson('standard'))
      : {};
    for (const [key, { value }] of Object.entries(fetchedFlags)) {
      remote[key as RegisteredDynamicConfigFlagKey] = value;
    }

    const overrides: FlagSet = TrelloStorage.get(OVERRIDES_STORAGE_KEY) || {};
    return { remote, overrides };
  };

  /**
   * Gets the value of a dynamic config flag.
   * @param key - The key of the dynamic config flag.
   * @returns - The value of the dynamic config flag.
   */
  get = <T extends SupportedFlagTypes>(key: RegisteredDynamicConfigFlagKey) => {
    return this.getConfigValue<T>(key);
  };

  /**
   * Gets the value of a dynamic config flag, tracking the exposure.
   * @param key - The key of the dynamic config flag.
   * @param attributes - The attributes to track the exposure with.
   * @param cacheKeySuffix - The cache key suffix, if any.
   * @returns - The value of the dynamic config flag.
   */
  getTrackedVariation = <T extends SupportedFlagTypes>(
    key: RegisteredDynamicConfigFlagKey,
    attributes?: object,
    cacheKeySuffix?: string,
  ): T => {
    const override = this.getOverride(key);

    if (typeof override !== 'undefined') {
      /* TODO: implement triggerExposureEvent
      this.triggerExposureEvent(
        key,
        override,
        'OVERRIDE',
        undefined,
        attributes,
        cacheKeySuffix,
      ); */
      return override as T;
    }

    const evaluatedFlag = this.getConfig(key);
    const value = evaluatedFlag.value;
    /* TODO: implement triggerExposureEvent
    const evaluationDetail = evaluatedFlag.evaluationDetail;
    if (evaluationDetail) {
      const kind = evaluationDetail.reason;
      const ruleId = evaluationDetail.ruleId;

      this.triggerExposureEvent(
        key,
        value,
        kind,
        ruleId,
        attributes,
        cacheKeySuffix,
      );
    }

    Analytics.setFlagEvaluation(key, value);
    */
    return value as T;
  };

  /**
   * Gets a boolean value for a given dynamic config flag key.
   * @param key - The key of the dynamic config flag.
   * @returns boolean
   */
  getBoolean = (key: RegisteredDynamicConfigFlagKey): boolean => {
    return this.getConfigValue<boolean>(key);
  };

  /**
   * Gets a string value for a given dynamic config flag key.
   * @param key - The key of the dynamic config flag.
   * @returns string
   */
  getString = (key: RegisteredDynamicConfigFlagKey): string => {
    return this.getConfigValue<string>(key);
  };

  /**
   * Gets a numeric value for a given dynamic config flag key.
   * @param key - The key of the dynamic config flag.
   * @returns number
   */
  getNumber = (key: RegisteredDynamicConfigFlagKey): number => {
    return this.getConfigValue<number>(key);
  };

  /**
   * Gets an array of string values for a given dynamic config flag key.
   * @param key - The key of the dynamic config flag.
   * @returns string[]
   */
  getStringList = (key: RegisteredDynamicConfigFlagKey): string[] => {
    return this.getConfigValue<string[]>(key);
  };

  /**
   * Gets an array of number values for a given dynamic config flag key.
   * @param key - The key of the dynamic config flag.
   * @returns number[]
   */
  getNumberList = (key: RegisteredDynamicConfigFlagKey): number[] => {
    return this.getConfigValue<number[]>(key);
  };

  /**
   * Registers a change listener for a given dynamic flag key.
   * @param key - The key of the dynamic config flag.
   * @param callback - The callback to be called when the flag changes.
   */
  on = <T extends SupportedFlagTypes>(
    key: RegisteredDynamicConfigFlagKey,
    callback: ChangeListener<T>,
  ): void => {
    if (Object.prototype.hasOwnProperty.call(this.changeListeners, key)) {
      this.changeListeners[key].push(
        callback as ChangeListener<SupportedFlagTypes>,
      );
    } else {
      // Create the first change listener
      this.changeListeners[key] = [
        callback as ChangeListener<SupportedFlagTypes>,
      ];
    }
  };

  /**
   * Unregisters a change listener for a given dynamic flag key.
   * @param key - The key of the dynamic config flag.
   * @param callback - The callback to be removed.
   */
  off = <T extends SupportedFlagTypes>(
    key: RegisteredDynamicConfigFlagKey,
    callback: ChangeListener<T>,
  ): void => {
    if (Object.prototype.hasOwnProperty.call(this.changeListeners, key)) {
      const idx = this.changeListeners[key].indexOf(
        callback as ChangeListener<SupportedFlagTypes>,
      );

      if (idx > -1) {
        this.changeListeners[key].splice(idx, 1);
      }
    }
  };

  /**
   * Triggers a change listener for a given dynamic flag key.
   * @param key - The key of the dynamic config flag.
   * @param current - The current value of the flag.
   */
  trigger = <T extends SupportedFlagTypes>(
    key: RegisteredDynamicConfigFlagKey,
    current: T,
  ): void => {
    if (Object.prototype.hasOwnProperty.call(this.changeListeners, key)) {
      this.changeListeners[key].forEach((listener) => {
        listener(current);
      });
    }
  };

  /**
   * Waits for the dynamic config client to finish the first fetch, and signal that it's ready.
   * @returns Promise<void>
   */
  ready = async (): Promise<void> => {
    await this.initPromise;
  };

  private getOverride = <T extends SupportedFlagTypes>(
    key: RegisteredDynamicConfigFlagKey,
  ): T | undefined => {
    const overrides: FlagSet = TrelloStorage.get(OVERRIDES_STORAGE_KEY);
    if (overrides && Object.prototype.hasOwnProperty.call(overrides, key)) {
      return overrides[key] as T;
    }
  };

  /**
   * Sets an override for a given dynamic config flag key.
   * @param key - The key of the dynamic config flag.
   * @param value - The value to override the flag with.
   */
  setOverride = <T extends SupportedFlagTypes>(
    key: RegisteredDynamicConfigFlagKey,
    value: T,
  ): void => {
    const originalValue = this.get(key);
    const existingOverrides: FlagSet =
      TrelloStorage.get(OVERRIDES_STORAGE_KEY) || {};

    TrelloStorage.set(OVERRIDES_STORAGE_KEY, {
      ...existingOverrides,
      [key]: value,
    });

    if (Object.prototype.hasOwnProperty.call(this.changeListeners, key)) {
      // Call all change listeners for this feature flag
      for (const listener of this.changeListeners[key]) {
        listener(value, originalValue);
      }
    }
  };

  /**
   * Removes an override for a given dynamic config flag key.
   * @param key - The key of the dynamic config flag.
   */
  removeOverride = (key: RegisteredDynamicConfigFlagKey): void => {
    const originalValue = this.get(key);
    const existingOverrides: FlagSet =
      TrelloStorage.get(OVERRIDES_STORAGE_KEY) || {};

    delete existingOverrides[key];

    TrelloStorage.set(OVERRIDES_STORAGE_KEY, existingOverrides);

    if (Object.prototype.hasOwnProperty.call(this.changeListeners, key)) {
      // Call all change listeners for this feature flag
      for (const listener of this.changeListeners[key]) {
        listener(this.get(key), originalValue);
      }
    }
  };

  /**
   * Resets all overrides.
   * This will call all change listeners for all overrides that were just reset.
   */
  resetOverrides = (): void => {
    const overrides: FlagSet = TrelloStorage.get(OVERRIDES_STORAGE_KEY) || {};
    TrelloStorage.set(OVERRIDES_STORAGE_KEY, {});

    // Call change listeners for all overrides that were just reset
    Object.entries(overrides).forEach(([key, originalValue]) => {
      if (
        isRegisteredDynamicConfigFlagKey(key) &&
        Object.prototype.hasOwnProperty.call(this.changeListeners, key)
      ) {
        for (const listener of this.changeListeners[key]) {
          listener(this.get(key), originalValue);
        }
      }
    });
  };
}
