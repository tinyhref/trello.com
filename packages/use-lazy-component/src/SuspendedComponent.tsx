import { lazy } from 'react';

/**
 * Indefinitely suspended component. Useful for maintaining a consistent loading
 * state via <Suspense>.
 *
 * @example
 *
 * const isLoading = useMyLoadingLogic();
 *
 * <Suspense fallback={<MyLoadingComponent />}>
 *   {isLoading ? <SuspendedComponent /> : <MyLazyComponent />}
 * </Suspense>
 */
export const SuspendedComponent = lazy(() => new Promise(() => {}));
