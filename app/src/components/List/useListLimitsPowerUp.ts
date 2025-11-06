import { useCallback } from 'react';

import { listLimitsPowerUpId } from '@trello/config';
import { useListId } from '@trello/id-context';

import { useBoardPluginsContext } from 'app/src/components/BoardPluginsContext';
import { useListLimitsPowerUpFragment } from './ListLimitsPowerUpFragment.generated';
import { useListContext } from './useListContext';

interface HookResult {
  cardsCount: number;
  isListLimitExceeded: boolean;
  softLimit: number | null;
  isEnabled: boolean;
}

export const useListLimitsPowerUp = (): HookResult => {
  const listId = useListId();
  const { data: list } = useListLimitsPowerUpFragment({
    from: { id: listId },
    optimistic: true,
  });
  const isEnabled = useBoardPluginsContext(
    useCallback((value) => value.enabledPlugins.has(listLimitsPowerUpId), []),
  );
  const softLimit = list?.softLimit ?? null;

  const numCards = useListContext(useCallback((value) => value.numCards, []));
  const isListLimitExceeded = softLimit !== null && numCards > softLimit;

  return {
    cardsCount: numCards,
    isListLimitExceeded,
    softLimit,
    isEnabled,
  };
};
