export const uniqBy = <T>(arr: T[], uniqKey: (item: T) => string): T[] =>
  Array.from(
    arr
      .reduce((out, item) => {
        return item && out.has(uniqKey(item))
          ? out
          : out.set(uniqKey(item), item);
      }, new Map<string, T>())
      .values(),
  );
