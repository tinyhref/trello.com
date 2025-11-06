import type { FunctionComponent, PropsWithChildren } from 'react';
import { useCallback, useEffect } from 'react';
import { useImmer } from 'use-immer';

import { useListId } from '@trello/id-context';
import { useSharedStateSelector } from '@trello/shared-state';

import { useBoardListsContext } from 'app/src/components/BoardListsContext';
import { visibleCardIdsSharedState } from 'app/src/components/FilterPopover/visibleCardIdsSharedState';
import type { ListContextValue } from './ListContext';
import { emptyListContext, ListContext } from './ListContext';

export const ListContextProvider: FunctionComponent<
  PropsWithChildren<
    Pick<ListContextValue, 'isCollapsed' | 'shouldRenderContent'>
  >
> = ({ children, shouldRenderContent, isCollapsed }) => {
  const [value, setValue] = useImmer<ListContextValue>({
    ...emptyListContext,
    shouldRenderContent,
  });

  const listId = useListId();
  const cards = useBoardListsContext(
    useCallback(({ listCards }) => listCards?.[listId] ?? [], [listId]),
  );
  const numCards =
    cards.filter((card) => card.cardRole !== 'separator').length ?? 0;

  const numCompletedCards = cards.filter(
    (card) => card.cardRole !== 'separator' && card.dueComplete,
  ).length;

  const visibleCardIds = useSharedStateSelector(
    visibleCardIdsSharedState,
    useCallback(
      (state) =>
        cards.reduce((acc: string[], { id }) => {
          if (state.has(id)) {
            acc.push(id);
          }
          return acc;
        }, []),
      [cards],
    ),
  );

  useEffect(() => {
    setValue((draft) => {
      draft.shouldRenderContent = shouldRenderContent;
      draft.isCollapsed = isCollapsed;
      draft.numCompletedCards = numCompletedCards;

      if (draft.numCards !== numCards) {
        draft.numCards = numCards;
      }
      if (draft.visibleCardIds !== visibleCardIds) {
        draft.visibleCardIds = visibleCardIds;
      }
    });
  }, [
    isCollapsed,
    numCards,
    numCompletedCards,
    shouldRenderContent,
    visibleCardIds,
    setValue,
  ]);

  return <ListContext.Provider value={value}>{children}</ListContext.Provider>;
};
