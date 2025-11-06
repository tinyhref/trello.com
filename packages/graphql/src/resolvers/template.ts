import { sendNetworkErrorEvent } from '@trello/error-reporting';
import { parseNetworkError } from '@trello/graphql-error-handling';
import { dangerouslyConvertPrivacyString } from '@trello/privacy';
import { sanitizeUrl } from '@trello/safe-urls';

import { safeTrelloFetch } from '../fetch';
import type { QueryTemplateGalleryArgs } from '../generated';
import { isQueryInfo } from '../isQueryInfo';
import { prepareDataForApolloCache } from '../prepareDataForApolloCache';
import type { TrelloRestResolver, TypedJSONObject } from '../types';

export const templateCategoriesResolver: TrelloRestResolver<unknown> = async (
  _parent,
  _args,
  context,
  info,
): Promise<TypedJSONObject> => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  let model = null;

  const apiUrl = sanitizeUrl`/1/resources/templates/categories`;

  let response;
  try {
    response = await safeTrelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'templateCategories',
        operationName: context.operationName,
      },
    });

    if (response.ok) {
      model = await response.json();
      return model
        ? (prepareDataForApolloCache(model, rootNode) as TypedJSONObject)
        : model;
    }

    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
  } catch (err) {
    console.error(err);
    throw new Error(
      `An error occurred while fetching/parsing template categories GraphQL query. (error: ${err}, status: ${response?.status}, statusText: ${response?.statusText}`,
    );
  }
  throw await parseNetworkError(response);
};

export const templateLanguagesResolver: TrelloRestResolver<unknown> = async (
  _parent,
  _args,
  context,
  info,
): Promise<TypedJSONObject> => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  let model = null;

  const searchParams = new URLSearchParams({ enabled: 'true' });
  const apiUrl = sanitizeUrl`/1/resources/templates/languages?${searchParams}`;

  let response;

  try {
    response = await safeTrelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'templateLanguages',
        operationName: context.operationName,
      },
    });

    if (response.ok) {
      model = await response.json();
      return model
        ? (prepareDataForApolloCache(model, rootNode) as TypedJSONObject)
        : model;
    }
  } catch (err) {
    console.error(err);
    throw new Error(
      `An error occurred while fetching/parsing template languages GraphQL query. ${{
        error: err,
        response,
      }}`,
    );
  }

  throw new Error(
    `An error occurred while resolving template languages GraphQL query. (status: ${response?.status}, statusText: ${response?.statusText})`,
  );
};

export const templateGalleryResolver: TrelloRestResolver<
  QueryTemplateGalleryArgs
> = async (_parent, args, context, info): Promise<TypedJSONObject> => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  let model = null;

  const locale = dangerouslyConvertPrivacyString(args.locale) || 'en';
  const searchParams = new URLSearchParams({ locale });
  const apiUrl = sanitizeUrl`/1/boards/templates/gallery?${searchParams}`;

  let response;

  try {
    response = await safeTrelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'templateGallery',
        operationName: context.operationName,
      },
    });

    if (response.ok) {
      model = await response.json();
      return model
        ? (prepareDataForApolloCache(model, rootNode) as TypedJSONObject)
        : model;
    }

    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
  } catch (err) {
    console.error(err);
    throw new Error(
      `An error occurred while fetching/parsing template gallery GraphQL query.(error: ${err}, status: ${response?.status}, statusText: ${response?.statusText}`,
    );
  }
  throw await parseNetworkError(response);
};
