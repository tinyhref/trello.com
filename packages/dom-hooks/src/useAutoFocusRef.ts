import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

type HookProps = {
  ref: RefObject<HTMLElement>;
  delay?: number;
  skip?: boolean;
};

/**
 * See: https://blog.maisie.ink/react-ref-autofocus/
 */
export function useAutoFocusRef({
  ref,
  delay = 0,
  skip = false,
}: HookProps): void {
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (skip) return;

    timeoutRef.current = window.setTimeout(() => {
      ref.current?.focus();
      timeoutRef.current = null;
    }, delay);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [ref, delay, skip]);
}
