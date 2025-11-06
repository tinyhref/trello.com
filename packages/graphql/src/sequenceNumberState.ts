import { SharedState } from '@trello/shared-state';

export const sequenceNumberState = new SharedState<
  Record<string, number | null>
>({});
