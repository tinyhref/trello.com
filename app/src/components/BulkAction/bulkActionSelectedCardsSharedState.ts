import { SharedState } from '@trello/shared-state';

const initialState: {
  selectedCards: Record<string, Record<string, boolean>>;
  isLoading: boolean;
} = {
  selectedCards: {},
  isLoading: false,
};

export const bulkActionSelectedCardsSharedState = new SharedState<
  typeof initialState
>(initialState);
