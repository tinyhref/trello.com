import FeatureGates from '@atlaskit/feature-gate-js-client';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';
import { TrelloStorage } from '@trello/storage';

const PLATFORM_LOCAL_OVERRIDES_KEY = 'PLATFORM_LOCAL_OVERRIDES_KEY';

let isLoaded = false;
let isOverrideInjected = false;
let currentOverrides: Record<string, boolean> = {};

export const loadArbitraryPlatformGateOverrides = () => {
  currentOverrides = TrelloStorage.get(PLATFORM_LOCAL_OVERRIDES_KEY) ?? {};
  isLoaded = true;
};

export const injectArbitraryPlatformGateOverrides = () => {
  if (!isLoaded) {
    loadArbitraryPlatformGateOverrides();
  }
  if (Object.keys(currentOverrides).length === 0) {
    // No overrides set
    if (isOverrideInjected) {
      // Injector is present, but we don't have any overrides, remove it
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- This looks dangerous, but ultimately this function is just assigning the arg to a global window var. When it's undefined, it's effectively the same as "unsetting" the resolver
      setBooleanFeatureFlagResolver(undefined as any);
      isOverrideInjected = false;
    }
    // Injector is not present, and we don't have any overrides, do nothing
  } else {
    // Overrides set
    if (!isOverrideInjected) {
      // Injector is not present, but we have any overrides, add it
      setBooleanFeatureFlagResolver((flagKey) => {
        if (Object.keys(currentOverrides).includes(flagKey)) {
          return currentOverrides[flagKey];
        }
        return FeatureGates.checkGate(flagKey);
      });
      isOverrideInjected = true;
    }
  }
};

const saveArbitraryPlatformGateOverrides = () => {
  TrelloStorage.set(PLATFORM_LOCAL_OVERRIDES_KEY, currentOverrides);
};

export const clearArbitraryPlatformGateOverrides = () => {
  currentOverrides = {};
  TrelloStorage.set(PLATFORM_LOCAL_OVERRIDES_KEY, currentOverrides);
  return currentOverrides;
};

export const getAllArbitraryPlatformGateOverrides = () => {
  if (!isLoaded) {
    loadArbitraryPlatformGateOverrides();
  }
  return currentOverrides;
};

export const setArbitraryPlatformGateOverrides = (
  key: string,
  value: boolean | undefined,
) => {
  if (value === undefined) {
    const { [key]: removed, ...newOverrides } = currentOverrides;
    currentOverrides = newOverrides;
  } else {
    currentOverrides[key] = value;
  }
  saveArbitraryPlatformGateOverrides();
  injectArbitraryPlatformGateOverrides();
  return currentOverrides;
};
