import { SharedState } from '@trello/shared-state';

export const cardIdsAddedSinceFilteringSharedState = new SharedState<
  Set<string>
>(new Set());

export const resetCardIdsAddedSinceFiltering = () => {
  cardIdsAddedSinceFilteringSharedState.setValue(new Set());
};
