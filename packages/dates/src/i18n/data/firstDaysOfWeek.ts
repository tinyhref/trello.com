/**
 * The first day of the week for each locale.
 * Only used as a fallback for browsers that don't support `getWeekInfo` or `weekInfo` (namely Firefox)
 * 0 is Sunday, 1 is Monday, etc. to match the array indices of getWeekdays
 */
export const firstDaysOfWeek: Record<string, number> = {
  cs: 1,
  de: 1,
  en: 0,
  'en-AU': 0,
  'en-GB': 1,
  'en-US': 0,
  es: 1,
  fi: 1,
  fr: 1,
  'fr-CA': 1,
  hu: 1,
  it: 1,
  ja: 1,
  nb: 1,
  nl: 1,
  pl: 1,
  pt: 0,
  'pt-BR': 0,
  ru: 1,
  sv: 1,
  th: 0,
  tr: 1,
  uk: 1,
  vi: 1,
  zh: 1,
  'zh-Hans': 1,
  'zh-Hant': 1,
};
export const defaultFirstDayOfWeek = 1;
