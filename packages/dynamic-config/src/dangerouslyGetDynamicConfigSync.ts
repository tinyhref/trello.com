import type { RegisteredDynamicConfigFlagKey } from './data/dynamicConfigFlags';
import { dynamicConfigFlags } from './data/dynamicConfigFlags';
import {
  CLIENT_STORAGE_KEY,
  OVERRIDES_STORAGE_KEY,
} from './dynamicConfig.constants';
import type { FlagSet, SupportedFlagTypes } from './dynamicConfig.types';

const MEMOIZED_KEYS: RegisteredDynamicConfigFlagKey[] = [
  'trello_web_native_current_board_info',
  'trello_web_native_current_board_lists_cards',
] as const;

/**
 * There might be configs that are fetched multiple times per page load,
 * we want to make sure we get a consistent evaluation per page load.
 */
const memoizedConfigValues: Partial<FlagSet> = {};

export const dangerouslyGetDynamicConfigSync = (
  flagKey: RegisteredDynamicConfigFlagKey,
): SupportedFlagTypes => {
  let remoteData;
  try {
    // eslint-disable-next-line no-restricted-syntax -- removing reliance on @trello/storage to reduce quickload.js bundle size
    const remoteDataString = localStorage.getItem(CLIENT_STORAGE_KEY);
    remoteData = remoteDataString ? JSON.parse(remoteDataString) : {};
  } catch (error) {
    remoteData = {};
  }

  let remoteFlags: Partial<
    Record<RegisteredDynamicConfigFlagKey, { value: SupportedFlagTypes }>
  >;
  try {
    remoteFlags = JSON.parse(remoteData?.config ?? '{}');
  } catch (error) {
    remoteFlags = {};
  }

  let overrides;
  try {
    // eslint-disable-next-line no-restricted-syntax -- removing reliance on @trello/storage to reduce quickload.js bundle size
    const overridesString = localStorage.getItem(OVERRIDES_STORAGE_KEY);
    overrides = overridesString ? JSON.parse(overridesString) : {};
  } catch (error) {
    overrides = {};
  }

  const keyRemote = remoteFlags[flagKey]?.value;
  const keyOverride = overrides[flagKey];
  const defaultFlagValue = dynamicConfigFlags[flagKey].defaultValue;

  const flagValue = keyOverride ?? keyRemote ?? defaultFlagValue;

  if (MEMOIZED_KEYS.includes(flagKey)) {
    // Memoize the value
    if (memoizedConfigValues[flagKey] === undefined) {
      memoizedConfigValues[flagKey] = flagValue;
    }
    return memoizedConfigValues[flagKey]!;
  }

  return flagValue;
};
