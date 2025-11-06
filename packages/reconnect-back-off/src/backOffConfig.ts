import type { ConnectionHealth, MonitorStatus } from './backOff.types';

const TEN_MINUTES_IN_MS = 10 * 60 * 1000;

/**
 * The maximum reconnect delay (in ms) that can be reached after exponential back-off. NOTE: At the upper boundary this number will be
 * doubled to avoid correlation of reconnection attempts during severe incidents.
 */
export const getMaxDelay = ({
  status,
  connectionHealth,
}: {
  status: MonitorStatus;
  connectionHealth: ConnectionHealth;
}) => {
  const maxDelays: Record<MonitorStatus, Record<ConnectionHealth, number>> = {
    active: { base: 64000, serverIncident: TEN_MINUTES_IN_MS },
    idle: { base: 450000, serverIncident: TEN_MINUTES_IN_MS },
  };
  return maxDelays[status][connectionHealth];
};

/**
 * Default multipliers used for active vs idle users when calculating delay between reconnection requests.
 */
export const getDefaultStatusMultipliers = (): Record<
  MonitorStatus,
  number
> => ({
  active: 1,
  idle: 15,
});

/**
 * The jitter multipliers used for active vs idle users when calculating delay between reconnection requests.
 */
export const jitterStatusMultipliers: Record<MonitorStatus, number> = {
  active: 1,
  idle: 2,
};

/**
 * The upper and lower boundary (in ms) for the exponential back-off of reconnection attempts.
 * Both the lower and upper bounds will be multiplied by the `total multiplier` (`status multiplier` * `attempts multiplier`).
 * This will result in a range of numbers within which the reconnection delay will fall.
 *
 * @param connectionHealth - The health of the connection, which affects the bounds of the back-off.
 * @returns An array of `[lower, upper]` bounds.
 */
export const getReconnectDelayBounds = (connectionHealth: ConnectionHealth) => {
  const bounds: Record<ConnectionHealth, [number, number]> = {
    base: [800, 2000],
    serverIncident: [800, 4000],
  };
  return bounds[connectionHealth];
};
