import { SharedState } from '@trello/shared-state';

import { ViewFilters } from './ViewFilters';
import type {
  ViewFiltersContextValue,
  ViewFiltersSource,
} from './ViewFiltersContext';

export const viewFiltersContextSharedState = new SharedState<
  ViewFiltersContextValue<ViewFiltersSource>
>({
  viewFilters: {
    filters: new ViewFilters(),
    setFilter() {
      throw new Error('setFilter not implemented');
    },
    resetFilters() {
      throw new Error('resetFilters not implemented');
    },
    clearFilters() {
      throw new Error('clearFilters not implemented');
    },
  },
});
