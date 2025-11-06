/**
 * Picks a random number between the start and end values.
 *
 * @param start lower bound
 * @param end upper bound
 *
 * @returns The number between the start and end values.
 *
 * @example
 * const number = randomNumberBetween(1, 10);
 * // number = 5
 *
 */
export function randomNumberBetween(start: number, end: number) {
  const spread = end - start;
  return Math.floor(start + Math.random() * spread);
}
