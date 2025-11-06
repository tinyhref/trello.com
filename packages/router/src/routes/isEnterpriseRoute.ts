import { RouteId, type RouteIdType } from './RouteId';

const enterpriseRoutes = new Set<RouteIdType>([
  RouteId.ENTERPRISE_ADMIN,
  RouteId.ENTERPRISE_ADMIN_TAB,
]);

export const isEnterpriseRoute = (routeId: RouteIdType): boolean =>
  enterpriseRoutes.has(routeId);
