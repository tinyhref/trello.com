import { dynamicConfigClient } from '@trello/dynamic-config';

import type { ConnectionHealth, MonitorStatus } from './backOff.types';
import {
  getDefaultStatusMultipliers,
  getMaxDelay,
  getReconnectDelayBounds,
  jitterStatusMultipliers as defaultJitterStatusMultipliers,
} from './backOffConfig';

/**
 * Calculates the range of exponential back-off for reconnection attempts.
 * The range is calculated based on the status of the user, the number of attempts, and the health of the connection.
 *
 * @param {MonitorStatus} status - The status of the user.
 * @param {number} attemptsCount - The number of reconnection attempts.
 * @param {Record<MonitorStatus, number>} [statusMultipliersOverride] - Custom multipliers for the status.
 * @param {Record<MonitorStatus, number>} [jitterStatusMultipliersOverride] - Custom multipliers for the jitter by status.
 * @param {ConnectionHealth} [connectionHealth='base'] - The health of the connection.
 * @param {number} [baseLowerBoundOverride] - Custom lower bound for the back-off range.
 * @param {number} [baseUpperBoundOverride] - Custom upper bound for the back-off range.
 * @param {number} [maxDelayOverride] - Custom maximum delay for reconnection attempts.
 * @returns {number[]} An array of `[lower, upper]` bounds.
 *
 * @example
 * const range = calculateBackOffRange({
 *  status: 'active',
 *  attemptsCount: 0,
 * });
 * // range = [800, 1800]
 */
export function calculateBackOffRange({
  status,
  attemptsCount,
  statusMultipliersOverride,
  jitterStatusMultipliersOverride,
  connectionHealth = 'base',
  baseLowerBoundOverride,
  baseUpperBoundOverride,
  maxDelayOverride,
}: {
  status: MonitorStatus;
  attemptsCount: number;
  statusMultipliersOverride?: Record<MonitorStatus, number>;
  jitterStatusMultipliersOverride?: Record<MonitorStatus, number>;
  connectionHealth?: ConnectionHealth;
  baseLowerBoundOverride?: number;
  baseUpperBoundOverride?: number;
  maxDelayOverride?: number;
}): [number, number] {
  const [baseLowerBound, baseUpperBound] =
    getReconnectDelayBounds(connectionHealth);
  const maxDelay =
    maxDelayOverride ?? getMaxDelay({ status, connectionHealth });
  const statusMultipliers =
    statusMultipliersOverride ?? getDefaultStatusMultipliers();
  const jitterStatusMultipliers =
    jitterStatusMultipliersOverride ?? defaultJitterStatusMultipliers;
  const attemptsMultiplier = Math.pow(2, attemptsCount);
  const totalMultiplier = statusMultipliers[status] * attemptsMultiplier;
  const jitterMultiplier = jitterStatusMultipliers[status];

  // For 2AF we want to try higher jitter for the first reconnects
  // These are temporary flags to test multiple values and see the impact of this change
  const maxFirstActiveDelay = dynamicConfigClient.get<number>(
    'trello_web_max_first_active_delay',
  );
  const maxFirstIdleDelay = dynamicConfigClient.get<number>(
    'trello_web_max_first_idle_delay',
  );
  const tempUpperOverride =
    attemptsCount > 0
      ? undefined
      : status === 'active'
        ? maxFirstActiveDelay
        : maxFirstIdleDelay;

  const lowerBound =
    (baseLowerBoundOverride ?? baseLowerBound) * totalMultiplier;
  const upperBound =
    tempUpperOverride ??
    (baseUpperBoundOverride ?? baseUpperBound) *
      totalMultiplier *
      jitterMultiplier;

  return [Math.min(lowerBound, maxDelay), Math.min(upperBound, maxDelay)];
}
