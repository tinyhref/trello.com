import { getPreloadsFromInitialPath } from './getPreloadsFromInitialPath';
import { OperationToQuickloadUrl } from './operation-to-quickload-url.generated';

type Cache = 'Apollo' | 'ModelCache';
type Operation = keyof typeof OperationToQuickloadUrl;

const deferred = <T>() => {
  let resolve!: (value: PromiseLike<T> | T) => void;
  let reject!: (reason?: string) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return {
    resolve,
    reject,
    promise,
    status: 'pending',
  };
};

/**
 * Factory that signals when a cache has a specified query synced. For example,
 * MemberHeader is the main query loaded. To see when it was loaded to the apollo
 * cache you can use await cacheFactory.waitForQueryHydratedTo('MemberHeader', 'Apollo')
 *
 * To mark a query as complete, you use the markQueryHydratedFor method. This is called from
 * loadApiDataFromQuickLoad, as well as syncQuickloadResultsToCache
 */
export class CacheFactory {
  queryToPromise: {
    [cache in Cache]: {
      [key: Operation]: ReturnType<typeof deferred> | null;
    };
  };

  constructor() {
    const initialPreloadList = getPreloadsFromInitialPath().preloads.map(
      (preload) => preload.queryName,
    );
    const buildHash = () =>
      Object.keys(OperationToQuickloadUrl).reduce((hash, operationName) => {
        return {
          ...hash,
          [operationName]: initialPreloadList.includes(operationName)
            ? deferred()
            : null,
        };
      }, {});

    this.queryToPromise = {
      Apollo: buildHash(),
      ModelCache: buildHash(),
    };
  }

  markQueryHydratedFor(query: Operation, cache: Cache) {
    const deferredPromise = this.queryToPromise[cache][query];
    if (deferredPromise) {
      deferredPromise.resolve(null);
      deferredPromise.status = 'fulfilled';
    }
    return this;
  }

  waitForQueryHydratedTo(query: Operation, cache: Cache) {
    const deferredPromise = this.queryToPromise[cache][query];
    return deferredPromise ? deferredPromise.promise : null;
  }

  isQueryHydratedTo(query: Operation, cache: Cache) {
    const deferredPromise = this.queryToPromise[cache][query];
    return deferredPromise ? deferredPromise.status === 'fulfilled' : false;
  }

  isQueryPending(query: Operation, cache: Cache) {
    const deferredPromise = this.queryToPromise[cache][query];
    return deferredPromise ? deferredPromise.status === 'pending' : false;
  }
}

export const cacheFactory = new CacheFactory();
