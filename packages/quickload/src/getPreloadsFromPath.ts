// Don't import from index so that we can keep bundle size as low as possible
import { dangerouslyGetDynamicConfigSync } from '@trello/dynamic-config/dangerouslyGetDynamicConfigSync';
import { isShortLink } from '@trello/id-cache';

import { formatUrl } from './formatUrl';
import type { QuickLoadOperations } from './operation-to-quickload-url.generated';
import { QuickloadDefinitions } from './quickload-definitions.generated';
import type { QuickloadUrl, SimpleRequestObject } from './quickload.types';

const allowedByDynamicConfig = (req: SimpleRequestObject): boolean => {
  const isAllowed =
    !req.dynamicConfig ||
    dangerouslyGetDynamicConfigSync(req.dynamicConfig.key) ===
      req.dynamicConfig.value;
  return isAllowed;
};

export const getPreloadsFromPath = (
  pathname: string = window.location.pathname,
  search: string = window.location.search,
  cookie: string = window.document.cookie,
): {
  path: string;
  preloads: QuickloadUrl[];
  deferredPreloads: string[];
  param: string;
} => {
  const formattedPath = pathname.replace(/\?(.*)$/, '');

  // Find the preloads that match the current pathname
  // by using regular expressions
  const preloadKeyMatch = Object.keys(QuickloadDefinitions).find(
    (routeRegExp) => {
      // we concat header requests regardless after this, so don't match
      // anything for header here.
      if (routeRegExp === 'header') {
        return false;
      }

      const routeDefinition = QuickloadDefinitions[routeRegExp].requests;
      const routeRegex = new RegExp(routeRegExp);
      // Check that the requests associated with the route are either not FFed or evaluate to true.
      if (routeDefinition.find(allowedByDynamicConfig)) {
        return routeRegex.test(formattedPath);
      }
      return false;
    },
  );
  const preloads =
    preloadKeyMatch &&
    QuickloadDefinitions[preloadKeyMatch].requests.filter(
      allowedByDynamicConfig,
    );
  const deferredPreloads =
    preloadKeyMatch && QuickloadDefinitions[preloadKeyMatch].deferredPreloads
      ? (QuickloadDefinitions[preloadKeyMatch].deferredPreloads as string[])
      : [];

  const taskName =
    (preloadKeyMatch && QuickloadDefinitions[preloadKeyMatch].taskName) || null;

  // exec the param using the reg exp to get the org name, board id, card id, etc.
  let param = new RegExp(preloadKeyMatch || '').exec(formattedPath)?.[1] || '';

  // exception for search is to exec against q search param
  if (new RegExp(`^/search$`).test(pathname)) {
    param = new URLSearchParams(search).get('q') || '';
  }

  // Check if the param is a valid for preload request
  // This is to avoid calling TrelloCurrentBoardInfo with objectId
  // We will need a better long term solution for this
  const paramIsShortLink = isShortLink(param);

  // get header definitions and append them as well
  const headerDefinitions = QuickloadDefinitions.header.requests.filter(
    allowedByDynamicConfig,
  );

  const formattedPreloads = headerDefinitions
    .concat(preloads || [])
    .filter(({ graphQLPayload, rootId }) => {
      // Include all REST queries
      if (!graphQLPayload) return true;

      // Include native GQL me and *byShortLink queries
      return rootId === ':idMember' || paramIsShortLink;
    })
    .map(({ url, rootId, operationName, modelName, graphQLPayload }) => {
      const preload: QuickloadUrl = {
        url: formatUrl(url, {
          rootId,
          idModel: rootId === ':idMember' ? 'me' : param,
        }),
        operationName,
        modelName,
        queryName: operationName.replace(
          'quickload:',
          '',
        ) as QuickLoadOperations,
        taskName,
      };

      if (graphQLPayload) {
        preload.graphQLPayload = {
          ...graphQLPayload,
          variables: rootId === ':idMember' ? {} : { id: param },
        };
      }
      return preload;
    });

  return {
    path: formattedPath,
    preloads: formattedPreloads,
    deferredPreloads,
    param,
  };
};
