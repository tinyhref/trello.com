import { currentLocale } from '@trello/locale';

import { getFormatterOverrides } from './getFormatterOverrides';

const formatterOverrides = getFormatterOverrides();

/**
 * Formatter for the day of the month.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 * @example
 * dayOfMonthFormatter.format(new Date()); // "15"
 */
export const dayOfMonthFormatter = new Intl.DateTimeFormat(currentLocale, {
  day: 'numeric',
  ...formatterOverrides,
});

/**
 * Formatter for human readable date strings using full format.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 * @example
 * fullDateFormatter.format(new Date()); // "Saturday, July 13, 2024"
 */
export const fullDateFormatter = new Intl.DateTimeFormat(currentLocale, {
  dateStyle: 'full',
  ...formatterOverrides,
});

/**
 * Formatter for human readable date strings using 'long' format.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 * @example
 * longDateFormatter.format(new Date()); // "January 13, 2013"
 */
export const longDateFormatter = new Intl.DateTimeFormat(currentLocale, {
  dateStyle: 'long',
  ...formatterOverrides,
});

/**
 * Formatter for long month, numeric day, and no year (i.e. `dateStyle: long` but without the year).
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 * @example
 * longDateWithoutYearFormatter.format(new Date()); // "January 13"
 */
export const longDateWithoutYearFormatter = new Intl.DateTimeFormat(
  currentLocale,
  {
    month: 'long',
    day: 'numeric',
    ...formatterOverrides,
  },
);

/**
 * Formatter for human readable date strings using 'long' format and 'short' time format.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 * @example
 * longDateWithTimeFormatter.format(new Date()); // "January 13, 2013, 2:30 PM"
 */
export const longDateWithTimeFormatter = new Intl.DateTimeFormat(
  currentLocale,
  {
    dateStyle: 'long',
    timeStyle: 'short',
    ...formatterOverrides,
  },
);

/**
 *  Formatter for day of week in long format (e.g. "Monday").
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 * @example
 * longDayOfWeekFormatter.format(new Date()); // "Monday"
 */
export const longDayOfWeekFormatter = new Intl.DateTimeFormat(currentLocale, {
  weekday: 'long',
  ...formatterOverrides,
});

/**
 * Formatter for long month and year (i.e. `dateStyle: long` but without the day).
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 * @example
 * longMonthAndYearFormatter.format(new Date()); // "January 2013"
 */
export const longMonthAndYearFormatter = new Intl.DateTimeFormat(
  currentLocale,
  {
    month: 'long',
    year: 'numeric',
    ...formatterOverrides,
  },
);

/**
 * Formatter for dates using the medium date style. (e.g. Jan 13, 2013)
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 * @example
 * mediumDateFormatter.format(new Date()); // "Jan 13, 2013"
 */
export const mediumDateFormatter = new Intl.DateTimeFormat(currentLocale, {
  dateStyle: 'medium',
  ...formatterOverrides,
});

/**
 * Formatter for dates using short month and numeric day (basically `dateStyle: medium` but without the year) (e.g. Jan 13).
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 * @example
 * mediumDateWithoutYearFormatter.format(new Date()); // "Jan 13"
 */
export const mediumDateWithoutYearFormatter = new Intl.DateTimeFormat(
  currentLocale,
  {
    month: 'short',
    day: 'numeric',
    ...formatterOverrides,
  },
);

/**
 * Formatter for dates using medium date style and short time style. (e.g. Jan 13, 2013, 2:30 PM)
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 * @example
 * mediumDateWithTimeFormatter.format(new Date()); // "Jan 13, 2013, 2:30 PM"
 */
export const mediumDateWithTimeFormatter = new Intl.DateTimeFormat(
  currentLocale,
  {
    dateStyle: 'medium',
    timeStyle: 'short',
    ...formatterOverrides,
  },
);

/**
 * Formatter for time using "medium" timeStyle (e.g. "1:13:13 PM").
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 * @example
 * mediumTimeFormatter.format(new Date()); // "1:13:13 PM"
 */
export const mediumTimeFormatter = new Intl.DateTimeFormat(currentLocale, {
  timeStyle: 'medium',
  ...formatterOverrides,
});

/**
 * Formatter for numeric date strings.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 * @example
 * numericDateFormatter.format(new Date()); // "1/13/2013"
 */
export const numericDateFormatter = new Intl.DateTimeFormat(
  currentLocale,
  formatterOverrides,
);

/**
 * Formatter for relative time strings.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat
 * @example
 * relativeTimeFormatter.format(-1, 'day'); // "yesterday"
 */
export const relativeTimeFormatter = new Intl.RelativeTimeFormat(
  currentLocale,
  {
    style: 'long',
  },
);

/**
 * Formatter for day of week in short format (e.g. "Mon").
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 * @example
 * shortDayOfWeekFormatter.format(new Date()); // "Mon"
 */
export const shortDayOfWeekFormatter = new Intl.DateTimeFormat(currentLocale, {
  weekday: 'short',
  ...formatterOverrides,
});

/**
 * Formatter for the abbreviated month name and year.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 * @example
 * shortMonthAndYearFormatter.format(new Date()); // "Oct 2024"
 */
export const shortMonthAndYearFormatter = new Intl.DateTimeFormat(
  currentLocale,
  {
    month: 'short',
    year: 'numeric',
    ...formatterOverrides,
  },
);

/**
 * Formatter for the abbreviated month name.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 * @example
 * shortMonthFormatter.format(new Date()); // "Oct"
 */
export const shortMonthFormatter = new Intl.DateTimeFormat(currentLocale, {
  month: 'short',
  ...formatterOverrides,
});

/**
 * Formatter for human readable time in short format (e.g. "1:13 PM").
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 * @example
 * shortTimeFormatter.format(new Date()); // "1:13 PM"
 */
export const shortTimeFormatter = new Intl.DateTimeFormat(currentLocale, {
  timeStyle: 'short',
  ...formatterOverrides,
});
