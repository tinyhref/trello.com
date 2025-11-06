import { kebabCase } from 'change-case';
import {
  useContext,
  useEffect,
  useState,
  type FunctionComponent,
  type PropsWithChildren,
} from 'react';

import _UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import _UFOSegment from '@atlaskit/react-ufo/segment';
import traceUFOTransition from '@atlaskit/react-ufo/trace-transition';
import {
  bifrostTrack,
  clientVersion,
  environment,
  isDevserver,
} from '@trello/config';

import type { SegmentExperienceKey } from './experiences';
import { setRouteChangeHandler } from './initializeUFOWrapper';
import {
  allMountedRootsRendered,
  clearSecondaryRoots,
  getSecondaryRoots,
  onNewSecondaryRoot,
  registerRootListener,
  setSecondaryRootState,
} from './RootManager';
import { UFOGateContext } from './UFOGate';
import { useUFOCustomData } from './useUFOCustomData';

/**
 * Root-level UFO segment component that manages the main application performance tracking. This component should only
 * be used once in the application, at the top level of the primary React component tree.
 *
 * This component serves as the top-level wrapper for UFO v2 performance monitoring.
 * It handles:
 * - Route change tracking and transition tracing
 * - Load hold management based on secondary root rendering states
 * - Custom data injection (build version, environment, bifrost track)
 * - Root listener registration for coordinating with secondary segments
 *
 * The component automatically manages load holds during route transitions and releases
 * them when all mounted secondary roots have finished rendering.
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <UFORootSegment>
 *       <Router>
 *         <Routes>
 *           <Route path="/" element={<Dashboard />} />
 *         </Routes>
 *       </Router>
 *     </UFORootSegment>
 *   );
 * }
 * ```
 */
export const UFORootSegment: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [loadHold, setLoadHold] = useState(
    () => getSecondaryRoots().length === 0,
  );
  useEffect(() => {
    setRouteChangeHandler((routeName) => {
      clearSecondaryRoots();
      setLoadHold(true);
      traceUFOTransition(kebabCase(routeName));
    });

    registerRootListener((newRoot, currentRoots) => {
      if (currentRoots.length > 0 && allMountedRootsRendered()) {
        setLoadHold(false);
      }
    });
  }, []);

  useUFOCustomData({
    build: clientVersion,
    environment: isDevserver ? 'devserver' : environment,
    bifrostTrack: bifrostTrack === '__TRACK__' ? 'devserver' : bifrostTrack,
  });

  return (
    <_UFOSegment name={'app-root'}>
      {loadHold && <_UFOLoadHold name={'app-root'}></_UFOLoadHold>}
      {children}
    </_UFOSegment>
  );
};

/**
 * Props for the UFOSegment component.
 */
type UFOSegmentProps = {
  /**
   * The name identifier for this UFO segment. Will be converted to kebab-case.
   * Used for tracking and identifying this segment in UFO metrics.
   */
  name: SegmentExperienceKey;

  /**
   * Indicates if this segment is a secondary root segment.
   * Secondary roots are tracked separately and affect load hold behavior.
   * @defaultValue false
   */
  isSecondaryRoot?: boolean;

  /**
   * Indicates if this segment is currently in a loading state.
   * When true, a UFO load hold will be applied to this segment.
   * @defaultValue false
   */
  isLoading?: boolean;
};

/**
 * A UFO segment component for tracking performance of specific UI sections. Segments should only be used for singleton
 * components, that only appear once in the DOM at any given time.
 *
 * This component wraps sections of the UI that should be tracked as discrete
 * performance segments in UFO v2. It can function as either a regular segment
 * or a secondary root segment that participates in load hold coordination.
 *
 * A feature gate can be specified in a parent {@link UFOGateContext} to return the children directly in cases where
 * the gate is false for incremental rollout.
 *
 * @param name - The name identifier for this segment
 * @param isSecondaryRoot - (Optional, defaults to `false`) Whether this is a secondary root segment
 * @param isLoading - (Optional, defaults to `false`) Whether this segment is currently loading
 *
 * @example
 * ```tsx
 * // Regular segment
 * <UFOSegment name="sidebar">
 *   <Sidebar />
 * </UFOSegment>
 *
 * // Secondary root segment with loading state
 * <UFOSegment
 *   name="main-content"
 *   isSecondaryRoot={true}
 *   isLoading={isContentLoading}
 * >
 *   <MainContent />
 * </UFOSegment>
 * ```
 */
export const UFOSegment: FunctionComponent<
  PropsWithChildren<UFOSegmentProps>
> = ({ children, name, isSecondaryRoot = false, isLoading = false }) => {
  useEffect(() => {
    if (isSecondaryRoot) {
      setSecondaryRootState(kebabCase(name), 'rendered');
    }

    return () => {
      if (isSecondaryRoot) {
        setSecondaryRootState(kebabCase(name), 'unmounted');
      }
    };
  }, [name, isSecondaryRoot]);

  const featureGateEnabled = useContext(UFOGateContext);

  if (!featureGateEnabled) {
    return children;
  }

  if (isSecondaryRoot) {
    onNewSecondaryRoot(kebabCase(name));
  }

  return (
    <_UFOSegment name={kebabCase(name)}>
      {isLoading ? <_UFOLoadHold name={kebabCase(name)} /> : null}
      {children}
    </_UFOSegment>
  );
};
