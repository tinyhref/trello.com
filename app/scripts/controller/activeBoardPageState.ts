import type { BoardViews } from '@trello/router/routes';
import { SharedState } from '@trello/shared-state';

export const activeBoardPageState = new SharedState<{
  boardIdOrShortLink: string | null;
  view: BoardViews['view'];
}>({
  boardIdOrShortLink: null,
  view: 'board',
});
