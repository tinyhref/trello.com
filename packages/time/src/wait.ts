export function wait(
  ms: number,
  { signal }: { signal?: AbortSignal } = {},
): Promise<void> {
  if (signal) {
    if (signal.aborted) {
      return Promise.reject(new Error('AbortError'));
    }

    return new Promise((resolve, reject) => {
      const timeout = window.setTimeout(resolve, ms);

      // Listen for abort event on signal
      signal.addEventListener('abort', () => {
        window.clearTimeout(timeout);
        reject(new Error('AbortError'));
      });
    });
  } else {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
