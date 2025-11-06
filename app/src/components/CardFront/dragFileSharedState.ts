import { SharedState } from '@trello/shared-state';

export const dragFileSharedState = new SharedState<{
  cardId: string | null;
  fileState: 'hover' | 'limited' | 'restricted' | null;
}>({
  cardId: null,
  fileState: null,
});
