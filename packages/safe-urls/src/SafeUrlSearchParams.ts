/**
 * A utility class that extends from {@link URLSearchParams}, designed for use with the {@link sanitizeUrl} function.
 *
 * Allows consumers to provide string arrays as parameter values, rather than just strings. When an array is provided,
 * each element is independently URI encoded, and joined with an unescaped `,` character. Calling the `get` method for
 * an array parameter will return the JSON stringified array.
 */
export class SafeURLSearchParams extends URLSearchParams {
  private arrayValues: { key: string; value: string[] }[] = [];
  public subtype: string = 'SafeUrl';

  constructor(
    init?: Record<string, string> | string[][] | URLSearchParams | string,
  ) {
    super(init);
  }

  /**
   * Sets the value of a parameter with the specified key. If the provided key already exists, it's value is overridden.
   *
   * If the provided value is an array, each element will be independently URI encoded, and joined with an unescaped `,`
   * character.
   *
   * @param name The name of the parameter key.
   * @param value The value of the parameter.
   */
  public set(name: string, value: string[] | string) {
    if (Array.isArray(value)) {
      this.arrayValues = this.arrayValues.filter(
        (arrValue) => arrValue.key !== name,
      );
      this.arrayValues.push({ key: name, value });
      super.set(name, JSON.stringify(value));
    } else {
      super.set(name, value);
    }
  }

  /**
   * Sets the value of a parameter with the specified key. If the provided key already exists, another key is created
   * with the provided value in addition to the existing key/value pair.
   *
   * If the provided value is an array, each element will be independently URI encoded, and joined with an unescaped `,`
   * character.
   *
   * @param name The name of the parameter key.
   * @param value The value of the parameter.
   */
  public append(name: string, value: string[] | string) {
    if (Array.isArray(value)) {
      this.arrayValues.push({ key: name, value });
      super.set(name, JSON.stringify(value));
    } else {
      super.set(name, value);
    }
  }

  /**
   * Deletes the parameter with the specified key. If the provided key matches multiple parameters, all parameters are removed.
   *
   * If the provided value is an array, each element will be independently URI encoded, and joined with an unescaped `,`
   * character.
   *
   * @param name The name of the parameter key to delete.
   * @param value The value of the parameter to delete. If provided, only keys with a matching value AND name are deleted.
   */
  public delete(name: string, value?: string[] | string) {
    this.arrayValues = this.arrayValues.filter(
      (arrValue) =>
        arrValue.key !== name && (!value || arrValue.value !== value),
    );
    super.delete(name);
  }

  /**
   * Returns a string containing a query string suitable for use in a URL. All parameter keys and values are URI escaped.
   * Array parameters are independently URI escaped, and joined with a `,` character.
   *
   * @returns A string representing this search params object.
   */
  public toString(): string {
    const output: string[] = [];
    for (const key of super.keys()) {
      const foundArrValue = this.arrayValues.find(
        (arrValue) => arrValue.key === key,
      );
      if (foundArrValue) {
        const valueComponents: string[] = [];
        for (const valueComponent of foundArrValue.value) {
          valueComponents.push(encodeURIComponent(valueComponent));
        }
        output.push(`${encodeURIComponent(key)}=${valueComponents.join(',')}`);
      } else {
        output.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(super.get(key)!)}`,
        );
      }
    }
    return output.join('&');
  }
}

/**
 * Checks if the provided object is an instance of {@link SafeURLSearchParams}.
 * @param params The object to check.
 * @returns `true` if the object is an instance of {@link SafeURLSearchParams}, `false` otherwise.
 */
export const isSafeURLSearchParams = (
  params: SafeURLSearchParams | URLSearchParams,
): params is SafeURLSearchParams => {
  return params instanceof SafeURLSearchParams;
};
