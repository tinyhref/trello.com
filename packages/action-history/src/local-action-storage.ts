import { getMemberId, isMemberLoggedIn } from '@trello/authentication';
import { TrelloStorage } from '@trello/storage';

import type { ActionStorage } from './action-history';
import { cleanHistory } from './clean-history';
import type { HistoryEntry } from './types';

const getActionHistoryStorageKey = ():
  | `action_history_${string}`
  | undefined => {
  return isMemberLoggedIn() ? `action_history_${getMemberId()}` : undefined;
};

export const localActionStorage: ActionStorage = {
  read() {
    const STORAGE_KEY = getActionHistoryStorageKey();
    return STORAGE_KEY ? cleanHistory(TrelloStorage.get(STORAGE_KEY)) : [];
  },

  write(history: HistoryEntry[]) {
    const STORAGE_KEY = getActionHistoryStorageKey();
    if (STORAGE_KEY) {
      TrelloStorage.set(STORAGE_KEY, history);
    }
  },
};

const getActionHistoryUndoStorageKey = ():
  | `action_history_undo_stack_${string}`
  | undefined => {
  return isMemberLoggedIn()
    ? `action_history_undo_stack_${getMemberId()}`
    : undefined;
};

export const localUndoStackStorage: ActionStorage = {
  read() {
    const STORAGE_KEY = getActionHistoryUndoStorageKey();
    return STORAGE_KEY ? TrelloStorage.get(STORAGE_KEY) || [] : [];
  },

  write(history: HistoryEntry[]) {
    const STORAGE_KEY = getActionHistoryUndoStorageKey();
    if (STORAGE_KEY) {
      TrelloStorage.set(STORAGE_KEY, history);
    }
  },
};
