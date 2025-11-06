import { unsplashClient } from '@trello/unsplash';

import type { QueryUnsplashPhotosArgs } from '../generated';
import { isQueryInfo } from '../isQueryInfo';
import { prepareDataForApolloCache } from '../prepareDataForApolloCache';
import type { JSONArray, TrelloRestResolver } from '../types';

export const unsplashPhotosResolver: TrelloRestResolver<
  QueryUnsplashPhotosArgs
> = async (obj, args, context, info) => {
  const rootNode = isQueryInfo(info) ? info.field : info.fieldNodes[0];
  const searchQuery = args?.query?.trim();
  const page = args?.page || undefined;
  const perPage = args?.perPage || undefined;

  const { response } = searchQuery
    ? await unsplashClient.search({
        query: searchQuery,
        perPage,
        page,
      })
    : await unsplashClient.getDefaultCollection({
        perPage,
        page,
      });

  return prepareDataForApolloCache(
    response?.results as unknown as JSONArray,
    rootNode,
  );
};
