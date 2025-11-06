import { SharedState } from '@trello/shared-state';

import type { MapFormattedCoordinates } from './mapViewUtils';

interface MapViewSharedState {
  /**
   * The ID of the active marker.
   * @default null
   */
  activeMarkerId: string | null;
  /**
   * The location clicked on the map.
   * @default null
   */
  clickedLocation: MapFormattedCoordinates | null;
}

/**
 * A marker is considered "active" when it's clicked and its info window is open.
 * This state is shared across the map view components to ensure consistent
 * behavior when interacting with markers.
 */
export const mapViewSharedState = new SharedState<MapViewSharedState>({
  activeMarkerId: null,
  clickedLocation: null,
});

/**
 * Resets the map view state by setting both activeMarkerId and clickedLocation to
 * null. Use this when you need to clear the current map view state, such as when
 * closing a marker's info window or clearing a clicked location
 * or when the filter popover is opened or filters are reseted.
 */
export const resetMapViewSharedState = () => {
  mapViewSharedState.setValue({
    activeMarkerId: null,
    clickedLocation: null,
  });
};
