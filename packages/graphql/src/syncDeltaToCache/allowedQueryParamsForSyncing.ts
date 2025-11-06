import type { NestedResource } from '../restResourceResolver/nestedResources';
import { VALID_NESTED_RESOURCES } from '../restResourceResolver/nestedResources';
import type { QueryParam } from '../types';

interface AllowedQueryParamsForSyncing {
  [paramName: string]: Set<QueryParam>;
}

/**
 * Flattens all the 'allowedQueryParamForSyncing' objects into one big
 * 'allowlist' of query params that indicate a delta that is safe to sync
 */
export const getAllAllowedQueryParamsForSyncing = (
  nestedResources: NestedResource[],
  result: AllowedQueryParamsForSyncing = {},
): AllowedQueryParamsForSyncing => {
  nestedResources.forEach((resource) => {
    if (resource.allowedQueryParamForSyncing) {
      Object.entries(resource.allowedQueryParamForSyncing).forEach(
        ([queryParam, allowedValues]) => {
          if (!result[queryParam]) {
            result[queryParam] = new Set<QueryParam>();
          }
          allowedValues.forEach((allowedValue) => {
            result[queryParam].add(allowedValue);
          });
        },
      );
    }

    if (resource.nestedResources) {
      getAllAllowedQueryParamsForSyncing(resource.nestedResources, result);
    }
  });

  return result;
};

export const allowedQueryParamsForSyncing = getAllAllowedQueryParamsForSyncing(
  VALID_NESTED_RESOURCES,
);
