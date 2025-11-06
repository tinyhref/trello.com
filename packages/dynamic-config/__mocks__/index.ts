import {
  dynamicConfigFlags,
  RegisteredDynamicConfigFlagKey,
} from '../src/data/dynamicConfigFlags';
import type { SupportedFlagTypes } from '../src/dynamicConfig.types';
type Callback = () => void;

const configs = new Map<RegisteredDynamicConfigFlagKey, SupportedFlagTypes>();
const overrides = new Map<RegisteredDynamicConfigFlagKey, SupportedFlagTypes>();
const callbacks = new Map<RegisteredDynamicConfigFlagKey, Callback>();

Object.entries(dynamicConfigFlags).forEach(([key, value]) => {
  configs.set(key as RegisteredDynamicConfigFlagKey, value.defaultValue);
});

const _getFlag = <T extends SupportedFlagTypes>(
  key: RegisteredDynamicConfigFlagKey,
) => {
  return overrides.has(key)
    ? (overrides.get(key) as T)
    : (configs.get(key) as T);
};

const _trigger = (event: RegisteredDynamicConfigFlagKey) => {
  const cb = callbacks.get(event);
  if (cb) {
    cb();
  }
};

/**
 * Eventually we should remove this mock and use the singleton by uncoupling
 * the dynamicConfigClient from the shared state when in tests or unavailable.
 */
export const dynamicConfigClient = {
  all: () => ({
    remote: Object.fromEntries(configs.entries()),
    overrides: Object.fromEntries(overrides.entries()),
  }),
  get: <T extends SupportedFlagTypes>(key: RegisteredDynamicConfigFlagKey) =>
    _getFlag<T>(key),
  getBoolean: (key: RegisteredDynamicConfigFlagKey) => _getFlag<boolean>(key),
  getString: (key: RegisteredDynamicConfigFlagKey) => _getFlag<string>(key),
  getNumber: (key: RegisteredDynamicConfigFlagKey) => _getFlag<number>(key),
  getNumberList: (key: RegisteredDynamicConfigFlagKey) =>
    _getFlag<number[]>(key),
  getStringList: (key: RegisteredDynamicConfigFlagKey) =>
    _getFlag<string[]>(key),
  getTrackedVariation: <T extends SupportedFlagTypes>(
    key: RegisteredDynamicConfigFlagKey,
  ) => _getFlag<T>(key),
  on: (event: RegisteredDynamicConfigFlagKey, cb: Callback) => {
    callbacks.set(event, cb);
  },
  off: (event: RegisteredDynamicConfigFlagKey, cb: Callback) => {
    callbacks.delete(event);
  },
  trigger: (event: RegisteredDynamicConfigFlagKey) => _trigger(event),
  ready: () => Promise.resolve(),
  setOverride: (
    key: RegisteredDynamicConfigFlagKey,
    value: SupportedFlagTypes,
  ) => overrides.set(key, value),
  refineUserData: () => undefined,
  removeOverride: (key: RegisteredDynamicConfigFlagKey) =>
    overrides.delete(key),
  resetOverrides: () => overrides.clear(),

  dynamicConfig: {
    toJson: (type: 'minimal' | 'standard') => '{}',
    getBoolean: () => undefined,
    getString: () => undefined,
    getNumber: () => undefined,
    getNumberList: () => undefined,
    getStringList: () => undefined,
  },
};

export const useDynamicConfig =
  typeof jest !== 'undefined'
    ? jest
        .fn()
        .mockImplementation((key: RegisteredDynamicConfigFlagKey) =>
          dynamicConfigClient.get(key),
        )
    : (key: RegisteredDynamicConfigFlagKey) => dynamicConfigClient.get(key);
