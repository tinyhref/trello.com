import { SharedState } from '@trello/shared-state';

export interface OneTimeMessagesDismissedState {
  oneTimeMessagesDismissed: string[];
  complete: boolean;
}

export const oneTimeMessagesDismissedState =
  new SharedState<OneTimeMessagesDismissedState>({
    oneTimeMessagesDismissed: [],
    complete: false,
  });
