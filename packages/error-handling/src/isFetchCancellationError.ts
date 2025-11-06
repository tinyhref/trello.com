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
