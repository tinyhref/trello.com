import { Suspense, type PropsWithChildren, type ReactNode } from 'react';

import type {
  LabelExperienceKey,
  LoadHoldKey,
  SegmentExperienceKey,
} from './experiences';
import { UFOLabel } from './UFOLabel';
import { UFOLoadHold } from './UFOLoadHold';
import { UFOSegment } from './UFOSegment';

type UFOSuspenseType = 'label' | 'segment';

/**
 * Props for the UFOSuspense component.
 */
type UFOSuspenseProps<T extends UFOSuspenseType> = {
  /**
   * The name identifier for this UFO suspense boundary.
   * Used for tracking and identifying this segment in UFO metrics.
   */
  name: T extends 'segment' ? SegmentExperienceKey : LabelExperienceKey;

  type?: T;

  /**
   * The fallback component to display while the suspended content is loading.
   * This can be any React node (component, element, string, etc.).
   */
  fallback: ReactNode;
};

// eslint-disable-next-line @trello/enforce-variable-case
const isUFOSuspenseSegment = (
  props: PropsWithChildren<UFOSuspenseProps<'label' | 'segment'>>,
): props is PropsWithChildren<UFOSuspenseProps<'segment'>> => {
  return !props.type || props.type === 'segment';
};

/**
 * A UFO-aware Suspense component that integrates React Suspense with UFO performance tracking.
 *
 * This component provides a drop-in replacement for React's Suspense component that automatically
 * integrates with UFO v2 performance monitoring. When UFO is enabled, it uses UFO to track loading
 * states and performance metrics. When UFO is disabled, it falls back to standard React Suspense behavior.
 *
 *
 * A feature gate can be specified in a parent {@link UFOGateContext} to return the `<Suspense />` component directly in cases where
 * the gate is false for incremental rollout.
 *
 * @param children - The content that may suspend (typically lazy-loaded components)
 * @param name - The name identifier for UFO tracking, must be a valid {@link SegmentExperienceKey} or {@link LabelExperienceKey}, end with the suffix `-suspense`
 * @param type - [optional, "segment"] {@link UFOSuspenseType} The type of UFO object to wrap with.
 * @param fallback - The fallback UI to show while loading
 *
 * @example
 * ```tsx
 * const LazyComponent = lazy(() => import('./LazyComponent'));
 *
 * function App() {
 *   return (
 *     <UFOSuspense
 *       name="lazy-dashboard"
 *       fallback={<div>Loading dashboard...</div>}
 *     >
 *       <LazyComponent />
 *     </UFOSuspense>
 *   );
 * }
 * ```
 */
export const UFOSuspense = <T extends UFOSuspenseType>(
  props: PropsWithChildren<UFOSuspenseProps<T>>,
) => {
  const suspenseComponent = (
    <Suspense
      fallback={
        <>
          <UFOLoadHold name={(props.name + '-suspense') as LoadHoldKey} />
          {props.fallback}
        </>
      }
    >
      {props.children}
    </Suspense>
  );
  if (isUFOSuspenseSegment(props)) {
    return <UFOSegment name={props.name}>{suspenseComponent}</UFOSegment>;
  } else {
    return (
      <UFOLabel name={props.name as LabelExperienceKey}>
        {suspenseComponent}
      </UFOLabel>
    );
  }
};
