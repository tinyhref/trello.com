import type { FunctionComponent, PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { useImmer } from 'use-immer';

import type { StandardComparator } from '@trello/arrays';
import { client } from '@trello/graphql';
import { useBoardId } from '@trello/id-context';

import type { BoardListsContextValue } from './BoardListsContext';
import { BoardListsContext } from './BoardListsContext';
import type {
  BoardListsContextQuery,
  BoardListsContextQueryVariables,
} from './BoardListsContextQuery.generated';
import { BoardListsContextDocument } from './BoardListsContextQuery.generated';

const comparePos: StandardComparator<{ pos: number }> = (a, b) => a.pos - b.pos;

export const BoardListsContextProvider: FunctionComponent<
  PropsWithChildren<unknown>
> = ({ children }) => {
  const boardId = useBoardId();
  const [value, setValue] = useImmer<BoardListsContextValue>({});

  useEffect(() => {
    // eslint-disable-next-line @trello/no-cache-only-queries
    const observer = client.watchQuery<
      BoardListsContextQuery,
      BoardListsContextQueryVariables
    >({
      query: BoardListsContextDocument,
      variables: { boardId },
      fetchPolicy: 'cache-only',
      // This option effectively allows Apollo cache to memoize results using
      // strict equality comparisons (===), rather than deep equality checking.
      // On giant boards, this can speed up change diffing by up to 2 seconds.
      canonizeResults: true,
    });

    const subscription = observer.subscribe((result) => {
      // It should be impossible for result.data to be undefined, but this fixes
      // a niche error we saw: https://atlassian-2y.sentry.io/issues/4494647746/
      const { board } = result.data || {};
      if (!board) {
        return;
      }

      const listCards = (board.cards ?? []).reduce<
        NonNullable<BoardListsContextValue['listCards']>
      >((acc, card) => {
        if (card.closed) {
          return acc;
        }
        if (!acc[card.idList]) {
          acc[card.idList] = [];
        }
        const list = acc[card.idList]!;
        list.push({
          id: card.id,
          pos: card.pos,
          cardRole: card.cardRole ?? null,
          pinned: card.pinned ?? false,
          dueComplete: card.dueComplete ?? false,
        });
        return acc;
      }, {});

      // It's possible for a listId to be absent from listCards.keys(), if the
      // list has no cards. Iterate over the lists data directly.
      const lists = (board.lists ?? [])
        .reduce<NonNullable<BoardListsContextValue['lists']>>((acc, list) => {
          if (list.closed) {
            return acc;
          }
          // Side-effect: sort the cards within each map entry as we derive list
          // IDs in order to minimize the total number of iterations.
          if (listCards[list.id]) {
            listCards[list.id].sort(comparePos);
          } else {
            listCards[list.id] = [];
          }
          acc.push({ id: list.id, pos: list.pos, type: list.type });
          return acc;
        }, [])
        .sort(comparePos);

      setValue({ lists, listCards });
    });

    return () => subscription.unsubscribe();
  }, [boardId, setValue]);

  return (
    <BoardListsContext.Provider value={value}>
      {children}
    </BoardListsContext.Provider>
  );
};
