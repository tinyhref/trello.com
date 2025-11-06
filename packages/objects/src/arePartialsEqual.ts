import { deepEqual } from './deepEqual';

/**
 * Given a partial object and a superset object, create a matching partial from
 * the latter with the same keys as the given partial, and evaluate both
 * partials using a deep equality check.
 *
 * @example
 * arePartialsEqual({ x: 1 }, { x: 1, y: 2 }); // true
 */
export function arePartialsEqual<T>(partial: Partial<T>, superset: T): boolean {
  // Construct a comparable object from the top-level keys in the partial
  // and the values from the superset object.
  const intersection = Object.keys(partial).reduce((acc, key) => {
    acc[key as keyof T] = superset[key as keyof T];
    return acc;
  }, {} as Partial<T>);

  return deepEqual(partial, intersection);
}
