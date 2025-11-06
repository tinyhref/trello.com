/**
 * An implementation of the AdvancedDate date structure as
 * defined by https://bitbucket.org/trello/implementation-specs/pull-requests/450
 */
export type AdvancedDate = {
  dateType: string;
  value: number;
};

/**
 * Convert an AdvancedDate into a JS Date object
 */
export const getDateFromAdvancedDate = (advDate: AdvancedDate): Date => {
  if (advDate.dateType === 'absolute') {
    return new Date(advDate.value);
  } else {
    return new Date(Date.now() + advDate.value);
  }
};

// eslint-disable-next-line @trello/enforce-variable-case
const RelativeMsToStringMap = new Map<number, string>([
  [-604800000, 'now-7d'],
  [-1209600000, 'now-14d'],
  [-2592000000, 'now-30d'],
]);

/**
 * Convert an AdvancedDate into a date string to send to
 * the dashboard tiles API
 */
export const getStringFromAdvancedDate = (
  advDate: AdvancedDate,
): string | null => {
  if (advDate.dateType === 'relative') {
    const advDateString = RelativeMsToStringMap.get(advDate.value);
    return advDateString ?? null;
  }
  return null;
};
