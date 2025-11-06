/**
 * Represents the possible states of a React root component in the UFO tracking system.
 *
 * - `rendered`: The root has finished rendering and is ready
 * - `rendering`: The root is currently in the process of rendering
 * - `unmounted`: The root has been unmounted and is no longer active
 */
type ReactRootState = 'rendered' | 'rendering' | 'unmounted';

/**
 * Represents a React root component being tracked by the UFO wrapper.
 *
 * Secondary roots are tracked to coordinate load holds and performance measurements
 * across multiple independently rendering sections of the application.
 */
interface ReactRoot {
  /** The unique name identifier for this root component */
  name: string;
  /** The current rendering state of this root component */
  state: ReactRootState;
}

let renderedSecondaryRoots: ReactRoot[] = [];

/**
 * Type definition for root listener callback functions.
 *
 * Root listeners are notified whenever a secondary root is added or its state changes.
 * This enables coordination between different parts of the UFO system.
 *
 * @param newRoot - The root that was just added or modified
 * @param allRenderedRoots - A snapshot of all currently tracked roots
 */
type RootListener = (newRoot: ReactRoot, allRenderedRoots: ReactRoot[]) => void;

const registeredRootListeners: RootListener[] = [];

/**
 * Retrieves a copy of all currently tracked secondary roots.
 *
 * Returns a deep copy of the secondary roots array to prevent external
 * modification of the internal state while allowing inspection of the current
 * root tracking status.
 *
 * @returns A copy of the array containing all tracked secondary roots
 *
 * @example
 * ```typescript
 * const roots = getSecondaryRoots();
 * console.log(`Currently tracking ${roots.length} secondary roots`);
 * roots.forEach(root => {
 *   console.log(`${root.name}: ${root.state}`);
 * });
 * ```
 */
export const getSecondaryRoots = (): ReactRoot[] => {
  return [
    ...renderedSecondaryRoots.map((root) => JSON.parse(JSON.stringify(root))),
  ];
};

/**
 * Registers a new secondary root component in the UFO tracking system.
 *
 * This function is called when a new secondary root component begins rendering.
 * It creates a new ReactRoot entry with 'rendering' state and notifies all
 * registered listeners about the new root.
 *
 * Secondary roots are typically major UI sections that render independently
 * and need to be tracked for performance measurement coordination.
 *
 * @param name - The unique name identifier for the new secondary root
 *
 * @example
 * ```typescript
 * // Called when a new secondary root starts rendering
 * onNewSecondaryRoot('main-content');
 * ```
 */
export const onNewSecondaryRoot = (name: string) => {
  const newRoot: ReactRoot = {
    name,
    state: 'rendering',
  };
  renderedSecondaryRoots.push(newRoot);
  registeredRootListeners.forEach((listener) =>
    listener(newRoot, getSecondaryRoots()),
  );
};

/**
 * Updates the state of an existing secondary root component.
 *
 * This function finds the secondary root with the given name and updates its state.
 * If the state actually changes, all registered listeners are notified of the update.
 * This is used to track the lifecycle of secondary roots from rendering to rendered
 * to unmounted.
 *
 * The function only triggers listener notifications if the state actually changes,
 * preventing unnecessary updates when the same state is set multiple times.
 *
 * @param name - The name of the secondary root to update
 * @param state - The new state to set for the secondary root
 *
 * @example
 * ```typescript
 * // Mark a root as finished rendering
 * setSecondaryRootState('main-content', 'rendered');
 *
 * // Mark a root as unmounted when component unmounts
 * setSecondaryRootState('sidebar', 'unmounted');
 * ```
 */
export const setSecondaryRootState = (name: string, state: ReactRootState) => {
  let didMakeChange = false;
  renderedSecondaryRoots = renderedSecondaryRoots.map((root) => {
    if (root.name === name && root.state !== state) {
      didMakeChange = true;
      return { ...root, state };
    }
    return root;
  });
  if (didMakeChange) {
    registeredRootListeners.forEach((listener) =>
      listener({ name, state }, getSecondaryRoots()),
    );
  }
};

/**
 * Checks if all currently mounted secondary roots have finished rendering.
 *
 * This function is used to determine when it's safe to release load holds
 * and complete performance measurements. A root is considered "finished"
 * if it's either in the 'rendered' state (completed successfully) or
 * 'unmounted' state (no longer relevant).
 *
 * Roots in the 'rendering' state are still considered active and will
 * cause this function to return false.
 *
 * @returns True if all mounted roots are either rendered or unmounted
 *
 * @example
 * ```typescript
 * if (allMountedRootsRendered()) {
 *   // Safe to release load holds and complete measurements
 * }
 * ```
 */
export const allMountedRootsRendered = (): boolean => {
  return renderedSecondaryRoots.every(
    (root) => root.state === 'rendered' || root.state === 'unmounted',
  );
};

/**
 * Clears all tracked secondary roots from the system.
 *
 * This function is typically called during route transitions to reset
 * the tracking state for the new page. It removes all secondary roots
 * from tracking, effectively starting fresh for the next page load.
 *
 * @example
 * ```typescript
 * // Called during route transitions
 * clearSecondaryRoots();
 * // Now ready to track roots for the new route
 * ```
 */
export const clearSecondaryRoots = () => {
  renderedSecondaryRoots = [];
};

/**
 * Registers a listener function to be notified of secondary root changes.
 *
 * Root listeners are called whenever a secondary root is added or its state
 * changes. This enables different parts of the UFO system to coordinate
 * based on the rendering status of secondary roots.
 *
 * Listeners receive both the specific root that changed and a snapshot
 * of all current roots, allowing for both targeted and holistic responses.
 *
 * @param listener - The callback function to register for root change notifications
 *
 * @example
 * ```typescript
 * registerRootListener((changedRoot, allRoots) => {
 *   console.log(`Root ${changedRoot.name} changed to ${changedRoot.state}`);
 *
 *   if (allMountedRootsRendered()) {
 *     console.log('All roots finished rendering');
 *   }
 * });
 * ```
 */
export const registerRootListener = (listener: RootListener) => {
  registeredRootListeners.push(listener);
};
