import _ from 'underscore';

export const valueUnion = <T>(
  getKey: (value: T) => number | string,
  ...colls: T[][]
): T[] => {
  const collection: Record<string, T> = {};
  _.flatten(colls).forEach(function (x) {
    const key = String(getKey(x));
    // This shouldn't happen, but id _can_ be null in server occasionally.
    if (!key) return;
    if (collection[key] && _.isObject(collection[key])) {
      return (collection[key] = { ...collection[key], ...x });
    } else {
      return (collection[key] = x);
    }
  });
  return (() => {
    const result = [];
    for (const key of Object.keys(collection || {})) {
      const value = collection[key];
      result.push(value);
    }
    return result;
  })();
};
