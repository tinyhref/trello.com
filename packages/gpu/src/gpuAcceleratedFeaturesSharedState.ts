import { SharedState } from '@trello/shared-state';

// Defaulting to true as most users should have graphics acceleration enabled
export const gpuAcceleratedFeaturesSharedState = new SharedState<boolean>(true);
