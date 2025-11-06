export function messageFromJSON(
  json: { message?: string; error?: string } | undefined,
) {
  return json?.message || json?.error;
}
