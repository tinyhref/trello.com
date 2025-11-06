import {
  ActionHistory,
  type Archive,
  type Unarchive,
  type UnarchiveList,
} from '@trello/action-history';
import { client } from '@trello/graphql';
import { forNamespace } from '@trello/legacy-i18n';
import type { Board } from '@trello/model-types';

import type { Trace } from '../ActionMapTypes';
import { CardActionFragmentDoc } from '../CardActionFragment.generated';
import { CardActionDocument } from '../CardActionMutation.generated';
import { ListActionFragmentDoc } from '../ListActionFragment.generated';
import { NoopError } from '../NoopError';
import { recordCardAction } from '../recordCardAction';
import { UnarchiveListDocument } from '../UnarchiveListMutation.generated';

const format = forNamespace('notificationsGrouped', {
  shouldEscapeStrings: false,
});

export const archive = (cardId: string, action: Archive, trace: Trace) => {
  const { traceId } = trace;

  const cardFragment = client.readFragment({
    id: `Card:${cardId}`,
    fragment: CardActionFragmentDoc,
  });

  if (cardFragment.closed) {
    throw new NoopError();
  }

  const boardId = cardFragment.idBoard;

  recordCardAction(cardId, action);

  // don't await so we don't block the UI
  client.mutate({
    mutation: CardActionDocument,
    variables: {
      cardId,
      card: {
        closed: true,
      },
      traceId,
    },
    optimisticResponse: {
      __typename: 'Mutation',
      updateCard: {
        __typename: 'Card',
        ...cardFragment,
        id: cardId,
        closed: true,
      },
    },
    update: (cache, { data: optimisticData }) => {
      if (!optimisticData?.updateCard) {
        return;
      }

      // Filter out the closed card from the board.cards array
      cache.modify<Board>({
        id: cache.identify({
          id: boardId,
          __typename: 'Board',
        }),
        fields: {
          cards(existingCards = [], { readField }) {
            const updatedCards = existingCards.filter((cardRef) => {
              return readField('id', cardRef) !== cardId;
            });
            return updatedCards;
          },
        },
      });
    },
  });

  return format('notification_archived_card');
};

export const unArchive = (cardId: string, action: Unarchive, trace: Trace) => {
  const { traceId } = trace;

  const cardFragment = client.readFragment({
    id: `Card:${cardId}`,
    fragment: CardActionFragmentDoc,
  });

  if (!cardFragment.closed) {
    throw new NoopError();
  }

  recordCardAction(cardId, action);

  // don't await so we don't block the UI
  client.mutate({
    mutation: CardActionDocument,
    variables: {
      cardId,
      card: {
        closed: false,
      },
      traceId,
    },
    optimisticResponse: {
      __typename: 'Mutation',
      updateCard: {
        __typename: 'Card',
        ...cardFragment,
        id: cardId,
        closed: false,
      },
    },
  });

  return format('notification_unarchived_card');
};

export const unArchiveList = (
  listId: string,
  action: UnarchiveList,
  trace: Trace,
) => {
  const { traceId } = trace;

  const list = client.readFragment({
    id: `List:${listId}`,
    fragment: ListActionFragmentDoc,
  });

  if (!list.closed) {
    throw new NoopError();
  }

  ActionHistory.append(
    { type: 'unarchive-list' },
    {
      idCard: '',
      idBoard: list.idBoard,
      idLabels: [],
      idList: listId,
      idMembers: [],
    },
  );

  client.mutate({
    mutation: UnarchiveListDocument,
    variables: {
      idList: listId,
      traceId,
    },
    optimisticResponse: {
      __typename: 'Mutation',
      archiveListMutation: {
        __typename: 'List',
        ...list,
        closed: false,
      },
    },
  });

  return format('unarchived_list');
};
