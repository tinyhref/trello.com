import type { HistoryContext, Move } from '@trello/action-history';
import { client } from '@trello/graphql';
import { BoardListsContextCardFragmentDoc } from '@trello/graphql/fragments';
import { forNamespace } from '@trello/legacy-i18n';
import { calculateItemPosition } from '@trello/position';

import type { Board as LegacyBoardModel } from 'app/scripts/models/Board';
import type { List } from 'app/scripts/models/List';
import { fireCardFrontConfetti } from 'app/src/components/BoardListView/fireCardFrontConfetti';
import { getListElement } from 'app/src/components/BoardListView/getListsTreeWalker';
import type { ListNameFragment } from 'app/src/components/List/ListNameFragment.generated';
import { ListNameFragmentDoc } from 'app/src/components/List/ListNameFragment.generated';
import { readListVisibleCardsFromCache } from 'app/src/components/List/readListVisibleCardsFromCache';
import type { Trace } from '../ActionMapTypes';
import type { CardActionFragment } from '../CardActionFragment.generated';
import { CardActionFragmentDoc } from '../CardActionFragment.generated';
import { CardActionDocument } from '../CardActionMutation.generated';
import { getCached } from '../getCached';
import { NoopError } from '../NoopError';
import { recordCardAction } from '../recordCardAction';

const format = forNamespace('notificationsGrouped', {
  shouldEscapeStrings: false,
});

export const doMove = (cardId: string, action: Move, trace: Trace) => {
  const { traceId } = trace;

  const nextListId = action.idList;

  const listFragment = client.readFragment<ListNameFragment>({
    id: `List:${nextListId}`,
    fragment: ListNameFragmentDoc,
  });

  const cardFragment = client.readFragment<CardActionFragment>({
    id: `Card:${cardId}`,
    fragment: CardActionFragmentDoc,
  });
  const boardId = cardFragment?.idBoard;
  const prevListId = cardFragment?.idList;

  /**
   * if we're moving to a different board, just
   * defer to using old implementation
   * for simplicity for now.
   *
   * To use the new implementation, we'd need to
   * query the destination board's lists
   */
  if (boardId === action.idBoard) {
    const cardContext = client.readFragment({
      id: `Card:${cardId}`,
      fragment: BoardListsContextCardFragmentDoc,
    });

    if (!cardFragment || !cardContext || !prevListId || !boardId) {
      throw new NoopError();
    }

    const sourceCards = readListVisibleCardsFromCache({
      boardId,
      listId: prevListId,
    });

    const destCards = readListVisibleCardsFromCache({
      boardId: action.idBoard,
      listId: nextListId,
    });

    const sourceIndex =
      sourceCards?.findIndex(({ id }) => id === cardId) ?? 1e9;

    let targetIndex: number = 0;
    if (action.position === 'top') {
      targetIndex = 0;
    } else if (action.position === 'bottom') {
      targetIndex = destCards.length;
    } else if (typeof action.position === 'number') {
      // If the position is arbitrary, it probably doesn't matter too much, but
      // drop it underneath the last card just in case.
      targetIndex = action.position + 1;
    }

    const position = calculateItemPosition(targetIndex, destCards, cardContext);

    const numCardsInTargetList = destCards.length;

    const recordedPosition = (() => {
      switch (targetIndex) {
        case 0:
          if (numCardsInTargetList > 0) {
            return 'top';
          } else {
            return targetIndex;
          }
        case numCardsInTargetList:
          if (numCardsInTargetList > 1) {
            return 'bottom';
          } else {
            return targetIndex;
          }
        case 1:
          if (numCardsInTargetList > 1) {
            return 1;
          } else {
            return targetIndex;
          }
        default:
          return targetIndex;
      }
    })();

    const newAction: Move = {
      type: 'move',
      idList: nextListId,
      fromPosition: sourceIndex,
      position: recordedPosition,
      idBoard: boardId,
    };

    recordCardAction(cardId, newAction);

    const nextListElement = getListElement(nextListId);
    if (nextListElement) {
      fireCardFrontConfetti({ listId: nextListId }, nextListElement);
    }

    // don't await so we don't block the UI
    client.mutate({
      mutation: CardActionDocument,
      variables: {
        cardId,
        card: {
          idList: nextListId,
          pos: position,
          idBoard: boardId,
        },
        traceId,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updateCard: {
          ...cardFragment,
          id: cardId,
          idList: nextListId,
          pos: position,
          __typename: 'Card',
        },
      },
    });

    if (prevListId === action.idList) {
      return format('notification_moved_card_within_list', {
        list: listFragment?.name,
      });
    }
  } else {
    const card = getCached('Card', cardId);
    const list = getCached('List', action.idList);
    // In the case of repeatAction, `context` won't match the given card,
    // so check the card's original location rather than using `context`.
    const prevIdBoard = card.get('idBoard');
    const prevIdList = card.get('idList');
    let index;
    if (action.position === 'top') {
      index = 0;
    } else if (action.position === 'bottom') {
      index = list.openCards().length;
    } else {
      // If the position is arbitrary, it probably doesn't matter too much, but
      // drop it underneath the last card just in case.
      index = action.position + 1;
    }
    card.moveToList(list, index);
    if (prevIdBoard !== action.idBoard) {
      return format('notification_moved_card_to_board', {
        list: list.get('name'),
        board: getCached('Board', action.idBoard)?.get('name'),
      });
    }
    if (prevIdList === action.idList) {
      return format('notification_moved_card_within_list', {
        list: list.get('name'),
      });
    }
  }

  return format('notification_moved_card', { list: listFragment?.name });
};

export const undoMove = (
  cardId: string,
  action: Move,
  trace: Trace,
  context: HistoryContext,
) => {
  const { traceId } = trace;
  const nextListId = context.idList;

  const listFragment = client.readFragment<ListNameFragment>({
    id: `List:${nextListId}`,
    fragment: ListNameFragmentDoc,
  });

  const cardFragment = client.readFragment<CardActionFragment>({
    id: `Card:${cardId}`,
    fragment: CardActionFragmentDoc,
  });

  const boardId = cardFragment?.idBoard;
  const prevListId = cardFragment?.idList;

  /**
   * if we're undoing a move to a different board,
   * defer to using old implementation
   * for simplicity for now.
   */
  if (boardId === context.idBoard) {
    const targetIndex = action.fromPosition;

    const cardContext = client.readFragment({
      id: `Card:${cardId}`,
      fragment: BoardListsContextCardFragmentDoc,
    });

    if (!cardFragment || !cardContext || !prevListId || !boardId) {
      throw new NoopError();
    }

    const sourceCards = readListVisibleCardsFromCache({
      boardId,
      listId: prevListId,
    });

    const destCards = readListVisibleCardsFromCache({
      boardId,
      listId: nextListId,
    });

    const sourceIndex =
      sourceCards?.findIndex(({ id }) => id === cardId) ?? 1e9;

    const position = calculateItemPosition(targetIndex, destCards, cardContext);

    const numCardsInTargetList = destCards.length;

    const recordedPosition = (() => {
      switch (targetIndex) {
        case 0:
          if (numCardsInTargetList > 0) {
            return 'top';
          } else {
            return targetIndex;
          }
        case numCardsInTargetList:
          if (numCardsInTargetList > 1) {
            return 'bottom';
          } else {
            return targetIndex;
          }
        case 1:
          if (numCardsInTargetList > 1) {
            return 1;
          } else {
            return targetIndex;
          }
        default:
          return targetIndex;
      }
    })();

    const newAction: Move = {
      type: 'move',
      idList: nextListId,
      fromPosition: sourceIndex,
      position: recordedPosition,
      idBoard: boardId,
    };

    recordCardAction(cardId, newAction);

    client.mutate({
      mutation: CardActionDocument,
      variables: {
        cardId,
        card: {
          idList: nextListId,
          pos: position,
          idBoard: boardId,
        },
        traceId,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updateCard: {
          ...cardFragment,
          id: cardId,
          idList: nextListId,
          pos: position,
          __typename: 'Card',
        },
      },
    });

    if (action.idList === context.idList) {
      return format('notification_moved_card_within_list', {
        list: listFragment?.name,
      });
    }
  } else {
    const card = getCached('Card', cardId);

    const list = getCached('List', context.idList) as List;
    card.moveToList(list, action.fromPosition);
    if (action.idBoard !== context.idBoard) {
      return format('notification_moved_card_to_board', {
        list: list.get('name'),
        board: (getCached('Board', context.idBoard) as LegacyBoardModel).get(
          'name',
        ),
      });
    }
    if (action.idList === context.idList) {
      return format('notification_moved_card_within_list', {
        list: list.get('name'),
      });
    }
  }

  return format('notification_moved_card', { list: listFragment?.name });
};
