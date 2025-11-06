import { subDays } from 'date-fns';

import { currentLocale } from '@trello/locale';

import { getFirstDayOfWeek } from './getFirstDayOfWeek';

/**
 * Given a date, get the start of the week for that date.
 * @param date - The date to get the start of the week for.
 * @param locale - The locale to use. Defaults to the current locale.
 * @returns The start of the week for the given date.
 */
export const getStartOfWeek = (date: Date, locale = currentLocale): Date => {
  const day = date.getDay();

  // Based on the locale, determine how much we need to subtract to get to the start of the week
  const firstDayOfWeek = getFirstDayOfWeek(locale);

  let diff = day - firstDayOfWeek;

  // If this day is before the start of the week, we need to go back to the previous week
  if (diff < 0) {
    diff += 7;
  }

  const newDate = subDays(date, diff);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};
