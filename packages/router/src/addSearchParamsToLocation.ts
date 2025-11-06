import type { LocationState } from './routerState';

/**
 * Adds the provided search param(s) to a LocationState value.
 *
 * @returns {LocationState} A new LocationState value with the search param(s) added.
 */
export function addSearchParamsToLocation(
  location: LocationState,
  params: { [key: string]: string },
) {
  const searchParams = new URLSearchParams(location.search);
  for (const [paramName, paramValue] of Object.entries(params)) {
    if (paramName) {
      searchParams.set(paramName, paramValue);
    }
  }
  const search = searchParams.toString();
  const updatedLocation: LocationState = {
    ...location,
    search: search === '' ? search : `?${search}`,
  };
  return updatedLocation;
}
