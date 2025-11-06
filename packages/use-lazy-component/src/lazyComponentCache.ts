import type { LazyExoticComponent } from 'react';

import type {
  AnyComponent,
  NamedImportFactory,
} from './useLazyComponent.types';

const lazyComponentCache = new Map<string, LazyExoticComponent<AnyComponent>>();

const createCacheKey = (
  factory: NamedImportFactory<AnyComponent, string>,
  namedImport: string,
) => {
  return `${factory.toString()}${namedImport}`;
};

/**
 * Given an import factory and named import, get the lazy component from cache
 * @param factory - The import factory
 * @param namedImport - The named import
 * @returns The lazy component if it exists in the cache
 */
export const getLazyComponentFromCache = (
  factory: NamedImportFactory<AnyComponent, string>,
  namedImport: string,
) => {
  const cacheKey = createCacheKey(factory, namedImport);
  return lazyComponentCache.get(cacheKey);
};

/**
 * Given an import factory, named import, and lazy component, store the lazy component in the cache.
 * @param factory - The import factory used to create the lazy component
 * @param namedImport - The named import for loading the lazy component
 * @param lazyComponent - The lazy component to store in the cache
 */
export const storeLazyComponentInCache = (
  factory: NamedImportFactory<AnyComponent, string>,
  namedImport: string,
  lazyComponent: LazyExoticComponent<AnyComponent>,
) => {
  const cacheKey = createCacheKey(factory, namedImport);
  lazyComponentCache.set(cacheKey, lazyComponent);
};
