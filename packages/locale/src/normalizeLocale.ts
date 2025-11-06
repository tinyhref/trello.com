import { languageParts } from './languageParts';

/*
 * Normalize locale languageTags reported from the browser
 * Spec https://tools.ietf.org/html/rfc5646#section-2.1
 * Guide https://www.w3.org/International/articles/language-tags/
 */
export function normalizeLocale(languageTag: string) {
  const cleaned = languageTag.split(/[@.]/)[0];
  const { language, script, region } = languageParts(cleaned);
  const locale = [language];
  if (script) {
    locale.push(script);
  }
  if (region) {
    locale.push(region);
  }

  return locale.join('-');
}
