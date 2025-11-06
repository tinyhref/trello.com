// Keys of a type T with values that can be assigned to something of type U
// For example,
// KeysWithType<{a:string, b?:string, c:number}, string> returns 'a'
// KeysWithType<{a:string, b:string, c:number}, string> returns 'a' | 'b'
type KeysWithType<T, TCompatible> = {
  [TKey in keyof T]-?: T[TKey] extends TCompatible ? TKey : never;
}[keyof T];

interface HasLocaleLowerCase {
  toLocaleLowerCase(): unknown;
}

export const byAttributeCaseInsensitive =
  <
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TModel extends Record<string, any>,
    TAttr extends KeysWithType<
      TModel,
      HasLocaleLowerCase | string | undefined
    > = KeysWithType<TModel, HasLocaleLowerCase | string | undefined>,
  >(
    attr: TAttr,
  ): ((a: TModel, b: TModel) => -1 | 0 | 1) =>
  (a, b) => {
    if (!a[attr] || !b[attr]) {
      return 0;
    }
    const aValue = a[attr].toLocaleLowerCase();
    const bValue = b[attr].toLocaleLowerCase();

    return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
  };

export type StandardComparator<T> = (a: T, b: T) => number;
export type PreferredComparator<T> = (a: T) => boolean;

export type AnyComparator<T> = PreferredComparator<T> | StandardComparator<T>;

function isPreferredComparator<T>(
  comparator: AnyComparator<T>,
): comparator is PreferredComparator<T> {
  return comparator.length === 1;
}

export function buildComparator<T>(
  ...comparators: AnyComparator<T>[]
): StandardComparator<T> {
  const standardComparators: StandardComparator<T>[] = comparators.map(
    (comparator) =>
      isPreferredComparator(comparator)
        ? (a: T, b: T): number => {
            const aIsPreferred = comparator(a);
            const bIsPreferred = comparator(b);

            return aIsPreferred && !bIsPreferred
              ? -1
              : bIsPreferred && !aIsPreferred
                ? 1
                : 0;
          }
        : comparator,
  );

  return (a: T, b: T): number => {
    for (const comparator of standardComparators) {
      const result = comparator(a, b);
      if (result) {
        return result;
      }
    }

    return 0;
  };
}
