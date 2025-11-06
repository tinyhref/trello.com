import { matchPath } from 'react-router';

import type { FeatureGateKeys } from '@trello/feature-gates';
import type { PIIString } from '@trello/privacy';

import { getTokensFromBackbonePattern } from './getTokensFromBackbonePattern';
import type { RouteIdType } from './RouteId';

export type RouteParam = {
  [key: string]: PIIString | string | null;
} | null;

interface BaseRoute<
  TBaseParams extends RouteParam,
  TParsedParams = TBaseParams,
> {
  id: RouteIdType;
  regExp: RegExp;
  routeParamsToPathname: (params: TParsedParams) => string;
  parseRouteParams?: (params: TBaseParams) => TParsedParams;
  /**
   * Will retrieve the tokens from the pathname by using a RegExp
   * against the pattern defined for the route.
   * @param pathname window.location.pathname
   * @returns tokenized route parameters
   */
  getRouteParams: (pathname: string) => TParsedParams;
}

export interface NonModernizedRoute<
  TBaseParams extends RouteParam,
  TParsedParams = TBaseParams,
> extends BaseRoute<TBaseParams, TParsedParams> {
  backbonePattern: string;
  modernizationFeatureGate?: never;
  reactPattern?: never;
  pattern?: never;
}

export interface PartiallyModernizedRoute<
  TBaseParams extends RouteParam,
  TParsedParams = TBaseParams,
> extends BaseRoute<TBaseParams, TParsedParams> {
  backbonePattern: string;
  modernizationFeatureGate: FeatureGateKeys;
  reactPattern: string;
  pattern?: never;
}

export interface FullyModernizedRoute<
  TBaseParams extends RouteParam,
  TParsedParams = TBaseParams,
> extends BaseRoute<TBaseParams, TParsedParams> {
  pattern: string;
  backbonePattern?: never;
  modernizationFeatureGate?: never;
  reactPattern?: never;
}

/**
 * Route type defines the structure for route configurations.
 * There are three valid variants:
 *
 * 1. Legacy Backbone only: backbonePattern (no modernization, no reactPattern)
 * 2. Legacy Backbone + React migration: backbonePattern + modernizationFeatureGate + reactPattern
 * 3. Modern pattern only: pattern (no backbonePattern, no modernizationFeatureGate, no reactPattern)
 */
export type Route<
  TBaseParams extends RouteParam,
  TParsedParams = TBaseParams,
> =
  | FullyModernizedRoute<TBaseParams, TParsedParams>
  | NonModernizedRoute<TBaseParams, TParsedParams>
  | PartiallyModernizedRoute<TBaseParams, TParsedParams>;

// Input types for createRoute function overloads
type NonModernizedRouteConfig<
  TBaseParams extends RouteParam,
  TParsedParams = TBaseParams,
> = Omit<NonModernizedRoute<TBaseParams, TParsedParams>, 'getRouteParams'>;

type PartiallyModernizedRouteConfig<
  TBaseParams extends RouteParam,
  TParsedParams = TBaseParams,
> = Omit<
  PartiallyModernizedRoute<TBaseParams, TParsedParams>,
  'getRouteParams'
>;

type FullyModernizedRouteConfig<
  TBaseParams extends RouteParam,
  TParsedParams = TBaseParams,
> = Omit<FullyModernizedRoute<TBaseParams, TParsedParams>, 'getRouteParams'>;

/**
 * Creates a route configuration object with the getRouteParams method.
 * Function overloads ensure only valid combinations of properties are allowed.
 */
export function createRouteDefinition<
  TBaseParams extends RouteParam,
  TParsedParams = TBaseParams,
>(
  config: PartiallyModernizedRouteConfig<TBaseParams, TParsedParams>,
): PartiallyModernizedRoute<TBaseParams, TParsedParams>;
export function createRouteDefinition<
  TBaseParams extends RouteParam,
  TParsedParams = TBaseParams,
>(
  config: NonModernizedRouteConfig<TBaseParams, TParsedParams>,
): NonModernizedRoute<TBaseParams, TParsedParams>;
export function createRouteDefinition<
  TBaseParams extends RouteParam,
  TParsedParams = TBaseParams,
>(
  config: FullyModernizedRouteConfig<TBaseParams, TParsedParams>,
): FullyModernizedRoute<TBaseParams, TParsedParams>;
export function createRouteDefinition<
  TBaseParams extends RouteParam,
  TParsedParams = TBaseParams,
>(
  config:
    | FullyModernizedRouteConfig<TBaseParams, TParsedParams>
    | NonModernizedRouteConfig<TBaseParams, TParsedParams>
    | PartiallyModernizedRouteConfig<TBaseParams, TParsedParams>,
): Route<TBaseParams, TParsedParams> {
  const getRouteParams = (pathname: string): TParsedParams => {
    // If the route has a modern pattern, use react-router's matchPath
    // https://reactrouter.com/api/utils/matchPath
    if ('pattern' in config && config.pattern) {
      const match = matchPath(config.pattern, pathname);
      if (match) {
        return match.params as TParsedParams;
      }
    }

    // Otherwise, fall back to using custom backbone route parsing logic
    const routeTokens = getTokensFromBackbonePattern(config.backbonePattern!);
    const routeTokenValues = pathname.slice(1).match(config.regExp);

    const params = routeTokens.reduce(
      (accParams, token, i) => ({
        ...accParams,
        [token]: routeTokenValues?.[i + 1] || null,
      }),
      {},
    ) as TBaseParams;

    if (config.parseRouteParams) {
      return config.parseRouteParams(params);
    }

    return params as unknown as TParsedParams;
  };

  return {
    ...config,
    getRouteParams,
  } as Route<TBaseParams, TParsedParams>;
}
