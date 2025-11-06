import { SharedState } from '@trello/shared-state';

export const mirrorCardsBySourceBoardState = new SharedState<
  Record<string, string>
>({});
