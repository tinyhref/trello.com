import { currentLocale } from '@trello/locale';

import {
  defaultOrdinalFormatter,
  ordinalFormatters,
} from './data/ordinalFormatters';

/**
 * Given a day number, return the ordinal representation of that day for the user's current locale.
 * @param day - The day number to format.
 * @param locale - The locale to use for formatting (default: current locale).
 * @returns A string representing the ordinal day.
 */
export const formatOrdinalDay = (
  day: number,
  locale = currentLocale,
): string => {
  if (!(locale in ordinalFormatters)) {
    return defaultOrdinalFormatter(day);
  }

  return ordinalFormatters[locale](day);
};
