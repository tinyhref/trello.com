import { RouteId, type RouteIdType } from './RouteId';

const cardRoutes = new Set<string>([RouteId.CARD]);

export const isCardRoute = (routeId: RouteIdType): boolean =>
  cardRoutes.has(routeId);
