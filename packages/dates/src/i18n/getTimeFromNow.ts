type Unit = 'day' | 'hour' | 'minute' | 'month' | 'second' | 'year';

/**
 * Get the value and unit of time from now.  This can then be used in either Intl.RelativeTimeFormat
 * or ReactIntl's FormattedRelativeTime component.
 * @param date - The date to compare to now
 * @returns An object with the value and unit of time from now
 * @example
 * const { value, unit } = getTimeFromNow('2021-01-01T00:00:00.000Z'); // { value: 1, unit: 'day' }
 * new Intl.RelativeTimeFormat(currentLocale, { style: 'long' }).format(value, unit); // "yesterday"
 */
export const getTimeFromNow = (
  date: Date | string,
): { value: number; unit: Unit } => {
  const now = new Date();
  const then = new Date(date);
  let value: number;
  let unit: Unit;

  const diff = now.getTime() - then.getTime();
  const seconds = diff / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const months = days / 30;
  if (Math.abs(seconds) < 60) {
    value = -seconds;
    unit = 'second';
  } else if (Math.abs(minutes) < 60) {
    value = -minutes;
    unit = 'minute';
  } else if (Math.abs(hours) < 24) {
    value = -hours;
    unit = 'hour';
  } else if (Math.abs(months) < 1) {
    value = -days;
    unit = 'day';
  } else if (Math.abs(months) < 12) {
    value = -months;
    unit = 'month';
  } else {
    value = -months / 12;
    unit = 'year';
  }
  value = Math.round(value);
  return { value, unit };
};
