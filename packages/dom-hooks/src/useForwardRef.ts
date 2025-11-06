import type { ForwardedRef } from 'react';
import { useEffect, useRef } from 'react';

/**
 * A hook that wraps a forwarded ref to provide a guaranteed, stable ref.
 * The `ref` prop in components that use `forwardRef` is optional, so we need to
 * create another ref that can be used by the consuming component in cases where
 * a component needs to access its own ref.
 *
 * @example
 * const MyComponent = forwardRef((props, ref) => {
 *   const myRef = useForwardRef(ref);
 *   return <div ref={myRef}>Hello, world!</div>;
 * });
 */
export const useForwardRef = <T>(
  ref: ForwardedRef<T>,
  initialValue: T | null = null,
) => {
  const targetRef = useRef<T>(initialValue);

  useEffect(() => {
    if (typeof ref === 'function') {
      ref(targetRef.current);
    } else if (ref) {
      ref.current = targetRef.current;
    }
    // NOTE: Omit the dependencies array; we actually want this to run on every
    // render, and refs won't cause subsequent rerenders. useEffect ensures that
    // this runs after the render, so requisite elements will exist.
  });

  return targetRef;
};
