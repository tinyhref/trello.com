import { getStringFromAdvancedDate } from '@trello/dates';
import { sendNetworkErrorEvent } from '@trello/error-reporting';
import { parseNetworkError } from '@trello/graphql-error-handling';
import { sanitizeUrl } from '@trello/safe-urls';
import { getCsrfRequestPayload } from '@trello/session-cookie/csrf';

import { safeFetch } from '../fetch';
import type {
  CreateDashboardViewTile,
  MutationCreateDashboardViewTileArgs,
  MutationDeleteDashboardViewTileArgs,
  MutationUpdateDashboardViewTileArgs,
  UpdateDashboardViewTile,
} from '../generated';
import { isQueryInfo } from '../isQueryInfo';
import { prepareDataForApolloCache } from '../prepareDataForApolloCache';
import type { TrelloRestResolver } from '../types';

const mapUpdateTileInputToPayload = (input: UpdateDashboardViewTile) => {
  return {
    ...(input.type && { type: input.type }),
    ...(input.graph && { graph_type: input.graph.type }),
    ...(input.from && {
      from: getStringFromAdvancedDate(input.from),
    }),
  };
};

const mapCreateTileInputToPayload = (input: CreateDashboardViewTile) => {
  return {
    type: input.type,
    graph_type: input.graph.type,
    pos: input.pos,
    ...(input.from && {
      from: getStringFromAdvancedDate(input.from),
    }),
  };
};

export const createDashboardViewTile: TrelloRestResolver<
  MutationCreateDashboardViewTileArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  if (!args.tile) {
    return;
  }
  const apiUrl = sanitizeUrl`/1/boards/${{
    value: args.idBoard,
    type: 'boardId',
  }}/dashboardViewTiles`;

  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...mapCreateTileInputToPayload(args.tile),
      ...getCsrfRequestPayload(),
    }),
  });

  if (response.ok) {
    return prepareDataForApolloCache(await response.json(), rootNode);
  }

  sendNetworkErrorEvent({
    url: apiUrl,
    response: await response.clone().text(),
    status: response.status,
    operationName: context.operationName,
  });
  throw await parseNetworkError(response);
};

export const updateDashboardViewTile: TrelloRestResolver<
  MutationUpdateDashboardViewTileArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  if (!args.tile) {
    return;
  }

  const apiUrl = sanitizeUrl`/1/boards/${{
    value: args.idBoard,
    type: 'boardId',
  }}/dashboardViewTiles/${{
    value: args.tile.id,
    type: 'otherId',
  }}`;

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...mapUpdateTileInputToPayload(args.tile),
      ...getCsrfRequestPayload(),
    }),
  });

  if (response.ok) {
    return prepareDataForApolloCache(await response.json(), rootNode);
  }

  sendNetworkErrorEvent({
    url: apiUrl,
    response: await response.clone().text(),
    status: response.status,
    operationName: context.operationName,
  });
  throw await parseNetworkError(response);
};

export const deleteDashboardViewTile: TrelloRestResolver<
  MutationDeleteDashboardViewTileArgs
> = async (obj, args, context) => {
  const apiUrl = sanitizeUrl`/1/boards/${{
    value: args.idBoard,
    type: 'boardId',
  }}/dashboardViewTiles/${{ value: args.idTile, type: 'otherId' }}`;

  const response = await safeFetch(apiUrl, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return true;
};
