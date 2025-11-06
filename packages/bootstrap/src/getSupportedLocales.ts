import { getBundles } from './getBundles';

let supportedLocales: string[];

export function getSupportedLocales() {
  if (supportedLocales) {
    return supportedLocales;
  }

  const bundles = getBundles();
  if (!bundles || !Object.keys(bundles)?.length) {
    throw new Error('No bundles found!');
  }
  supportedLocales = Object.keys(bundles)
    .filter((bundle) => bundle.startsWith('locale.'))
    .map((bundle) => bundle.replace(/^locale\./, ''));

  return supportedLocales;
}
