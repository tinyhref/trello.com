import { Analytics } from '@trello/atlassian-analytics';
import { sanitizeUrl } from '@trello/safe-urls';
import { getCsrfRequestPayload } from '@trello/session-cookie/csrf';

import { safeFetch } from '../fetch';
import type {
  MutationCreateLabelArgs,
  MutationDeleteLabelArgs,
  MutationUpdateLabelArgs,
} from '../generated';
import { isQueryInfo } from '../isQueryInfo';
import { prepareDataForApolloCache } from '../prepareDataForApolloCache';
import type { TrelloRestResolver } from '../types';

export const createLabel: TrelloRestResolver<MutationCreateLabelArgs> = async (
  obj,
  args,
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const { name, color, idBoard, idCard, traceId } = args;

  // If idCard is provided, make the request to the `card` endpoint to add the
  // label to the given card after creation.
  const scope = idCard ? 'card' : 'board';
  const idScope = idCard || idBoard;

  const apiUrl = sanitizeUrl`/1/${{
    value: scope,
    type: 'stringUnion',
    allowedValues: ['card', 'board'],
  }}/${
    scope === 'card'
      ? { value: idScope, type: 'cardId' }
      : { value: idScope, type: 'boardId' }
  }/labels`;

  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: JSON.stringify({
      color,
      name,
      idBoard,
      ...getCsrfRequestPayload(),
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(traceId, trelloServerVersion);

  const label = await response.json();

  return prepareDataForApolloCache(label, rootNode);
};

export const deleteLabel: TrelloRestResolver<MutationDeleteLabelArgs> = async (
  obj,
  args,
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/labels/${{ value: args.id, type: 'otherId' }}`;

  const response = await safeFetch(apiUrl, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(args.traceId),
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(args.traceId, trelloServerVersion);

  await response.json();

  return prepareDataForApolloCache({ success: true }, rootNode);
};

export const updateLabel: TrelloRestResolver<MutationUpdateLabelArgs> = async (
  obj,
  args,
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/labels/${{
    value: args.label.id,
    type: 'otherId',
  }}`;

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(args.traceId),
    },
    body: JSON.stringify({
      name: args.label.name ?? '',
      color: args.label.color ?? 'null',
      ...getCsrfRequestPayload(),
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(args.traceId, trelloServerVersion);

  const label = await response.json();

  return prepareDataForApolloCache(label, rootNode);
};
