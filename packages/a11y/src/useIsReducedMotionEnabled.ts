import { useEffect, useState } from 'react';

/**
 * A React hook that detects whether the user has enabled reduced motion preferences.
 *
 * This hook monitors the user's system-level preference for reduced motion, which is
 * important for accessibility. Users with vestibular disorders, motion sensitivity,
 * or other conditions may prefer minimal animations and transitions.
 *
 * The hook uses the CSS media query `(prefers-reduced-motion: reduce)` to detect
 * the user's preference. This preference can be set at the operating system level
 * (e.g., in macOS System Preferences > Accessibility > Display > Reduce motion).
 *
 * @returns {boolean | null} `true` if the user has enabled reduced motion preferences, `false` if disabled, `null` if the preference is not yet determined
 *
 * @example
 * ```tsx
 * import { useRef } from 'react';
 * import { useIsReducedMotionEnabled } from '@trello/a11y';
 *
 * function MyComponent() {
 *   const targetRef = useRef(null);
 *   const isReducedMotion = useIsReducedMotionEnabled();
 *
 *   const scrollToTarget = () => {
 *     targetRef.current?.scrollIntoView({
 *       behavior: isReducedMotion ? 'instant' : 'smooth',
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={scrollToTarget}>
 *         Scroll to target
 *       </button>
 *       <div ref={targetRef}>
 *         Target content
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion | MDN: prefers-reduced-motion}
 * @see {@link https://www.w3.org/WAI/WCAG21/Understanding/motion-actuation.html | WCAG 2.1: Motion Actuation}
 */
export const useIsReducedMotionEnabled = (): boolean | null => {
  const [isReducedMotionEnabled, setIsReducedMotionEnabled] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    // Create a media query to detect reduced motion preference
    // The 'reduce' value indicates the user wants reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Handle cases where matchMedia returns null or undefined
    if (!mediaQuery) {
      return;
    }

    // Set initial state based on current preference
    setIsReducedMotionEnabled(mediaQuery.matches);

    // Add event listener to handle preference changes in real-time
    const handleChange = (event: MediaQueryListEvent): void => {
      setIsReducedMotionEnabled(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return (): void => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return isReducedMotionEnabled;
};
