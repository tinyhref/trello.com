import { addDays, subMilliseconds } from 'date-fns';

import { currentLocale } from '@trello/locale';

import { getStartOfWeek } from './getStartOfWeek';

/**
 * Given a date, get the end of the week for that date, specific to the user's current locale.
 * @param date - The date to get the end of the week for.
 * @param locale - The locale to use. Defaults to the current locale.
 * @returns The end of the week for the given date.
 */
export const getEndOfWeek = (date: Date, locale = currentLocale): Date => {
  const startOfWeek = getStartOfWeek(date, locale);

  // Add 7 days to the start of the week and subtract 1 millisecond to get the end of the week
  return subMilliseconds(addDays(startOfWeek, 7), 1);
};
