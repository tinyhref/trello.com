/**
 * This originally lived in @trello/config, but that was actually a circular
 * dependency with this package.
 */

export const AppId = {
  Desktop: 'desktop',
} as const;
type AppIdString = (typeof AppId)[keyof typeof AppId];

export interface ClientConfigInit {
  readonly appId?: AppIdString;
  readonly dontDismissNotifications?: boolean;
  readonly limitMemoryUsage?: boolean;
  readonly desktopVersion?: string;
}
