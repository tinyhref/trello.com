import type { TrelloWindow } from '@trello/window-types';

import { getBundles } from './getBundles';

declare const window: TrelloWindow;

const loaders: { [key: string]: Promise<void> } = {};

export async function loadBundle(bundle: string) {
  if (bundle in loaders) {
    return loaders[bundle];
  }

  const bundles = getBundles();
  if (!(bundle in bundles)) {
    throw new Error('Bundle not supported');
  }

  loaders[bundle] = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.nonce = window.__webpack_nonce__;
    script.crossOrigin = 'anonymous';

    script.onerror = () => {
      reject(new Error('Could not load bundle'));
    };

    script.onload = () => {
      resolve();
    };

    document.head.appendChild(script);
    script.src = bundles[bundle];
  });

  return loaders[bundle];
}
