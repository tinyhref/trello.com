import type { SourceType } from '@trello/analytics-types';
import { getLocation } from '@trello/router';
import {
  getRouteIdFromPathname,
  RouteId,
  type RouteIdType,
} from '@trello/router/routes';

export const routeScreens: Record<RouteIdType, SourceType> = {
  [RouteId.ACCOUNT]: 'memberAccountScreen',
  [RouteId.OLD_ACCOUNT]: 'memberAccountScreen',
  [RouteId.WORKSPACE_BILLING]: 'billingRoute', // workspaceBillingScreen
  [RouteId.BILLING]: 'billingRoute', // workspaceBillingScreen
  [RouteId.BLANK]: 'blankScreen',
  [RouteId.BOARD]: 'boardScreen',
  [RouteId.BOARD_OLD]: 'boardScreen',
  [RouteId.BOARD_REFERRAL]: 'boardReferralRoute',
  [RouteId.CARD]: 'cardDetailScreen',
  [RouteId.CARD_OLD]: 'cardDetailScreen',
  [RouteId.CARD_AND_BOARD_OLD]: 'cardAndBoardRoute',
  [RouteId.CREATE_FIRST_BOARD]: 'createFirstBoardScreen',
  [RouteId.WELCOME_TO_TRELLO]: 'moonshotCreateWorkspaceScreen',
  [RouteId.DOUBLE_SLASH]: 'doubleSlashSearchRoute',
  [RouteId.ENTERPRISE_ADMIN]: 'enterpriseAdminDashboardScreen',
  [RouteId.ENTERPRISE_ADMIN_TAB]: 'enterpriseAdminDashboardTabRoute',
  [RouteId.ERROR_PAGE]: 'pageNotFoundErrorScreen',
  [RouteId.GET_APP]: 'getAppScreen',
  [RouteId.GO]: 'goSearchRoute',
  [RouteId.INBOX]: 'inboxScreen',
  [RouteId.OLD_INBOX]: 'inboxScreen',
  [RouteId.INVITE_ACCEPT_BOARD]: 'acceptBoardInvitationScreen',
  [RouteId.INVITE_ACCEPT_TEAM]: 'acceptTeamInvitationScreen',
  [RouteId.MEMBER_ACTIVITY]: 'memberActivityScreen',
  [RouteId.OLD_MEMBER_ACTIVITY]: 'memberActivityScreen',
  [RouteId.MEMBER_ALL_BOARDS]: 'memberBoardsHomeScreen',
  [RouteId.OLD_MEMBER_ALL_BOARDS]: 'memberBoardsHomeScreen',
  [RouteId.MEMBER_CARDS]: 'memberCardsScreen',
  [RouteId.OLD_MEMBER_CARDS]: 'memberCardsScreen',
  [RouteId.MEMBER_CARDS_FOR_ORG]: 'memberCardsScreen',
  [RouteId.OLD_MEMBER_CARDS_FOR_ORG]: 'memberCardsScreen',
  [RouteId.OLD_ORGANIZATION_GUESTS]: 'workspaceGuestsScreen',
  [RouteId.OLD_ORGANIZATION_MEMBERS]: 'workspaceMembersScreen',
  [RouteId.OLD_ORGANIZATION_REQUESTS]: 'workspaceRequestsScreen',
  [RouteId.MEMBER_HOME]: 'memberHomeScreen',
  [RouteId.MEMBER_HOME_WORKSPACE_BOARDS]: 'workspaceBoardsHomeScreen',
  [RouteId.OLD_MEMBER_HOME_WORKSPACE_BOARDS]: 'workspaceBoardsHomeScreen',
  [RouteId.MEMBER_LABS]: 'memberLabsScreen',
  [RouteId.OLD_MEMBER_LABS]: 'memberLabsScreen',
  [RouteId.MEMBER_PROFILE_SECTION]: 'memberProfileScreen',
  [RouteId.MEMBER_TASKS]: 'memberTasksRoute', // on memberHomeScreen
  [RouteId.ORGANIZATION_BOARDS]: 'workspaceBoardsScreen',
  [RouteId.ORGANIZATION_BY_ID]: 'workspaceBoardsScreen',
  [RouteId.ORGANIZATION_EXPORT]: 'workspaceExportScreen',
  [RouteId.OLD_ORGANIZATION_EXPORT]: 'workspaceExportScreen',
  [RouteId.ORGANIZATION_FREE_TRIAL]: 'freeTrialModal',
  [RouteId.OLD_ORGANIZATION_FREE_TRIAL]: 'freeTrialModal',
  [RouteId.ORGANIZATION_GUESTS]: 'workspaceGuestsScreen',
  [RouteId.ORGANIZATION_REQUESTS]: 'workspaceRequestsScreen',
  [RouteId.ORGANIZATION_MEMBER_CARDS]: 'memberCardsScreen',
  [RouteId.ORGANIZATION_MEMBERS]: 'workspaceMembersScreen',
  [RouteId.ORGANIZATION_POWER_UPS]: 'workspacePowerUpsScreen',
  [RouteId.OLD_ORGANIZATION_POWER_UPS]: 'workspacePowerUpsScreen',
  [RouteId.ORGANIZATION_TABLES]: 'multiBoardTableViewScreen',
  [RouteId.OLD_ORGANIZATION_TABLES]: 'multiBoardTableViewScreen',
  [RouteId.POWER_UP_ADMIN]: 'powerUpAdminScreen',
  [RouteId.APPS_ADMIN]: 'appsAdminScreen',
  [RouteId.POWER_UP_EDIT]: 'powerUpEditScreen',
  [RouteId.APPS_ADMIN_EDIT]: 'appEditScreen',
  [RouteId.POWER_UP_PUBLIC_DIRECTORY]: 'publicDirectoryRoute', // publicDirectoryCategoryScreen', publicDirectoryHomeScreen
  [RouteId.REDEEM]: 'redeemScreen',
  [RouteId.PROFILE]: 'profileAndVisibilitySettingsScreen',
  [RouteId.SEARCH]: 'searchRoute', // searchScreen', searchResultsScreen
  [RouteId.OPEN_SOURCE_ATTRIBUTIONS]: 'openSourceAttributionsScreen',
  [RouteId.SELECT_ORG_TO_UPGRADE]: 'selectWorkspaceToUpgradeScreen',
  [RouteId.SELECT_TEAM_TO_UPGRADE]: 'selectWorkspaceToUpgradeScreen',
  [RouteId.SHORTCUTS]: 'shortcutsScreen',
  [RouteId.SHORTCUTS_OVERLAY]: 'shortcutsScreen',
  [RouteId.TEMPLATES]: 'templateGalleryScreen',
  [RouteId.TEMPLATES_RECOMMEND]: 'templateStoryPageScreen',
  [RouteId.TO]: 'toSearchRoute',
  [RouteId.USER_OR_ORG]: 'userOrOrgRoute',
  [RouteId.WORKSPACE_VIEW]: 'workspaceViewScreen',
  [RouteId.WORKSPACE_DEFAULT_CUSTOM_TABLE_VIEW]:
    'workspaceDefaultCustomTableViewScreen',
  [RouteId.OLD_WORKSPACE_DEFAULT_CUSTOM_TABLE_VIEW]:
    'workspaceDefaultCustomTableViewScreen',
  [RouteId.WORKSPACE_DEFAULT_CUSTOM_CALENDAR_VIEW]:
    'workspaceDefaultCustomCalendarViewScreen',
  [RouteId.OLD_WORKSPACE_DEFAULT_CUSTOM_CALENDAR_VIEW]:
    'workspaceDefaultCustomCalendarViewScreen',
  [RouteId.MEMBER_ACCOUNT]: 'memberAccountScreen',
  [RouteId.MEMBER_AI_SETTINGS]: 'memberAiSettingsScreen',
};

interface GetScreenFromUrlArgs {
  orgName?: string;
  pathname?: string;
}

/**
 * Returns the GAS SourceType mapped to the URL pathname. Use in GAS
 * analytics events when `source` is dynamic or unknown.
 *
 * @param {string} [orgName=] (optional) Use orgName to match workspaceBoardsScreen instead of generic userOrOrgRoute
 * @param {string} [pathname=getLocation().pathname] (optional) Default is routerState's location.pathname.
 * @example
 * // sends GAS track event with dynamic source based on current URL
 * Analytics.sendTrackEvent({
 *    action: 'created',
 *    actionSubject: 'card',
 *    source: getScreenFromUrl()
 * })
 * @example
 * // returns 'boardScreen'
 * getScreenFromUrl('/b/GuE7gK2m');
 * @example
 * // returns 'workspaceBoardsScreen'
 * getScreenFromUrl({
 *    orgName: 'trelloinc',
 *    url: '/trelloinc',
 * });
 * @example
 * // returns 'userOrOrgRoute'
 * getScreenFromUrl({ url: '/trelloinc' });
 *
 */
export const getScreenFromUrl = ({
  orgName = '',
  pathname = getLocation().pathname,
}: GetScreenFromUrlArgs = {}): SourceType => {
  let routeId: RouteIdType;
  try {
    routeId = getRouteIdFromPathname(pathname);
  } catch (err) {
    // If no route id match, return 'unknownScreen'
    return 'unknownScreen';
  }

  const screen = routeScreens[routeId];
  const firstPathSegment = pathname.split('/')[1];
  if (orgName && firstPathSegment === orgName && screen === 'userOrOrgRoute') {
    // If the route matches userOrOrgRoute', check against provided org info
    // to see whether it's definitively an org route
    return 'workspaceBoardsScreen';
  }
  return screen;
};
