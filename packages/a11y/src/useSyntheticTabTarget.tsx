import { useCallback, useRef } from 'react';

import * as styles from './SyntheticTabTarget.module.less';

/**
 * Returns an invisible element that can be focused to simulate blur on another
 * element within a focus trapping context. The synthetic tab target should be
 * rendered as a direct sibling of the blurred element, so that the user's
 * position in the tab navigation hierarchy remains in the right place.
 *
 * This is a workaround for a niche issue with our focus trapping library,
 * which prevents blurring an element from working at all:
 * https://github.com/adobe/react-spectrum/issues/1479
 *
 * @example
 *
 * const { focusSyntheticTabTarget, SyntheticTabTarget } = useSyntheticTabTarget();
 *
 * // Blur the element when the Enter key is pressed:
 * const onKeyDown = (e) => {
 *   if (isSubmitEvent(e)) {
 *     e.preventDefault();
 *     // Blur the current element by focusing the synthetic tab target:
 *     focusSyntheticTabTarget();
 *   }
 * };
 *
 * return (
 *   <>
 *     <input onKeyDown={onKeyDown} />
 *     <SyntheticTabTarget />
 *   </>
 * );
 */
export const useSyntheticTabTarget = (): {
  focusSyntheticTabTarget: () => void;
  SyntheticTabTarget: () => JSX.Element;
} => {
  const syntheticTabTargetRef = useRef<HTMLDivElement | null>(null);

  // Focus the synthetic tab target without altering the current scroll
  // position. This prevents unexpected jumps (e.g., when re-ordering
  // checklist items) that occur when the browser auto-scrolls the newly
  // focused element into view. `preventScroll` is supported in all
  // evergreen browsers we support.
  const focusSyntheticTabTarget = useCallback(() => {
    // The cast is necessary for older @types/react-dom versions which do not
    // yet include the `preventScroll` option.
    (syntheticTabTargetRef.current as HTMLElement | null)?.focus({
      preventScroll: true,
    });
  }, []);

  const SyntheticTabTarget = useCallback(
    () => (
      <span
        className={styles.syntheticTabTarget}
        ref={syntheticTabTargetRef}
        role="none"
        tabIndex={-1}
      />
    ),
    [],
  );

  return {
    focusSyntheticTabTarget,
    SyntheticTabTarget,
  };
};
