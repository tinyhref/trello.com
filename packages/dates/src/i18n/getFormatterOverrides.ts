import { currentLocale } from '@trello/locale';

import { calendarOverrides, defaultCalendar } from './data/calendarOverrides';

const getCalendarOverride = (
  locale: string,
): Intl.DateTimeFormatOptions['calendar'] | undefined => {
  if (calendarOverrides[locale]) {
    return calendarOverrides[locale];
  }

  return defaultCalendar;
};

/**
 * Get DateTimeFormat override options for a given locale.  This allows us to override the defaults
 * if a certain locale needs to be treated differently. For instance, the Thai locale uses the
 * buddhist calendar by default, but we want to use the gregorian calendar.
 * @param locale Locale to get formatter overrides for (Defaults to current locale)
 * @returns An object containing the DateTimeFormat options to override
 */
export const getFormatterOverrides = (
  locale = currentLocale,
): Intl.DateTimeFormatOptions => {
  const overrides: Intl.DateTimeFormatOptions = {};

  overrides.calendar = getCalendarOverride(locale);
  return overrides;
};
