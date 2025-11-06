import type { LocationState } from './routerState';

/**
 * Removes the specified search param(s) from a LocationState value.
 *
 * @returns {LocationState} A new LocationState value with the search param(s) removed.
 */
export function removeSearchParamsFromLocation(
  location: LocationState,
  paramNames: string[],
) {
  const searchParams = new URLSearchParams(location.search);
  for (const paramName of paramNames) {
    searchParams.delete(paramName);
  }
  const search = searchParams.toString();
  const updatedLocation: LocationState = {
    ...location,
    search: search === '' ? search : `?${search}`,
  };
  return updatedLocation;
}
