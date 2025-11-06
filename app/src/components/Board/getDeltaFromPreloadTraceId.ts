// Subtract the current time from the hex timestamp in the preload trace
// to account for the additional preload latency
export function getDeltaFromPreloadTraceId(
  preloadedTraceId: string | undefined,
) {
  if (!preloadedTraceId) {
    return undefined;
  }
  return parseInt(preloadedTraceId.slice(0, 8), 16) * 1000 - Date.now();
}
