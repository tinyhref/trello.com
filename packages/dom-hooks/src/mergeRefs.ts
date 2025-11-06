import type { MutableRefObject, Ref, RefObject } from 'react';

function nonNullable<T>(value: T): value is NonNullable<T> {
  return Boolean(value);
}

/*
 * mergeRefs accepts refs to merge and returns a single callback
 * ref that will properly set each ref passed, whether that ref
 * is a function or a ref object.
 */
export const mergeRefs = <T = unknown>(
  ...refs: Array<Ref<T> | RefObject<T> | undefined>
) => {
  const validRefs: Array<Ref<T> | RefObject<T>> = refs.filter(nonNullable);
  switch (validRefs.length) {
    case 0:
      return null;
    case 1:
      return validRefs[0];
    default:
      return (refInstance: T) => {
        for (const ref of validRefs) {
          if (typeof ref === 'function') {
            ref(refInstance);
          } else if (ref) {
            (ref as MutableRefObject<T | null>).current = refInstance;
          }
        }
      };
  }
};
