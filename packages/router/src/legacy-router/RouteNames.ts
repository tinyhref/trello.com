/** @deprecated */

export const RouteNames_DO_NOT_USE = {
  ROOT: 'root',
  BOARD: 'board',
  CARD: 'card',
  PROFILE: 'profile',
  SEARCH: 'search',
  SHORTCUTS: 'shortcuts',
  POWER_UPS: 'power-ups',
  UNKNOWN: 'unknown',
  WORKSPACE: 'workspace',
} as const;
// eslint-disable-next-line @typescript-eslint/naming-convention
export type RouteNames_DO_NOT_USE_TYPE =
  (typeof RouteNames_DO_NOT_USE)[keyof typeof RouteNames_DO_NOT_USE];
