import { useEffect, useRef } from 'react';

/*
 * Keep a reference to the previous state values so that we can employ a
 * "stale while revalidate" approach to rendering.  This is necessary
 * to ensure that when switching from a board view to a card view, that
 * you don't see the left navigation flash during loading.
 */
export function usePreviousWhileLoading<T>(
  value: T,
  isLoading: boolean,
  initialValue: T,
): T {
  const previousValue = useRef<T>(initialValue);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    previousValue.current = value;
  }, [value, isLoading]);

  return isLoading ? previousValue.current : value;
}
