import { TrelloStorage, type StorageKey } from '@trello/storage';

export type ServerGateOverridesConfig = {
  gates: Record<string, boolean>;
  rawHeader: string;
};

export const SERVER_GATE_OVERRIDES_STORAGE_KEY: StorageKey<'localStorage'> =
  'STATSIG_OVERRIDES_SERVER';

/**
 * Fetches the server gate override configuration from storage, or initializes
 * a new configuration if none is found.
 *
 * @returns the configuration represented as a {@link ServerGateOverridesConfig}
 */
export const getServerGateOverridesConfig = (): ServerGateOverridesConfig => {
  return (
    (TrelloStorage.get(
      SERVER_GATE_OVERRIDES_STORAGE_KEY,
    ) as ServerGateOverridesConfig | null) ?? {
      gates: {},
      rawHeader: '',
    }
  );
};

/**
 * Stores the server gate override configuration, silently overwriting any currently
 * stored configuration. The configuration is stored in local storage and is
 * kept in sync across sessions.
 *
 * @param config the {@link ServerGateOverridesConfig} to store
 */
export const setServerGateOverridesConfig = (
  config: ServerGateOverridesConfig,
): void => {
  TrelloStorage.set(SERVER_GATE_OVERRIDES_STORAGE_KEY, config);
};
