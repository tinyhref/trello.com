/**
 * Type guard utility to help filter out nullable values in an array.
 *
 * @usage
 * const arr = [1, null, 2, undefined, 3].filter(nonNullable);
 */
export function nonNullable<T>(value: T): value is NonNullable<T> {
  return Boolean(value);
}
