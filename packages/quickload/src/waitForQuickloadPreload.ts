import { cleanPreload } from './cleanPreload';
import { preloadsHash } from './preloadsHash';
import type { QuickloadResponse } from './quickload.types';

export const preloadErrorMessage = 'Preload URL was never called';

export const waitForQuickloadPreload = (preloadKey: string) => {
  return new Promise<QuickloadResponse>((resolve, reject) => {
    const preloadObject = preloadsHash[preloadKey];
    if (preloadObject !== undefined) {
      preloadObject.used = true;
      if (preloadObject.isLoading) {
        preloadObject.callbacks.push((err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      } else {
        if (preloadObject.error) {
          reject(preloadObject.error);
        } else {
          resolve(preloadObject.data);
        }
      }
      return cleanPreload(preloadObject);
    } else {
      reject(preloadErrorMessage);
    }
  });
};
