import type { CleanPreload, Preload } from './quickload.types';

export const cleanPreload = (preload: Preload): CleanPreload => {
  return {
    isLoading: preload.isLoading,
    start: preload.start,
    used: preload.used,
    url: preload.url,
  };
};
