import type { LazyExoticComponent } from 'react';
import { lazy, useEffect } from 'react';

import { importWithRetry } from './importWithRetry';
import {
  getLazyComponentFromCache,
  storeLazyComponentInCache,
} from './lazyComponentCache';
import type {
  AnyComponent,
  ModuleWithNamedExport,
  NamedImportFactory,
  UseLazyComponentOptions,
} from './useLazyComponent.types';

/**
 * Lazily load a component from a module with a default named react component
 * @param factory A dynamically imported module
 * @param options Options for configuring useLazyComponent's behavior
 * @param options.preload Boolean indicating whether to start downloading the
 * chunk as soon as the hook is invoked vs waiting for the lazy component to be
 * rendered
 * @param options.namedImport The string name of the named import from the
 * dynamically imported module
 */
export function useLazyComponent<
  TComponent extends AnyComponent,
  TNamedImport extends string,
>(
  factory: NamedImportFactory<TComponent, TNamedImport>,
  options: {
    namedImport: keyof ModuleWithNamedExport<TComponent, TNamedImport>;
    preload?: boolean;
  },
): LazyExoticComponent<TComponent>;

/**
 * A hook which lazily downloads the bundle for the specified component
 * @param factory A function that returns a dynamic import eg. `() =>
 * import('app/src/components/MyComponent')`
 * @param options Options for configuring useLazyComponent's behavior
 * @param options.namedImport The string name of the named import from the
 * dynamically imported module
 * @param options.preload Boolean indicating whether to start downloading the
 * chunk as soon as the hook is invoked vs waiting for the lazy component to be
 * rendered
 */
export function useLazyComponent<
  TComponent extends AnyComponent,
  TNamedImport extends string,
>(
  factory: NamedImportFactory<TComponent, TNamedImport>,
  { namedImport, preload }: UseLazyComponentOptions<TComponent, TNamedImport>,
): LazyExoticComponent<TComponent> {
  useEffect(
    () => {
      if (preload) {
        // Attempt to preload the async chunk with retries, but we don't care
        // if it fails at this point (it will become a failure we _do_ care about
        // when actually trying to render the lazy component)
        importWithRetry(factory as () => Promise<unknown>).catch((e) => {
          console.error('Failed to preload chunk', e);
        });
      }
    },

    // We don't want function reference changes to 'factory' to trigger it being
    // called again. This should never happen, once we've kicked off the
    // download of the async component, we don't ever need to kick it off again
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [preload],
  );

  // If we have already created the lazy component, return it here to avoid
  // repeated calls to lazy()
  const cachedComponent = getLazyComponentFromCache(factory, namedImport);
  if (cachedComponent) {
    return cachedComponent as LazyExoticComponent<TComponent>;
  }

  // If we are dealing with a namedImport, we need to map the module import
  // promise to something that looks like module with a default export so that
  // `lazy()` will accept it
  const namedImportFactory = factory;
  const mappedToDefaultFactory = () =>
    namedImportFactory().then((module) => ({
      default: module[namedImport],
    }));

  // Finally, load the component with lazy() and store it in the cache
  const lazyComponent = lazy(() => importWithRetry(mappedToDefaultFactory));
  storeLazyComponentInCache(factory, namedImport, lazyComponent);

  return lazyComponent;
}
