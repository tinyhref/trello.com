import { isSameDay } from 'date-fns';

import { currentLocale } from '@trello/locale';

import { getStartOfWeek } from './getStartOfWeek';

/**
 * Given two dates, returns true if they are in the same week, based on the user's locale.
 * @param date1 - The first date to compare.
 * @param date2 - The second date to compare.
 * @param locale - The locale to use for the comparison. (Default: current locale)
 * @returns True if the two dates are in the same week.
 */
export const isSameWeek = (
  date1: Date,
  date2: Date,
  locale = currentLocale,
): boolean => {
  const startOfWeek1 = getStartOfWeek(date1, locale);
  const startOfWeek2 = getStartOfWeek(date2, locale);
  return isSameDay(startOfWeek1, startOfWeek2);
};
