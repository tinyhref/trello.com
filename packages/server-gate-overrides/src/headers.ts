import { getServerGateOverridesConfig } from './config';

export const SERVER_GATE_OVERRIDES_HEADER = 'X-Trello-Gate-Override';

/**
 * Looks up the current server gate override configuration and calculates the header
 * value. This can be sent directly as the value for the {@link SERVER_GATE_OVERRIDES_HEADER}
 * header.
 *
 * If both a raw header and gates are present, the raw header will come last
 * so its values will trump any individual gate configuration.
 *
 * @returns the header value representing the current overrides
 */
export const getServerGateOverridesHeaderValue = (): string => {
  const config = getServerGateOverridesConfig();
  const headerParts = Object.entries(config.gates).reduce<string[]>(
    (parts, [gate, value]) => {
      parts.push(`${gate}: ${value}`);
      return parts;
    },
    [],
  );
  if (config.rawHeader) {
    headerParts.push(config.rawHeader);
  }
  return headerParts.join(', ');
};
