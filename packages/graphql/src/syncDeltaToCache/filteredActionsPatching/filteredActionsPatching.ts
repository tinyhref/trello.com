import type { ApolloCache, NormalizedCacheObject } from '@apollo/client';

import type { Action, Action_Type } from '../../generated';
import type { TypedPartialWithID } from '../../types';
import type {
  BoardActionsIdQuery,
  BoardActionsIdQueryVariables,
} from './BoardActionsIdQuery.generated';
import { BoardActionsIdDocument } from './BoardActionsIdQuery.generated';
import type {
  CardActionsIdQuery,
  CardActionsIdQueryVariables,
} from './CardActionsIdQuery.generated';
import { CardActionsIdDocument } from './CardActionsIdQuery.generated';

type BoardActions = NonNullable<BoardActionsIdQueryVariables['filter']>;

export const SHOW_DETAILS_FILTERS: NonNullable<
  CardActionsIdQueryVariables['filter']
> = [
  'addAttachmentToCard',
  'addChecklistToCard',
  'addMemberToCard',
  'commentCard',
  'copyCommentCard',
  'convertToCardFromCheckItem',
  'createCard',
  'createInboxCard',
  'copyCard',
  'copyInboxCard',
  'deleteAttachmentFromCard',
  'emailCard',
  'moveCardFromBoard',
  'moveCardToBoard',
  'moveInboxCardToBoard',
  'removeChecklistFromCard',
  'removeMemberFromCard',
  'updateCardIdList',
  'updateCardClosed',
  'updateCardDue',
  'updateCardDueComplete',
  'updateCheckItemStateOnCard',
  'updateCustomFieldItem',
  'updateCardRecurrenceRule',
];
export const HIDE_DETAILS_FILTERS: NonNullable<
  CardActionsIdQueryVariables['filter']
> = [
  'commentCard',
  'copyCommentCard',
  'createCard',
  'createInboxCard',
  'copyCard',
  'copyInboxCard',
  'updateCardRecurrenceRule',
];

export const DEFAULT_ACTION_FETCH_LENGTH = 50;
export const MAX_ACTION_FETCH_LENGTH = 1000;

export const UPDATE_CARD_MAPPINGS: Record<string, string> = {
  updateCardIdList: 'updateCard:idList',
  updateCardClosed: 'updateCard:closed',
  updateCardDue: 'updateCard:due',
  updateCardDueComplete: 'updateCard:dueComplete',
  updateCardRecurrenceRule: 'updateCard:recurrenceRule',
};

export const handleCardActionPatching = (
  cache: ApolloCache<NormalizedCacheObject>,
  action: TypedPartialWithID<Action, 'Action'>,
  cardId?: string | null,
) => {
  // Create the different permutations of query variables we want to use to read the cardActions cache entries from.
  const queryVariableSets: {
    filter: NonNullable<CardActionsIdQueryVariables['filter']>;
    limit: number;
  }[] = [];
  let actionType;
  if (action.type === 'updateCard') {
    // action.data is typed as a JSONString from gql, but it's already parsed here.
    // @ts-expect-error
    const type = `updateCard:${Object.keys(action.data?.old)[0]}`;
    actionType = Object.keys(UPDATE_CARD_MAPPINGS).find(
      (key) => UPDATE_CARD_MAPPINGS[key] === type,
    );
  } else {
    actionType = action.type;
  }

  if (actionType && SHOW_DETAILS_FILTERS.includes(actionType as Action_Type)) {
    queryVariableSets.push({
      filter: SHOW_DETAILS_FILTERS,
      limit: DEFAULT_ACTION_FETCH_LENGTH,
    });
    queryVariableSets.push({
      filter: SHOW_DETAILS_FILTERS,
      limit: MAX_ACTION_FETCH_LENGTH,
    });
  }
  if (actionType && HIDE_DETAILS_FILTERS.includes(actionType as Action_Type)) {
    queryVariableSets.push({
      filter: HIDE_DETAILS_FILTERS,
      limit: DEFAULT_ACTION_FETCH_LENGTH,
    });
    queryVariableSets.push({
      filter: HIDE_DETAILS_FILTERS,
      limit: MAX_ACTION_FETCH_LENGTH,
    });
  }

  // Create objects containing both cached data and query variables so that we can alter them and write back to the cache.
  const cacheEntries = queryVariableSets
    .map((queryVariables) => ({
      cacheResult: cache.readQuery<CardActionsIdQuery>({
        variables: { cardId, ...queryVariables },
        query: CardActionsIdDocument,
      }),
      queryVariables,
    }))
    // This filtering is necessary since we are checking for the existence of a cache entry for a limit of both 50 and 1000.
    // If the entry does not exist, it will be null, and we want to remove that from the cacheEntries array.
    .filter(
      (entry) =>
        // Additionally, if the cache already contains an action with the same id, the delta is an update and no cache writing is needed.
        !!entry.cacheResult?.cardActions?.every(
          (cardAction) => cardAction.id !== action.id,
        ),
    );

  cacheEntries.forEach((cacheEntry) =>
    cache.writeQuery({
      query: CardActionsIdDocument,
      data: {
        __typename: 'Query',
        cardActions: [
          { __typename: 'Action', id: action.id },
          ...(cacheEntry.cacheResult?.cardActions ?? []),
        ],
      },
      variables: { cardId, ...cacheEntry.queryVariables },
    }),
  );
};

export const COMMENT_CARD_ACTION = ['commentCard'] as BoardActions;
export const ALL_RELEVANT_BOARD_ACTIONS = [
  'addAttachmentToCard',
  'addChecklistToCard',
  'addMemberToBoard',
  'addMemberToCard',
  'addToOrganizationBoard',
  'commentCard',
  'convertToCardFromCheckItem',
  'copyBoard',
  'copyCard',
  'copyCommentCard',
  'createBoard',
  'createCard',
  'createList',
  'createCustomField',
  'deleteAttachmentFromCard',
  'deleteCard',
  'deleteCustomField',
  'deleteList',
  'disablePlugin',
  'disablePowerUp',
  'emailCard',
  'enablePlugin',
  'enablePowerUp',
  'makeAdminOfBoard',
  'makeNormalMemberOfBoard',
  'makeObserverOfBoard',
  'moveCardFromBoard',
  'moveCardToBoard',
  'moveListFromBoard',
  'moveListToBoard',
  'removeChecklistFromCard',
  'removeDeprecatedPlugin',
  'removeFromOrganizationBoard',
  'removeMemberFromCard',
  'unconfirmedBoardInvitation',
  'unconfirmedOrganizationInvitation',
  'updateBoard',
  'updateCard:idList',
  'updateCard:closed',
  'updateCard:due',
  'updateCard:dueComplete',
  'updateCheckItemStateOnCard',
  'updateCustomField',
  'updateCustomFieldItem',
  'updateList:closed',
] as BoardActions;

export const handleBoardActionPatching = (
  cache: ApolloCache<NormalizedCacheObject>,
  action: TypedPartialWithID<Action, 'Action'>,
  boardId?: string | null,
) => {
  let cacheResult = cache.readQuery<BoardActionsIdQuery>({
    variables: {
      boardId,
      filter: ALL_RELEVANT_BOARD_ACTIONS,
      limit: DEFAULT_ACTION_FETCH_LENGTH,
      page: 0,
    },
    query: BoardActionsIdDocument,
  });

  if (!cacheResult) {
    //I'm not sure how to determine if we should be using ALL actions or just comments at this level. So a repeat cache query will have to do I guess?
    cacheResult = cache.readQuery<BoardActionsIdQuery>({
      variables: {
        boardId,
        filter: COMMENT_CARD_ACTION,
        limit: DEFAULT_ACTION_FETCH_LENGTH,
        page: 0,
      },
      query: BoardActionsIdDocument,
    });
  }

  // if the cache already contains an action with the same id, the delta is an update and no cache writing is needed
  const isActionNew = cacheResult?.boardActions?.actions.every(
    (cachedAction) => cachedAction.id !== action.id,
  );

  if (isActionNew) {
    cache.modify({
      id: cache.identify({ __typename: 'Board', id: boardId }),
      fields: {
        actions(currentActions = [], { toReference }) {
          return [
            toReference({ __typename: 'Action', id: action.id }, true),
            ...currentActions,
          ];
        },
      },
    });
  }
};
