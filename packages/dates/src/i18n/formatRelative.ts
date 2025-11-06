import { differenceInCalendarDays, isSameYear } from 'date-fns';

import { currentLocale } from '@trello/locale';

import type { RelativeFormatConfig } from './data/relativeFormatConfig';
import {
  relativeFormats,
  relativeFormatsWithoutTime,
} from './data/relativeFormats';
import {
  longDayOfWeekFormatter,
  mediumDateFormatter,
  mediumDateWithoutYearFormatter,
  shortTimeFormatter,
} from './formatters';
import { getFormatterOverrides } from './getFormatterOverrides';

type RelativeFormatPeriod = keyof RelativeFormatConfig;

const hourFormatter = new Intl.DateTimeFormat(currentLocale, {
  hour: 'numeric',
  ...getFormatterOverrides(),
});

const dayPartFormatter = new Intl.DateTimeFormat(currentLocale, {
  timeStyle: 'short',
  hour12: true,
  ...getFormatterOverrides(),
});

/**
 * A set of functions used to replace format tokens within the relative format config strings.
 * - __TIME__: The time of the date (e.g. "3:00 PM")
 * - __DATE_NO_YEAR__: The date without the year (e.g. "Jan 13")
 * - __DATE_WITH_YEAR__: The date with the year (e.g. "Jan 13, 2013")
 * - __WEEKDAY__: The full name of the day of the week (e.g. "Monday")
 * - __HOUR__: The hour of the date (e.g. "3 PM")
 * - __DAY_PART__: The day part of the date (e.g. "PM")
 * @example
 * const date = new Date();
 * const formattedRelativeDate = relativeFormats['en-US'].yesterday.replace(token, tokenReplacers[token](date);
 */
const tokenReplacers = {
  __TIME__: (date) => shortTimeFormatter.format(date),
  __DATE_NO_YEAR__: (date) => mediumDateWithoutYearFormatter.format(date),
  __DATE_WITH_YEAR__: (date) => mediumDateFormatter.format(date),
  __WEEKDAY__: (date) => longDayOfWeekFormatter.format(date),
  __HOUR__: (date) => hourFormatter.format(date),
  __DAY_PART__: (date) =>
    dayPartFormatter
      .formatToParts(date)
      .find((part) => part.type === 'dayPeriod')?.value ?? '',
} satisfies Record<string, (date: Date) => string>;

type FormatRelativeOptions = {
  withoutTime?: boolean;
};

/**
 * Formats a date relative to a base date.
 * @param date The date to format.
 * @param baseDate The base date to compare against. Defaults to the current date.
 * @returns The formatted relative date.
 */
export const formatRelative = (
  date: Date,
  baseDate = new Date(),
  options: FormatRelativeOptions = { withoutTime: false },
) => {
  // Determine distance between dates
  const difference = differenceInCalendarDays(date, baseDate);
  if (isNaN(difference)) {
    throw new Error('Invalid date');
  }

  let locale = currentLocale;
  // Fallback to US English if no relative formats are found for the locale
  if (!relativeFormats[locale]) {
    locale = 'en-US';
  }

  const { withoutTime } = options;

  // Based on the distance and the locale, get the appropriate tokenized string
  let period: RelativeFormatPeriod;
  if (difference < -6 && !isSameYear(date, baseDate)) {
    period = 'else';
  } else if (difference < -6) {
    period = 'sameYear';
  } else if (difference < -1) {
    period = 'lastWeek';
  } else if (difference < 0) {
    period = 'yesterday';
  } else if (difference < 1) {
    period = 'today';
  } else if (difference < 2) {
    period = 'tomorrow';
  } else if (difference < 7) {
    period = 'nextWeek';
  } else if (isSameYear(date, baseDate)) {
    period = 'sameYear';
  } else {
    period = 'else';
  }
  const relativeFormat = withoutTime
    ? relativeFormatsWithoutTime[locale][period]
    : relativeFormats[locale][period];
  const tokenizedString =
    typeof relativeFormat === 'function'
      ? relativeFormat(date, baseDate)
      : relativeFormat;

  // Replace tokens with formatted date parts
  return Object.entries(tokenReplacers).reduce(
    (formattedString, [token, replacer]) =>
      formattedString.replace(token, replacer(date)),
    tokenizedString,
  );
};
