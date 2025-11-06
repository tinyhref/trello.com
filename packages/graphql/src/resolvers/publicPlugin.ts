import { sanitizeUrl } from '@trello/safe-urls';

import { safeTrelloFetch } from '../fetch';
import type { QueryPublicPluginsArgs } from '../generated';
import { isQueryInfo } from '../isQueryInfo';
import { prepareDataForApolloCache } from '../prepareDataForApolloCache';
import type { TrelloRestResolver, TypedJSONObject } from '../types';

export const publicPluginsResolver: TrelloRestResolver<
  QueryPublicPluginsArgs
> = async (
  organization: {
    id: string;
  },
  args,
  context,
  info,
): Promise<TypedJSONObject> => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  let model = null;

  const searchParams = new URLSearchParams();

  if (args?.preferredLocales) {
    searchParams.append('preferredLocales', args.preferredLocales);
  }

  const apiUrl = sanitizeUrl`/1/plugins/public?${searchParams}`;

  try {
    const response = await safeTrelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'publicPlugins',
        operationName: context.operationName,
      },
    });

    if (response.ok) {
      model = await response.json();
    } else {
      if (response.status === 404) {
        model = null;
      } else {
        throw new Error(
          `An error occurred while resolving a GraphQL query. (status: ${response.status}, statusText: ${response.statusText})`,
        );
      }
    }

    return model
      ? (prepareDataForApolloCache(model, rootNode) as TypedJSONObject)
      : model;
  } catch (err) {
    console.error(err);
    return model;
  }
};

export const pluginCategoriesResolver: TrelloRestResolver<object> = async (
  obj,
  args,
  context,
  info,
) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  let model = null;

  const apiUrl = sanitizeUrl`/1/plugins/categories`;

  try {
    const response = await safeTrelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'pluginCategories',
        operationName: context.operationName,
      },
    });

    if (response.ok) {
      model = await response.json();
    } else {
      if (response.status === 404) {
        model = null;
      } else {
        throw new Error(
          `An error occurred while resolving a GraphQL query. (status: ${response.status}, statusText: ${response.statusText})`,
        );
      }
    }

    return prepareDataForApolloCache(model, rootNode);
  } catch (err) {
    console.error(err);
    return model;
  }
};
