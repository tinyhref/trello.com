import { currentLocale } from '@trello/locale';

/**
 * Get the months for the current locale
 * @param format - the format to use (Default: 'long')
 * @param locale - the locale to use (Default: locale from `@trello/config`)
 * @returns an array of month names
 */
export const getMonths = (
  format: Intl.DateTimeFormatOptions['month'] = 'long',
  locale = currentLocale,
): string[] => {
  const formatter = new Intl.DateTimeFormat(locale, { month: format });
  const months: string[] = [];

  for (let i = 0; i < 12; i++) {
    months.push(formatter.format(new Date(2024, i, 1)));
  }

  return months;
};
