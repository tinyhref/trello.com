import { normalizeLocale } from '@trello/locale/normalizeLocale';

/*
 * Returns true if the locales are the same or if one of the
 * locales are a prefix of the other:
 *
 * "en-US" matches "en-US"
 * "en-US" matches "en"
 * "en" matches "en-US"
 * "en-US" does not match "en-GB"
 */
export function localeMatches(localeA: string, localeB: string) {
  let shorter = normalizeLocale(localeA).split('-');
  let longer = normalizeLocale(localeB).split('-');
  if (shorter.length > longer.length) {
    [shorter, longer] = [longer, shorter];
  }

  return shorter.every((part: string, index: number) => longer[index] === part);
}
