export function isShortId(id: number | string) {
  return /^[0-9]{1,8}$/.test(id.toString());
}
