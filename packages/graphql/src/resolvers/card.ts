import { Analytics } from '@trello/atlassian-analytics';
import { clientVersion } from '@trello/config';
import { sendNetworkErrorEvent } from '@trello/error-reporting';
import { parseNetworkError } from '@trello/graphql-error-handling';
import { sanitizeUrl } from '@trello/safe-urls';
import { getCsrfRequestPayload } from '@trello/session-cookie/csrf';

import { safeFetch, safeTrelloFetch } from '../fetch';
import type {
  MutationAddAttachmentToCardArgs,
  MutationAddCardCommentArgs,
  MutationAddMemberToCardArgs,
  MutationAddMemberVotedArgs,
  MutationAddRecurrenceRuleToCardArgs,
  MutationAddStickerToCardArgs,
  MutationArchiveCardArgs,
  MutationChangeCardDueDateArgs,
  MutationCopyCardArgs,
  MutationCreateCardArgs,
  MutationCreateCardFromFileArgs,
  MutationCreateCardTemplateArgs,
  MutationDeleteCardArgs,
  MutationDeleteCardCommentArgs,
  MutationDeleteMemberVotedArgs,
  MutationDeleteRecurrenceRuleToCardArgs,
  MutationMarkAssociatedNotificationsReadArgs,
  MutationMarkCardAsViewedArgs,
  MutationRemoveAttachmentFromCardArgs,
  MutationRemoveMemberFromCardArgs,
  MutationRemoveStickerFromCardArgs,
  MutationRetryAiArgs,
  MutationSetPinCardArgs,
  MutationUnarchiveCardArgs,
  MutationUpdateCardArgs,
  MutationUpdateCardAttachmentArgs,
  MutationUpdateCardCommentArgs,
  MutationUpdateCardCoverArgs,
  MutationUpdateCardDatesArgs,
  MutationUpdateCardDueCompleteArgs,
  MutationUpdateCardLabelsArgs,
  MutationUpdateCardListArgs,
  MutationUpdateCardLocationArgs,
  MutationUpdateCardNameArgs,
  MutationUpdateCardPosArgs,
  MutationUpdateCardRoleArgs,
  MutationUpdateCardSubscriptionArgs,
  MutationUploadCardCoverArgs,
  QueryArchivedCardsForBoardArgs,
  QueryCardActionsArgs,
} from '../generated';
import { isQueryInfo } from '../isQueryInfo';
import { prepareDataForApolloCache } from '../prepareDataForApolloCache';
import { UPDATE_CARD_MAPPINGS } from '../syncDeltaToCache/filteredActionsPatching/filteredActionsPatching';
import type { JSONObject, TrelloRestResolver } from '../types';

class XMLHttpRequestError extends Error {
  constructor({
    status,
    statusText,
    responseText = '',
  }: Pick<XMLHttpRequest, 'responseText' | 'status' | 'statusText'>) {
    /*
     * In HOT-109932 we observed that the responseText of some error responses
     * contained UGC & PII. We initially completely redacted all responseText
     * but to make debugging simpler, only redact if html is detected. Raw HTML
     * shouldn't be logged.
     */
    const basicHtmlRegex = /<\/?[a-z][\s\S]*>/i;
    const containsPossibleHtml = basicHtmlRegex.test(responseText);

    let errorMessage = `XMLHttpRequestError: ${status} ${statusText}`;
    if (containsPossibleHtml) {
      errorMessage += ' [redacted response (contained HTML)]';
    } else {
      errorMessage += ` ${responseText}`;
    }

    super(errorMessage);
  }
}

export const addAttachmentToCard: TrelloRestResolver<
  MutationAddAttachmentToCardArgs
> = async (obj, { cardId, name, file, mimeType, url, pos }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const formData = new FormData();
  file && formData.set('file', file);
  name && formData.set('name', name);
  mimeType && formData.set('mimeType', mimeType);
  url && formData.set('url', url);
  pos && formData.set('pos', pos.toString());

  const csrfPayload = getCsrfRequestPayload({
    fallbackValue: '',
  });
  if (csrfPayload.dsc) {
    formData.set('dsc', csrfPayload.dsc);
  }

  // We need to use XHR in order to track upload progress
  const request = new Promise<JSONObject>((resolve, reject) => {
    const apiUrl = sanitizeUrl`/1/cards/${{
      value: cardId,
      type: 'cardId',
    }}/attachments`;
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('POST', apiUrl as unknown as string);
    if (context.operationName) {
      xhr.setRequestHeader('X-Trello-Operation-Name', context.operationName);
    }
    const traceId = context.traceId;
    if (traceId) {
      const tracingHeaders = Analytics.getTaskRequestHeaders(traceId);
      for (const header in tracingHeaders) {
        const value = tracingHeaders[header as keyof typeof tracingHeaders];
        xhr.setRequestHeader(header, value);
      }
    }
    xhr.setRequestHeader('X-Trello-Client-Version', clientVersion);
    xhr.onload = () => {
      const trelloServerVersion = xhr.getResponseHeader('X-Trello-Version');
      Analytics.setTrelloServerVersion(null, trelloServerVersion);

      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.response);
        resolve(response);
      } else {
        sendNetworkErrorEvent({
          url: apiUrl,
          response: xhr.statusText,
          status: xhr.status,
          operationName: context.operationName,
        });
        reject(
          new XMLHttpRequestError({
            status: xhr.status,
            statusText: xhr.statusText,
            responseText: xhr.responseText,
          }),
        );
      }
    };
    xhr.onerror = () => {
      const trelloServerVersion = xhr.getResponseHeader('X-Trello-Version');
      Analytics.setTrelloServerVersion(null, trelloServerVersion);

      sendNetworkErrorEvent({
        url: apiUrl,
        response: xhr.statusText,
        status: xhr.status,
        operationName: context.operationName,
      });
      reject(
        new XMLHttpRequestError({
          status: xhr.status,
          statusText: xhr.statusText,
          responseText: xhr.responseText,
        }),
      );
    };

    xhr.send(formData);
  });

  try {
    const attachment = await request;
    return prepareDataForApolloCache(attachment, rootNode);
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    } else {
      throw new Error(`Unexpected error: ${err}`);
    }
  }
};

export const updateCardAttachment: TrelloRestResolver<
  MutationUpdateCardAttachmentArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  if (!args.fields) {
    throw new Error('Expected fields argument is missing.');
  }

  const apiUrl = sanitizeUrl`/1/cards/${{
    value: args.cardId,
    type: 'cardId',
  }}/attachments/${{ value: args.attachmentId, type: 'attachmentId' }}`;

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      // files will not have a URL
      ...args.fields,
      ...getCsrfRequestPayload(),
    }),
  });

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  return prepareDataForApolloCache(await response.json(), rootNode);
};

export const removeAttachmentFromCard: TrelloRestResolver<
  MutationRemoveAttachmentFromCardArgs
> = async (obj, { cardId, traceId, attachmentId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/cards/${{
    value: cardId,
    type: 'cardId',
  }}/attachments/${{ value: attachmentId, type: 'attachmentId' }}`;

  const response = await safeFetch(apiUrl, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
    }),
  });

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  return prepareDataForApolloCache({ success: true }, rootNode);
};

export const uploadCardCover: TrelloRestResolver<
  MutationUploadCardCoverArgs
> = async (obj, { cardId, file, traceId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const formData = new FormData();
  formData.set('file', file);
  formData.set('setCover', 'true');

  const csrfPayload = getCsrfRequestPayload({
    fallbackValue: '',
  });
  if (csrfPayload.dsc) {
    formData.set('dsc', csrfPayload.dsc);
  }

  // We need to use XHR in order to track upload progress
  const request = new Promise<JSONObject>((resolve, reject) => {
    const apiUrl = sanitizeUrl`/1/cards/${{
      value: cardId,
      type: 'cardId',
    }}/attachments`;
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('POST', apiUrl as unknown as string);
    const tracingHeaders = Analytics.getTaskRequestHeaders(traceId);
    for (const header in tracingHeaders) {
      const value = tracingHeaders[header as keyof typeof tracingHeaders];
      xhr.setRequestHeader(header, value);
    }
    xhr.onload = () => {
      const trelloServerVersion = xhr.getResponseHeader('X-Trello-Version');
      Analytics.setTrelloServerVersion(traceId, trelloServerVersion);

      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.response);
        resolve(response);
      } else {
        sendNetworkErrorEvent({
          url: apiUrl,
          response: xhr.statusText,
          status: xhr.status,
          operationName: context.operationName,
        });

        reject(xhr.statusText);
      }
    };
    xhr.onerror = () => {
      const trelloServerVersion = xhr.getResponseHeader('X-Trello-Version');
      Analytics.setTrelloServerVersion(traceId, trelloServerVersion);

      sendNetworkErrorEvent({
        url: apiUrl,
        response: xhr.statusText,
        status: xhr.status,
        operationName: context.operationName,
      });

      reject({ status: xhr.status, statusText: xhr.statusText });
    };

    xhr.send(formData);
  });

  try {
    const attachment = await request;
    return prepareDataForApolloCache(attachment, rootNode);
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

export const updateCard: TrelloRestResolver<MutationUpdateCardArgs> = async (
  obj,
  { idCard, traceId, card },
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/cards/${{ value: idCard, type: 'cardId' }}`;

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: JSON.stringify({
      ...card,
      ...getCsrfRequestPayload(),
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(traceId, trelloServerVersion);

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  return prepareDataForApolloCache(await response.json(), rootNode);
};

// TODO remove by refactoring to just use updateCard
export const updateCardCover: TrelloRestResolver<
  MutationUpdateCardCoverArgs
> = async (obj, { cardId, cover, traceId }, context, info) =>
  updateCard(
    obj,
    // @ts-expect-error removing a cover accepts '' instead of null
    { idCard: cardId, traceId, card: { cover: cover ?? '' } },
    context,
    info,
  );

export const createCardTemplate: TrelloRestResolver<
  MutationCreateCardTemplateArgs
> = async (obj, { listId, name, closed, traceId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/cards`;
  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: JSON.stringify({
      idList: listId,
      name,
      closed: !!closed,
      isTemplate: true,
      ...getCsrfRequestPayload(),
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(traceId, trelloServerVersion);

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const card = await response.json();

  return prepareDataForApolloCache(card, rootNode);
};

export const createCard: TrelloRestResolver<MutationCreateCardArgs> = async (
  obj,
  args,
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/cards`;
  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(args.traceId),
    },
    body: JSON.stringify({
      idList: args.idList,
      name: args.name,
      idLabels: args.idLabels,
      idMembers: args.idMembers,
      due: args.due,
      start: args.start,
      closed: !!closed,
      isTemplate: false,
      pos: args.pos,
      cardRole: args.cardRole,
      desc: args.desc,
      faviconUrl: args.faviconUrl,
      urlSource: args.urlSource,
      urlSourceText: args.urlSourceText,
      externalSource: args.externalSource,
      dueComplete: !!args.dueComplete,
      address: args.address,
      coordinates: args.coordinates,
      locationName: args.locationName,
      agentName: args.agentName,
      ...getCsrfRequestPayload(),
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(args.traceId, trelloServerVersion);

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const card = await response.json();

  return prepareDataForApolloCache(card, rootNode);
};

export const copyCard: TrelloRestResolver<MutationCopyCardArgs> = async (
  obj,
  { idCardSource, idList, name, keepFromSource, traceId, pos },
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/cards`;
  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: JSON.stringify({
      idCardSource,
      idList,
      name,
      keepFromSource: keepFromSource ? keepFromSource.join(',') : '',
      pos,
      ...getCsrfRequestPayload(),
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(traceId, trelloServerVersion);

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const card = await response.json();

  return prepareDataForApolloCache(card, rootNode);
};

export const deleteCard: TrelloRestResolver<MutationDeleteCardArgs> = async (
  obj,
  { idCard, traceId },
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/cards/${{ value: idCard, type: 'cardId' }}`;

  const response = await safeFetch(apiUrl, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
    }),
  });

  await response.json();

  return prepareDataForApolloCache({ success: true }, rootNode);
};

export const retryAI: TrelloRestResolver<MutationRetryAiArgs> = async (
  obj,
  { idCard, aiUseCase },
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const apiUrl = sanitizeUrl`/1/cards/${{ value: idCard, type: 'cardId' }}/ai/${{
    value: aiUseCase,
    type: 'aiUseCase',
  }}`;

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
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
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const card = await response.json();

  return prepareDataForApolloCache(card, rootNode);
};

// TODO remove by refactoring to just use updateCard
export const updateCardName: TrelloRestResolver<
  MutationUpdateCardNameArgs
> = async (obj, { idCard, traceId, name }, context, info) =>
  updateCard(obj, { idCard, traceId, card: { name } }, context, info);

// TODO remove by refactoring to just use updateCard
export const updateCardList: TrelloRestResolver<
  MutationUpdateCardListArgs
> = async (obj, { idCard, idList, traceId }, context, info) =>
  updateCard(
    obj,
    { idCard, traceId: traceId ?? '', card: { idList } },
    context,
    info,
  );

export const updateCardDueComplete: TrelloRestResolver<
  MutationUpdateCardDueCompleteArgs
> = async (obj, { cardId, traceId, dueComplete }, context, info) =>
  updateCard(
    obj,
    { idCard: cardId, traceId, card: { dueComplete } },
    context,
    info,
  );

// TODO remove by refactoring to just use updateCard
export const changeCardDueDate: TrelloRestResolver<
  MutationChangeCardDueDateArgs
> = async (obj, { idCard, due, dueReminder, traceId }, context, info) =>
  updateCard(
    obj,
    { idCard, traceId: traceId ?? '', card: { due: due ?? '', dueReminder } },
    context,
    info,
  );

// TODO remove by refactoring to just use updateCard
export const updateCardDates: TrelloRestResolver<
  MutationUpdateCardDatesArgs
> = async (obj, { idCard, due, start, dueReminder, traceId }, context, info) =>
  updateCard(
    obj,
    {
      idCard,
      traceId: traceId ?? '',
      card: { due: due ?? '', start: start ?? '', dueReminder },
    },
    context,
    info,
  );

// Sending a null value via JSON does not work for the `cardRole`
// field, so we need to duplicate the `updateCard` logic in order
// to pass an empty string for null values (because this is
// incompatible with the Card['cardRole'] type)
// TODO remove by refactoring to just use updateCard
export const updateCardRole: TrelloRestResolver<
  MutationUpdateCardRoleArgs
> = async (obj, { idCard, cardRole }, context, info) =>
  updateCard(
    obj,
    // @ts-expect-error cardRole needs to accept empty string instead of null
    { idCard, traceId: '', card: { cardRole: !cardRole ? '' : cardRole } },
    context,
    info,
  );

// TODO remove by refactoring to just use updateCard
export const archiveCard: TrelloRestResolver<MutationArchiveCardArgs> = async (
  obj,
  { idCard, dateClosed, traceId },
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/cards/${{ value: idCard, type: 'cardId' }}`;

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: JSON.stringify({
      closed: true,
      ...getCsrfRequestPayload(),
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(traceId, trelloServerVersion);

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const data = await response.json();
  return prepareDataForApolloCache({ ...data, dateClosed }, rootNode);
};

// TODO remove by refactoring to just use updateCard
export const unarchiveCard: TrelloRestResolver<
  MutationUnarchiveCardArgs
> = async (obj, { idCard, traceId }, context, info) =>
  updateCard(obj, { idCard, traceId, card: { closed: false } }, context, info);

export const setPinCard: TrelloRestResolver<MutationSetPinCardArgs> = async (
  obj,
  { idCard, pinned, traceId },
  context,
  info,
) =>
  updateCard(obj, { idCard, traceId, card: { pinned, pos: 0 } }, context, info);

export const possibleCardRoleResolver: TrelloRestResolver<object> = async (
  card: {
    id: string;
  },
  args,
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  let model = null;

  const apiUrl = sanitizeUrl`/1/cards/${{
    value: card.id,
    type: 'cardId',
  }}/possibleCardRole`;

  try {
    const response = await safeTrelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Card.possibleCardRole',
        operationName: context.operationName,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    model = await response.json();

    return model
      ? prepareDataForApolloCache(model._value, rootNode, 'Card')
      : null;
  } catch (err) {
    console.error(err);
    return model;
  }
};

export const addRecurrenceRuleToCard: TrelloRestResolver<
  MutationAddRecurrenceRuleToCardArgs
> = async (obj, { idCard, recurrenceRule }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/cards/${{
    value: idCard,
    type: 'cardId',
  }}/recurrenceRule`;

  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      rule: recurrenceRule,
      triggers: [{ trigger: 'dueComplete', changes: ['dueDateChange'] }],
      ...getCsrfRequestPayload(),
    }),
  });

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const card = await response.json();

  return prepareDataForApolloCache(card, rootNode);
};

export const deleteRecurrenceRuleToCard: TrelloRestResolver<
  MutationDeleteRecurrenceRuleToCardArgs
> = async (obj, { idCard }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/cards/${{
    value: idCard,
    type: 'cardId',
  }}/recurrenceRule`;

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
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const card = await response.json();

  return prepareDataForApolloCache(card, rootNode);
};

export const addStickerToCard: TrelloRestResolver<
  MutationAddStickerToCardArgs
> = async (
  obj,
  { idCard, image, imageUrl, rotate, left, top, zIndex },
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/cards/${{
    value: idCard,
    type: 'cardId',
  }}/stickers`;

  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      id: idCard,
      image,
      imageUrl,
      rotate,
      left,
      top,
      zIndex,
      ...getCsrfRequestPayload(),
    }),
  });
  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const sticker = await response.json();
  return prepareDataForApolloCache(sticker, rootNode);
};

export const removeStickerFromCard: TrelloRestResolver<
  MutationRemoveStickerFromCardArgs
> = async (obj, { idCard, idSticker }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  try {
    const apiUrl = sanitizeUrl`/1/cards/${{
      value: idCard,
      type: 'cardId',
    }}/stickers/${{ value: idSticker, type: 'otherId' }}`;

    await safeFetch(apiUrl, {
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
    return prepareDataForApolloCache({ success: true }, rootNode);
  } catch (err) {
    return prepareDataForApolloCache(
      {
        success: false,
        error: (err as Error).message,
      },
      rootNode,
    );
  }
};

export const markAssociatedNotificationsRead: TrelloRestResolver<
  MutationMarkAssociatedNotificationsReadArgs
> = async (obj, { cardId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/cards/${{
    value: cardId,
    type: 'cardId',
  }}/markAssociatedNotificationsRead`;

  const response = await safeTrelloFetch(
    apiUrl,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...getCsrfRequestPayload(),
      }),
    },
    {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Card.markAssociatedNotificationsRead',
        operationName: context.operationName,
      },
    },
  );
  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }
  await response.json();
  return prepareDataForApolloCache({ success: true }, rootNode);
};

export const removeMemberFromCard: TrelloRestResolver<
  MutationRemoveMemberFromCardArgs
> = async (obj, { idCard, idMember, traceId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/cards/${{
    value: idCard,
    type: 'cardId',
  }}/idMembers/${{ value: idMember, type: 'memberId' }}`;

  const response = await safeFetch(apiUrl, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
    }),
  });

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  return prepareDataForApolloCache({ success: true }, rootNode);
};

export const addMemberToCard: TrelloRestResolver<
  MutationAddMemberToCardArgs
> = async (obj, { idCard, idMember, traceId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/cards/${{
    value: idCard,
    type: 'cardId',
  }}/idMembers`;

  const response = await safeFetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: JSON.stringify({
      value: idMember,
      ...getCsrfRequestPayload(),
    }),
  });

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  return prepareDataForApolloCache({ success: true }, rootNode);
};

// TODO remove by refactoring to just use updateCard
export const updateCardLabels: TrelloRestResolver<
  MutationUpdateCardLabelsArgs
> = async (obj, { idCard, idLabels, traceId }, context, info) =>
  updateCard(obj, { idCard, traceId, card: { idLabels } }, context, info);

// TODO remove by refactoring to just use updateCard
export const updateCardSubscription: TrelloRestResolver<
  MutationUpdateCardSubscriptionArgs
> = async (obj, { cardId, traceId, subscribed }, context, info) =>
  updateCard(
    obj,
    { idCard: cardId, traceId, card: { subscribed } },
    context,
    info,
  );

export const addMemberVoted: TrelloRestResolver<
  MutationAddMemberVotedArgs
> = async (obj, { idCard, idMember, traceId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  try {
    const apiUrl = sanitizeUrl`/1/cards/${{
      value: idCard,
      type: 'cardId',
    }}/membersVoted`;
    const response = await safeFetch(apiUrl, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
        ...Analytics.getTaskRequestHeaders(traceId),
      },
      body: JSON.stringify({
        value: idMember,
        ...getCsrfRequestPayload(),
      }),
    });
    if (response.ok) {
      return prepareDataForApolloCache({ id: idCard }, rootNode);
    }
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const deleteMemberVoted: TrelloRestResolver<
  MutationDeleteMemberVotedArgs
> = async (obj, { idCard, idMember, traceId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  try {
    const apiUrl = sanitizeUrl`/1/cards/${{
      value: idCard,
      type: 'cardId',
    }}/membersVoted/${{ value: idMember, type: 'memberId' }}`;
    const response = await safeFetch(apiUrl, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
        ...Analytics.getTaskRequestHeaders(traceId),
      },
      body: JSON.stringify({
        ...getCsrfRequestPayload(),
      }),
    });
    if (response.ok) {
      return prepareDataForApolloCache({ id: idCard }, rootNode);
    }
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const addCardComment: TrelloRestResolver<
  MutationAddCardCommentArgs
> = async (obj, { idCard, comment, traceId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  try {
    const apiUrl = sanitizeUrl`/1/cards/${{
      value: idCard,
      type: 'cardId',
    }}/actions/comments`;
    const response = await safeFetch(apiUrl, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
        ...Analytics.getTaskRequestHeaders(traceId),
      },
      body: JSON.stringify({
        text: comment,
        ...getCsrfRequestPayload(),
      }),
    });
    return prepareDataForApolloCache(await response.json(), rootNode);
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const deleteCardComment: TrelloRestResolver<
  MutationDeleteCardCommentArgs
> = async (obj, { idAction, traceId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/actions/${{
    value: idAction,
    type: 'otherId',
  }}`;

  const response = await safeFetch(apiUrl, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: JSON.stringify({
      ...getCsrfRequestPayload(),
    }),
  });

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  return prepareDataForApolloCache({ success: true }, rootNode);
};

export const updateCardComment: TrelloRestResolver<
  MutationUpdateCardCommentArgs
> = async (obj, { idAction, text, traceId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];

  const apiUrl = sanitizeUrl`/1/actions/${{
    value: idAction,
    type: 'otherId',
  }}`;

  const response = await safeFetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      ...Analytics.getTaskRequestHeaders(traceId),
    },
    body: JSON.stringify({
      text,
      ...getCsrfRequestPayload(),
    }),
  });

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  return prepareDataForApolloCache(await response.json(), rootNode);
};

// TODO remove by refactoring to just use updateCard
export const updateCardPos: TrelloRestResolver<
  MutationUpdateCardPosArgs
> = async (obj, { newIdList, idCard, traceId, pos }, context, info) =>
  updateCard(
    obj,
    { idCard, traceId, card: { pos, idList: newIdList } },
    context,
    info,
  );

export const createCardFromFile: TrelloRestResolver<
  MutationCreateCardFromFileArgs
> = async (obj, { name, fileSource, idList, pos, traceId }, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const formData = new FormData();
  fileSource && formData.set('fileSource', fileSource);
  name && formData.set('name', name);
  idList && formData.set('idList', idList);
  pos && formData.set('pos', pos.toString());

  const csrfPayload = getCsrfRequestPayload({
    fallbackValue: '',
  });
  if (csrfPayload.dsc) {
    formData.set('dsc', csrfPayload.dsc);
  }

  // We need to use XHR in order to track upload progress
  const request = new Promise<JSONObject>((resolve, reject) => {
    const apiUrl = sanitizeUrl`/1/cards`;
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('POST', apiUrl as unknown as string);
    if (context.operationName) {
      xhr.setRequestHeader('X-Trello-Operation-Name', context.operationName);
    }
    if (traceId) {
      const tracingHeaders = Analytics.getTaskRequestHeaders(traceId);
      for (const header in tracingHeaders) {
        const value = tracingHeaders[header as keyof typeof tracingHeaders];
        xhr.setRequestHeader(header, value);
      }
    }
    xhr.setRequestHeader('X-Trello-Client-Version', clientVersion);
    xhr.onload = () => {
      const trelloServerVersion = xhr.getResponseHeader('X-Trello-Version');
      Analytics.setTrelloServerVersion(null, trelloServerVersion);

      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.response);
        resolve(response);
      } else {
        sendNetworkErrorEvent({
          url: apiUrl,
          response: xhr.statusText,
          status: xhr.status,
          operationName: context.operationName,
        });
        reject(
          new XMLHttpRequestError({
            status: xhr.status,
            statusText: xhr.statusText,
            responseText: xhr.responseText,
          }),
        );
      }
    };
    xhr.onerror = () => {
      const trelloServerVersion = xhr.getResponseHeader('X-Trello-Version');
      Analytics.setTrelloServerVersion(null, trelloServerVersion);

      sendNetworkErrorEvent({
        url: apiUrl,
        response: xhr.statusText,
        status: xhr.status,
        operationName: context.operationName,
      });
      reject(
        new XMLHttpRequestError({
          status: xhr.status,
          statusText: xhr.statusText,
          responseText: xhr.responseText,
        }),
      );
    };

    xhr.send(formData);
  });

  try {
    const card = await request;
    return prepareDataForApolloCache(card, rootNode);
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    } else {
      throw new Error(`Unexpected error: ${err}`);
    }
  }
};

export const archivedCardsForBoardResolver: TrelloRestResolver<
  QueryArchivedCardsForBoardArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { idBoard, limit, before } = args;

  const params = new URLSearchParams();
  params.set('stickers', 'true');
  params.set('attachments', 'true');
  params.set('pluginData', 'true');
  params.set('checklists', 'all');
  params.set('customFieldItems', 'true');

  if (limit) {
    params.set('limit', limit.toString());
  }

  if (before) {
    params.set('before', before.toString());
  }

  const apiUrl = sanitizeUrl`/1/boards/${{
    value: idBoard,
    type: 'boardId',
  }}/cards/closed?${params}`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'archivedCardsForBoard',
      operationName: context.operationName,
    },
  });

  if (response.ok) {
    const model = await response.json();
    return prepareDataForApolloCache(model, rootNode);
  } else {
    throw new Error(
      `An error occurred while resolving a GraphQL query. (status: ${response.status}, statusText: ${response.statusText})`,
    );
  }
};

export const cardActionsResolver: TrelloRestResolver<
  QueryCardActionsArgs
> = async (_parent, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { cardId, filter, limit } = args;
  const params = new URLSearchParams({
    // specifying "id" field to avoid fetching the whole card
    fields: 'id',
    actions: filter
      ? filter.map((f) => UPDATE_CARD_MAPPINGS[f] || f).join(',')
      : 'all',
    actions_display: 'true',
    action_reactions: 'true',
  });

  if (limit) {
    params.set('actions_limit', limit?.toString());
  }

  const apiUrl = sanitizeUrl`/1/cards/${{
    value: cardId,
    type: 'cardId',
  }}?${params}`;

  const response = await safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'cardActions',
      operationName: context.operationName,
    },
  });

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });

    throw await parseNetworkError(response);
  }

  const { actions } = await response.json();
  return prepareDataForApolloCache(actions, rootNode);
};

export const markCardAsViewed: TrelloRestResolver<
  MutationMarkCardAsViewedArgs
> = async (_parent, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const { idCard } = args;

  const apiUrl = sanitizeUrl`/1/cards/${{
    value: idCard,
    type: 'cardId',
  }}/markAsViewed`;

  const response = await safeFetch(apiUrl, {
    method: 'POST',
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
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });

    throw await parseNetworkError(response);
  }

  return prepareDataForApolloCache(await response.json(), rootNode);
};

export const updateCardLocation: TrelloRestResolver<
  MutationUpdateCardLocationArgs
> = async (
  obj,
  { idCard, address, coordinates, locationName, traceId },
  context,
  info,
) => {
  return updateCard(
    obj,
    { idCard, traceId, card: { address, coordinates, locationName } },
    context,
    info,
  );
};
