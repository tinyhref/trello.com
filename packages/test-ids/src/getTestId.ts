import type { TestId } from '..';

/**
 * Helper function to strongly type a test id from a given TestId type
 * This ensures that the test id is correctly typed, and allows us to obfuscate in the future.
 *
 * @example
 * const boardTestId = getTestId<BoardTestIds>('board-loading-skeleton');
 *
 * @param testId The test test id to get.
 *
 * @returns a string of Type T.
 */
export function getTestId<T extends TestId>(testId: T): T {
  return testId;
}
