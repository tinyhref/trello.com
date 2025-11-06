import type { FullyModernizedRoute, Route } from './createRouteDefinition';

/**
 * Given a route, this function checks if it is fully modernized.
 * The primary criteria is that it has a defined pattern, and does not have a modernization feature gate
 * (the latter shouldn't be possible with the current type setup).
 */
export const isRouteFullyModernized = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  route: Route<any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): route is FullyModernizedRoute<any> => {
  return !!route.pattern && !route.modernizationFeatureGate;
};
