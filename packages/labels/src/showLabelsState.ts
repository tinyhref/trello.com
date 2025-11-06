import { PersistentSharedState } from '@trello/shared-state';

export interface ShowLabelsState {
  showText: boolean;
}

export const showLabelsState = new PersistentSharedState<ShowLabelsState>(
  { showText: false },
  { storageKey: 'labelState' },
);
