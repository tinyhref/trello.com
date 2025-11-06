import type {
  ApolloCache,
  DocumentNode,
  NormalizedCacheObject,
} from '@apollo/client';

import type { Board, Card, Maybe, Member } from '../../../generated';
import { firstLetterToUpper } from '../../stringOperations';
import { BoardClosedCardsDocument } from './BoardClosedCardsQuery.generated';
import { BoardOpenCardsDocument } from './BoardOpenCardsQuery.generated';
import { BoardVisibleCardsDocument } from './BoardVisibleCardsQuery.generated';
import { MemberClosedCardsDocument } from './MemberClosedCardsQuery.generated';
import { MemberOpenCardsDocument } from './MemberOpenCardsQuery.generated';
import { MemberVisibleCardsDocument } from './MemberVisibleCardsQuery.generated';

type CardFilter = 'closed' | 'open' | 'visible';

export type ParentTypeKey = 'board' | 'member';

export type GeneralizedCardsQueryResult = {
  __typename: 'Query';
  board?: Maybe<
    Pick<Board, '__typename' | 'id'> & {
      cards: Array<{ __typename: 'Card' } & Pick<Card, 'closed' | 'id'>>;
    }
  >;
  member?: Maybe<
    Pick<Member, '__typename' | 'id'> & {
      cards: Array<{ __typename: 'Card' } & Pick<Card, 'closed' | 'id'>>;
    }
  >;
};

const QUERY_MAP: Record<ParentTypeKey, Record<CardFilter, DocumentNode>> = {
  board: {
    open: BoardOpenCardsDocument,
    closed: BoardClosedCardsDocument,
    visible: BoardVisibleCardsDocument,
  },
  member: {
    open: MemberOpenCardsDocument,
    closed: MemberClosedCardsDocument,
    visible: MemberVisibleCardsDocument,
  },
};

export function removeDeleted(
  cache: ApolloCache<NormalizedCacheObject>,
  type: string,
  id: string,
) {
  cache.evict({ id: `${type}:${id}` });
  cache.gc();
}

function readCardsFromCache({
  cache,
  query,
  parentType,
  parentId,
}: {
  cache: ApolloCache<NormalizedCacheObject>;
  query: DocumentNode;
  parentType: ParentTypeKey;
  parentId: string;
}) {
  return cache.readQuery<GeneralizedCardsQueryResult>({
    query,
    variables: {
      parentId,
    },
  })?.[parentType]?.cards;
}

function writeCardsToCache({
  cache,
  query,
  parentType,
  parentId,
  cards,
}: {
  cache: ApolloCache<NormalizedCacheObject>;
  query: DocumentNode;
  parentType: ParentTypeKey;
  parentId: string;
  cards: Partial<Card>[];
}) {
  return cache.writeQuery<GeneralizedCardsQueryResult>({
    query,
    data: {
      __typename: 'Query',
      [`${parentType}`]: {
        id: parentId,
        cards,
        __typename: firstLetterToUpper(parentType),
      },
    },
    variables: {
      parentId,
    },
    broadcast: false,
  });
}

export function updateCardsInVisibleList(
  cache: ApolloCache<NormalizedCacheObject>,
  parentType: ParentTypeKey,
  parentIds: string[],
  cards: Pick<Card, '__typename' | 'closed' | 'id'>[],
  listClosed: boolean,
) {
  if (cards.length === 0) {
    // No changes required
    return;
  }
  const query = QUERY_MAP[parentType]['visible'];
  const cardIds = cards.map((card) => card.id);
  const openCards = cards.filter((card) => !card.closed);
  parentIds.forEach((parentId) => {
    const existingVisibleCards =
      readCardsFromCache({
        cache,
        query,
        parentType,
        parentId,
      }) || [];
    const otherVisibleCards = existingVisibleCards.filter(
      (card: Pick<Card, 'id'>) => !cardIds.includes(card.id),
    );
    const newVisibleCards = listClosed
      ? otherVisibleCards
      : [...otherVisibleCards, ...openCards];

    // It's possible we could incorrectly hit this scenario. For example, if we
    // miss an "add" delta, but receive a "delete" delta, the lengths will be the
    // same, but the cache will not be updated correctly. This is self healing as
    // more deltas come in, and we believe it is a slim enough edge case that the
    // performance optimization is worthwhile.
    if (existingVisibleCards.length === newVisibleCards.length) {
      // we end up with the same list as already in cache
      // let's skip writing to cache
      return;
    }

    writeCardsToCache({
      cache,
      query,
      parentType,
      parentId,
      cards: newVisibleCards,
    });
  });
}
