/**
 * Normalize a string with diacritics, e.g. "Crème Brulée" -> "Creme Brulee".
 * See: https://stackoverflow.com/a/37511463
 */
export const normalizeDiacritics = (text: string) =>
  text.normalize('NFD').replace(/\p{Diacritic}/gu, '');
