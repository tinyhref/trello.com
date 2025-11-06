import fastDeepEqual from 'fast-deep-equal';

/**
 * Currently a proxy for fast-deep-equal; isolated in case we ever want to try a
 * different deep equal solution.
 */
export const deepEqual = fastDeepEqual;
