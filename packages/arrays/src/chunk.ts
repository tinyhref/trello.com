export function chunk<T>(array: T[], count: number): T[][] {
  const result = [];
  let i = 0;
  const length = array.length;
  while (i < length) {
    result.push(Array.prototype.slice.call(array, i, (i += count)));
  }
  return result;
}
