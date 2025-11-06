import { currentLocale } from '@trello/locale';

/**
 * Get the weekdays for the current locale
 * @param locale - the locale to use (Default: locale from `@trello/config`)
 * @returns an array of weekday names
 */
export const getWeekdays = (
  format: Intl.DateTimeFormatOptions['weekday'] = 'long',
  locale = currentLocale,
): string[] => {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: format });
  const weekdays: string[] = [];

  for (let i = 1; i < 8; i++) {
    // Sep 1, 2024 is a Sunday
    weekdays.push(formatter.format(new Date(2024, 8, i)));
  }

  return weekdays;
};
