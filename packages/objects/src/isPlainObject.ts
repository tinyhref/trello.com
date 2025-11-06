/**
 * Determines whether the given value is a plain object.
 */
export function isPlainObject<T extends object>(value: unknown): value is T {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return [null, Object.prototype].includes(Object.getPrototypeOf(value));
}
