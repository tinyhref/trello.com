/**
 * A function to generate a unique key for a subscription based on the operation name and variables.
 * Because JSON.stringify does not guarantee consistent ordering of object properties,
 * we need to ensure each field of the variables object is sorted to ensure
 * consistent ordering.
 * @param operationName The operation name of the subscription
 * @param variables The variables of the subscription
 * @returns A unique key for the subscription
 */
export const getUniqueSubscriptionKey = (
  operationName: string,
  variables: Record<string, unknown>,
) => {
  return `${operationName}:${JSON.stringify(variables, (_key, value) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return Object.keys(value)
        .sort()
        .reduce<Record<string, unknown>>((acc, key) => {
          acc[key] = value[key];
          return acc;
        }, {});
    }
    return value;
  })}`;
};
