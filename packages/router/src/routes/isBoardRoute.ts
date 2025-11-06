import { RouteId, type RouteIdType } from './RouteId';

const boardRoutes = new Set<string>([RouteId.BOARD, RouteId.BOARD_REFERRAL]);

export const isBoardRoute = (routeId: RouteIdType): boolean =>
  boardRoutes.has(routeId);
