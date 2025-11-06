import { randomNumberBetween } from './randomNumberBetween';

/**
 * Pick a random number between the range and subtract the time already spent waiting.
 * Delay will be 0 if the time spent is greater than the delay.
 *
 * @param {[number, number]} range - The range of the back-off delay
 * @param {number} [timeSpent=0] - The time already spent waiting
 *
 * @returns {number} Remaining back-off delay in milliseconds
 *
 * @example
 * const delay = getBackOffDelay({ range: [800, 1800] }, 1000);
 * // delay = 432
 * const delay = getBackOffDelay({ range: [800, 1800] }, 2000);
 * // delay = 0
 * const delay = getBackOffDelay({ range: [800, 1800] });
 * // delay = 1234
 */
export const getBackOffDelay = ({
  range,
  timeSpent = 0,
}: {
  range: [number, number];
  timeSpent?: number;
}) => {
  const [lowerBound, upperBound] = range;
  const delay = randomNumberBetween(lowerBound, upperBound);
  return Math.max(delay - timeSpent, 0);
};
