// Don't import from the root entry point so that we can keep bundle size as low as possible
import { localeMatches } from '@trello/locale/localeMatches';
import { normalizeLocale } from '@trello/locale/normalizeLocale';

import { getSupportedLocales } from './getSupportedLocales';

const DEFAULT_LOCALE = 'en-US';

export function getDefaultLocale() {
  for (const language of navigator.languages) {
    const normalizedLanguage = normalizeLocale(language);

    const match = getSupportedLocales().find((locale) =>
      localeMatches(locale, normalizedLanguage),
    );

    if (match) {
      return match;
    }
  }

  return DEFAULT_LOCALE;
}
