import { locale as globalLocale } from '@trello/config';
import { Cookies } from '@trello/cookies';
import { localeMatches } from '@trello/locale/localeMatches';
import { normalizeLocale } from '@trello/locale/normalizeLocale';

import { languageParts } from './languageParts';

const FALLBACK_LOCALE = 'en';

export const currentLocale = normalizeLocale(globalLocale);

/*
 * Get a list of preferred locales based on the user's browser
 * settings & preferences. May or may not align with window.locale
 * which is set by the HTML Webpack Plugin
 */
export const getPreferredLanguages = (): string[] =>
  [
    Cookies.get('lang'),
    navigator.language,
    ...(navigator.languages || []),
    FALLBACK_LOCALE,
  ].reduce((result, lang) => {
    if (!lang || result.includes(lang)) {
      return result;
    }
    result.push(normalizeLocale(lang));

    return result;
  }, [] as string[]);

/*
 * Given an ordered list of preferred locales and a list of locales to test,
 * find the first match between the two as the "most preferred" option
 */
export const getMostPreferred = (locales: string[]): string => {
  for (const preferred of getPreferredLanguages()) {
    const matched = locales.find((locale) => localeMatches(preferred, locale));
    if (matched) {
      return matched;
    }
  }

  return FALLBACK_LOCALE;
};

export const usesEnglish = () => languageParts(currentLocale).language === 'en';

export const usesLanguages = (locales: string[]) => {
  return locales.some((locale) => {
    return (
      currentLocale === locale ||
      languageParts(currentLocale).language === locale
    );
  });
};

export const useLanguage = () => {
  const { language, region } = languageParts(currentLocale);

  return {
    language,
    region,
  };
};
