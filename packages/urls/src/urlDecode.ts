export function urlDecode(str: string): string {
  return decodeURIComponent(str.replace(/\+/g, ' '));
}
