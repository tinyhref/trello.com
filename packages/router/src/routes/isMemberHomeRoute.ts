import { RouteId, type RouteIdType } from './RouteId';

const memberHomeRoutes = new Set<string>([
  RouteId.MEMBER_HOME_WORKSPACE_BOARDS,
]);

export const isMemberHomeRoute = (routeId: RouteIdType): boolean =>
  memberHomeRoutes.has(routeId);
