// eslint-disable-next-line no-restricted-imports
import { isValid, parse } from 'date-fns';

import { currentLocale } from '@trello/locale';

import { dateFormats, defaultDateFormat } from './data/dateFormats';

/**
 * Given a date string and a list of possible formats, return the first
 * valid date parsed from the string.
 * @param dateString - The date string to parse
 * @param possibleFormats - A list of possible date/time formats
 * @returns A Date object if the string can be parsed, otherwise undefined
 */
const parsePossibleFormats = (
  dateString: string,
  possibleFormats: string[],
): Date | undefined => {
  for (const possibleFormat of possibleFormats) {
    const date = parse(dateString, possibleFormat, new Date());
    // Return the first valid date
    if (isValid(date)) {
      return date;
    }
  }
};

/**
 * Given a localized date string, parse it into a valid date object (or undefined)
 * @param dateString - the date string to parse
 * @param locale - the locale to use (Default: locale from `@trello/config`)
 * @example
 * const currentLocaleDate = parseLocalizedNumericDate('1/13/2013');
 * const enGBDate = parseLocalizedNumericDate('13/1/2013', 'en-GB');
 * @returns date object if the string can be parsed, otherwise undefined
 */
export const parseLocalizedNumericDate = (
  dateString: string,
  locale = currentLocale,
): Date | undefined => {
  // Get format string from locale data. If the locale is not supported, return undefined
  const localeDateFormats =
    dateFormats[locale] ?? dateFormats[locale.split('-')[0]];
  if (!localeDateFormats) {
    return;
  }

  // Try to parse the date string using the locale-specific date formats
  let parsedDate = parsePossibleFormats(dateString, localeDateFormats);
  if (parsedDate) {
    return parsedDate;
  }

  // If no valid date was created, try the fallback date format ('yyyy-M-d')
  parsedDate = parse(dateString, defaultDateFormat, new Date());
  if (isValid(parsedDate)) {
    return parsedDate;
  }
};
