/**
 * This is copied from the `error-handling` package, to reduce the number of dependencies
 * this package has (which will allow us to feature gate in more places without circular dependency issues).
 * If you need to modify this logic, consider also updating the `error-handling` package.
 */

const FETCH_CANCELLED_ERRORS = [
  // chrome
  'Failed to fetch',
  // safari
  'cancelled',
  'Load failed',
  // firefox
  'NetworkError when attempting to fetch resource.',
];

export const isFetchCancellationError = (error: Error): boolean =>
  FETCH_CANCELLED_ERRORS.includes(error.message);
