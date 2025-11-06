import { dangerouslyGetFeatureGateSync } from '@trello/feature-gate-client';
import {
  isRouteFullyModernized,
  routeDefinitions,
  type RouteIdType,
} from '@trello/router/routes';

const routeGateCache: Partial<Record<RouteIdType, boolean>> = {};

/**
 * Check if the feature gate for a specific route is enabled.
 */
export const isRouteModernized = (routeId: RouteIdType): boolean => {
  if (routeGateCache[routeId] === undefined) {
    const route = routeDefinitions[routeId];

    if (isRouteFullyModernized(route)) {
      routeGateCache[routeId] = true;
    } else {
      const featureGate = route.modernizationFeatureGate;
      routeGateCache[routeId] =
        !!featureGate && dangerouslyGetFeatureGateSync(featureGate);
    }
  }
  return routeGateCache[routeId];
};
