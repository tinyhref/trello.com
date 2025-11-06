import { currentLocale } from '@trello/locale';

import {
  datePlaceholders,
  defaultDatePlaceholder,
  defaultTimePlaceholder,
  timePlaceholders,
} from './data/placeholders';

/**
 * Given a locale, return a placeholder string for a date input
 * @param locale - the locale to use (Default: locale from `@trello/config`)
 * @returns a placeholder string for a date input
 */
export const getDatePlaceholder = (locale = currentLocale) => {
  return (
    datePlaceholders[locale] ??
    datePlaceholders[locale.split('-')[0]] ??
    defaultDatePlaceholder
  );
};

/**
 * Given a locale, return a placeholder string for a time input
 * @param locale - the locale to use (Default: locale from `@trello/config`)
 * @returns a placeholder string for a time input
 */
export const getTimePlaceholder = (locale = currentLocale) => {
  return (
    timePlaceholders[locale] ??
    timePlaceholders[locale.split('-')[0]] ??
    defaultTimePlaceholder
  );
};
