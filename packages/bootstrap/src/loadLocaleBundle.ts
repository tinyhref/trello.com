import { getSupportedLocales } from './getSupportedLocales';
import { loadBundle } from './loadBundle';

export async function loadLocaleBundle(locale: string) {
  if (!getSupportedLocales().includes(locale)) {
    throw new Error('Locale not supported');
  }

  return loadBundle(`locale.${locale}`);
}
