import { sendNetworkErrorEvent } from '@trello/error-reporting';
import { parseNetworkError } from '@trello/graphql-error-handling';
import { sanitizeUrl } from '@trello/safe-urls';

import { safeTrelloFetch } from '../fetch';
import type {
  Board_HistoryCardsPerDueDateStatusArgs,
  Board_HistoryCardsPerLabelArgs,
  Board_HistoryCardsPerListArgs,
} from '../generated';
import { isQueryInfo } from '../isQueryInfo';
import { prepareDataForApolloCache } from '../prepareDataForApolloCache';
import type { TrelloRestResolver } from '../types';

export const boardHistoryResolver: TrelloRestResolver<object> = (
  board: {
    id: string;
  },
  args,
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  return prepareDataForApolloCache(
    {
      id: board.id,
    },
    rootNode,
    'Board',
  );
};

export const getCardsPerList: TrelloRestResolver<
  Board_HistoryCardsPerListArgs
> = async (
  board: {
    id: string;
  },
  args,
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const queryParams = new URLSearchParams();
  if (args?.from) {
    queryParams.set('from', args.from);
  }
  const apiUrl = sanitizeUrl`/1/boards/${{
    value: board.id,
    type: 'boardId',
  }}/history/cardsPerList?${queryParams}`;
  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'Board_History.cardsPerList',
      operationName: context.operationName,
    },
  });

  const json = await response.json();

  // GraphQL doesn't have a map type, so we convert the
  // idList->dataPoints map into a list
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const series = Object.entries(json.series).map(([idList, series]) => {
    return {
      idList,
      dataPoints: series,
    };
  });

  if (response.ok) {
    return prepareDataForApolloCache(
      {
        ...json,
        series,
      },
      rootNode,
      'Board_History',
    );
  }

  sendNetworkErrorEvent({
    url: apiUrl,
    response: await response.clone().text(),
    status: response.status,
    operationName: context.operationName,
  });
  throw await parseNetworkError(response);
};

export const getCardsPerLabel: TrelloRestResolver<
  Board_HistoryCardsPerLabelArgs
> = async (
  board: {
    id: string;
  },
  args,
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const queryParams = new URLSearchParams();
  if (args?.from) {
    queryParams.set('from', args.from);
  }
  const apiUrl = sanitizeUrl`/1/boards/${{
    value: board.id,
    type: 'boardId',
  }}/history/cardsPerLabel?${queryParams}`;
  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'Board_History.cardsPerLabel',
      operationName: context.operationName,
    },
  });
  const json = await response.json();

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const series = Object.entries(json.series).map(([idLabel, series]) => {
    return {
      idLabel,
      dataPoints: series,
    };
  });

  if (response.ok) {
    return prepareDataForApolloCache(
      {
        ...json,
        series,
      },
      rootNode,
      'Board_History',
    );
  }

  sendNetworkErrorEvent({
    url: apiUrl,
    response: await response.clone().text(),
    status: response.status,
    operationName: context.operationName,
  });
  throw await parseNetworkError(response);
};

export const getCardsPerMember: TrelloRestResolver<
  Board_HistoryCardsPerLabelArgs
> = async (
  board: {
    id: string;
  },
  args,
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const queryParams = new URLSearchParams();
  if (args?.from) {
    queryParams.set('from', args.from);
  }

  const apiUrl = sanitizeUrl`/1/boards/${{
    value: board.id,
    type: 'boardId',
  }}/history/cardsPerMember?${queryParams}`;
  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'Board_History.cardsPerMember',
      operationName: context.operationName,
    },
  });
  const json = await response.json();

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const series = Object.entries(json.series).map(([idMember, series]) => {
    return {
      idMember,
      dataPoints: series,
    };
  });

  if (response.ok) {
    return prepareDataForApolloCache(
      {
        ...json,
        series,
      },
      rootNode,
      'Board_History',
    );
  }

  sendNetworkErrorEvent({
    url: apiUrl,
    response: await response.clone().text(),
    status: response.status,
    operationName: context.operationName,
  });
  throw await parseNetworkError(response);
};

export const getCardsPerDueDateStatus: TrelloRestResolver<
  Board_HistoryCardsPerDueDateStatusArgs
> = async (
  board: {
    id: string;
  },
  args,
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const queryParams = new URLSearchParams();
  if (args?.from) {
    queryParams.set('from', args.from);
  }
  const apiUrl = sanitizeUrl`/1/boards/${{
    value: board.id,
    type: 'boardId',
  }}/history/cardsPerDueDateStatus?${queryParams}`;
  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'Board_History.cardsPerDueDateStatus',
      operationName: context.operationName,
    },
  });

  const json = await response.json();

  if (response.ok) {
    return prepareDataForApolloCache(json, rootNode, 'Board_History');
  }

  sendNetworkErrorEvent({
    url: apiUrl,
    response: await response.clone().text(),
    status: response.status,
    operationName: context.operationName,
  });
  throw await parseNetworkError(response);
};
