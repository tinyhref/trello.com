// If you are adding a new route, include the route to GAS screen mapping in
// `routeScreens` in packages/atlassian-analytics/src/getScreenFromUrl.ts
// and include the route to workspace getter mapping in
// `routeMap` in packages/workspaces/src/useWorkspaceStateUpdater.ts

import {
  dangerouslyConvertPrivacyString,
  type PIIString,
} from '@trello/privacy';

import { createRouteDefinition } from './createRouteDefinition';
import { RouteId, type RouteIdType } from './RouteId';

const account = createRouteDefinition<{ name: string }>({
  id: RouteId.ACCOUNT,
  backbonePattern: 'w/:name/account',
  regExp: new RegExp('^w/([^/]+)/account$'),
  routeParamsToPathname: ({ name }) => `/w/${name}/account`,
});
/**
 * @deprecated
 */
const oldAccount = createRouteDefinition<{ name: string }>({
  id: RouteId.OLD_ACCOUNT,
  backbonePattern: ':name/account(#*locationHash)',
  regExp: new RegExp('^([^/]+)/account((#(.*))?)$'),
  /**
   * @deprecated
   */
  routeParamsToPathname: ({ name }) => `/${name}/account`,
});
const workspaceBilling = createRouteDefinition<{ name: string }>({
  id: RouteId.WORKSPACE_BILLING,
  backbonePattern: 'w/:name/billing(?*query)',
  regExp: new RegExp('^w/([^/]+)/billing(?:\\?(.*?))?$'),
  routeParamsToPathname: ({ name }) => `/w/${name}/billing`,
});
const billing = createRouteDefinition<{ name: string }>({
  id: RouteId.BILLING,
  backbonePattern: ':name/billing(?*query)',
  regExp: new RegExp('^([^/]+)/billing(?:\\?(.*?))?$'),
  routeParamsToPathname: ({ name }) => `/${name}/billing`,
});
const blank = createRouteDefinition({
  id: RouteId.BLANK,
  backbonePattern: 'blank',
  modernizationFeatureGate: 'tplat_migrate_route_blank',
  reactPattern: 'blank',
  regExp: new RegExp('^blank$'),
  routeParamsToPathname: () => `/blank`,
});

export interface BoardViewParams {
  shortLink: string;
  shortName: string;
  view: 'board';
}
export interface BoardCalendarViewParams {
  shortLink: string;
  shortName: string;
  view: 'calendar-view';
  day?: string;
  month?: string;
  year?: string;
}
export interface BoardCalendarPupViewParams {
  shortLink: string;
  shortName: string;
  view: 'calendar';
  day?: string;
  month?: string;
  year?: string;
}
export interface BoardDashboardViewParams {
  shortLink: string;
  shortName: string;
  view: 'dashboard';
}
export interface BoardMapViewParams {
  shortLink: string;
  shortName: string;
  view: 'map';
  lat?: number | string;
  lon?: number | string;
  zoom?: string;
}
export interface BoardPowerUpViewParams {
  shortLink: string;
  shortName: string;
  view: 'power-up';
  powerUpId: string;
}

type BoardPowerUpsSection =
  | 'category'
  | 'custom'
  | 'enabled'
  | 'made-by-trello'
  | 'search';

export interface BoardPowerUpsViewParams {
  shortLink: string;
  shortName: string;
  view: 'power-ups';
  category?:
    | 'analytics-reporting'
    | 'automation'
    | 'board-utilities'
    | 'communication-collaboration'
    | 'developer-tools'
    | 'file-management'
    | 'hr-operations'
    | 'it-project-management'
    | 'marketing-social-media'
    | 'product-design'
    | 'sales-support';
  section?: BoardPowerUpsSection;
}
export interface BoardTableViewParams {
  shortLink: string;
  shortName: string;
  view: 'table';
}
export interface BoardTimelineViewParams {
  shortLink: string;
  shortName: string;
  view: 'timeline';
}
type ButlerScreen = 'account' | 'edit' | 'log' | 'reports' | 'usage';
type ButlerTab =
  | 'board-buttons'
  | 'card-buttons'
  | 'connected-apps'
  | 'on-dates'
  | 'rules'
  | 'schedule'
  | 'suggestions';
export interface BoardButlerViewParams {
  shortLink: string;
  shortName: string;
  view: 'butler';
  tab?: ButlerTab;
  screen?: ButlerScreen;
  paramOrCommand?: string;
}
export interface BoardMemberActivityParams {
  shortLink: string;
  shortName: string;
  view: 'member';
  username: string;
}

export type BoardViews =
  | BoardButlerViewParams
  | BoardCalendarPupViewParams
  | BoardCalendarViewParams
  | BoardDashboardViewParams
  | BoardMapViewParams
  | BoardMemberActivityParams
  | BoardPowerUpsViewParams
  | BoardPowerUpViewParams
  | BoardTableViewParams
  | BoardTimelineViewParams
  | BoardViewParams;

const board = createRouteDefinition<
  { shortLink: string; path?: string },
  BoardViews
>({
  id: RouteId.BOARD,
  backbonePattern: 'b/:shortLink(/*path)',
  regExp: new RegExp('^b/([^/]+)(?:/(.*?))?$'),
  routeParamsToPathname: (params) => {
    let baseUrl: string;
    const { view, shortLink, shortName } = params;

    if (view === 'board' || !view) {
      baseUrl = `/b/${shortLink}/${shortName}`;
    } else {
      baseUrl = `/b/${shortLink}/${shortName}/${view}`;
    }

    if (view === 'map') {
      const { lat, lon, zoom } = params;
      baseUrl += `/${lat}/${lon}/${zoom}`;
    } else if (view === 'power-up') {
      const { powerUpId } = params;
      baseUrl += `/${powerUpId}`;
    } else if (view === 'power-ups') {
      const { category, section } = params;
      if (category) {
        baseUrl += `/category/${category}`;
      } else if (section) {
        baseUrl += `/${section}`;
      }
    } else if (view === 'butler') {
      const { tab, screen, paramOrCommand } = params;
      if (tab) {
        baseUrl += `/${tab}`;
      }

      if (screen) {
        baseUrl += `/${screen}`;

        if (
          (screen === 'edit' || screen === 'log' || screen === 'reports') &&
          paramOrCommand
        ) {
          baseUrl += `/${paramOrCommand}`;
        }
      }
    } else if (view === 'member') {
      const { username } = params;

      baseUrl += `/${username}`;
    } else if (view === 'calendar') {
      const { year, month, day } = params;
      if (year) {
        baseUrl += `/${year}`;
      }
      if (month) {
        baseUrl += `/${month}`;
      }
      if (day) {
        baseUrl += `/${day}`;
      }
    } else if (view === 'calendar-view') {
      const { year, month, day } = params;
      if (year) {
        baseUrl += `/${year}`;
      }
      if (month) {
        baseUrl += `/${month}`;
      }
      if (day) {
        baseUrl += `/${day}`;
      }
    }

    return baseUrl;
  },
  parseRouteParams: ({ shortLink, path }) => {
    const parameters = path?.split('/') ?? [];
    const [shortName, view, ...rest] = parameters;
    switch (view) {
      case 'table':
        return { shortLink, shortName, view: 'table' };
      case 'calendar-view':
        return {
          shortLink,
          shortName,
          view: 'calendar-view',
          year: rest[0],
          month: rest[1],
          day: rest[2],
        };
      case 'timeline':
        return { shortLink, shortName, view: 'timeline' };
      case 'dashboard':
        return { shortLink, shortName, view: 'dashboard' };
      case 'map':
        return {
          shortLink,
          shortName,
          view: 'map',
          lat: rest[0],
          lon: rest[1],
          zoom: rest[2],
        };
      case 'calendar':
        return {
          shortLink,
          shortName,
          view: 'calendar',
          year: rest[0],
          month: rest[1],
          day: rest[2],
        };
      case 'power-up':
        return { shortLink, shortName, view: 'power-up', powerUpId: rest[0] };
      case 'power-ups':
        if (rest[0] === 'category') {
          return {
            shortLink,
            shortName,
            view: 'power-ups',
            category: rest[1] as
              | 'analytics-reporting'
              | 'automation'
              | 'board-utilities'
              | 'communication-collaboration'
              | 'developer-tools'
              | 'file-management'
              | 'hr-operations'
              | 'it-project-management'
              | 'marketing-social-media'
              | 'product-design'
              | 'sales-support',
          };
        } else {
          return {
            shortLink,
            shortName,
            view: 'power-ups',
            section: rest[0] as BoardPowerUpsSection,
          };
        }
      case 'butler': {
        const params: BoardButlerViewParams = {
          shortLink,
          shortName,
          view: 'butler',
        };

        if (['edit, log', 'reports'].includes(rest[0])) {
          // :slug/butler/reports/:reportType
          // :slug/butler/edit/:butlerCmd
          // :slug/butler/log/:butlerCmd
          params.screen = rest[0] as ButlerScreen;
          params.paramOrCommand = rest[1];
        } else {
          params.tab = rest[0] as ButlerTab;
          if (rest[1] === 'new') {
            // :slug/butler/:butlerTab/new
            params.paramOrCommand = rest[1];
          } else {
            // :slug/butler/:butlerTab
            // :slug/butler/:butlerTab/edit/:butlerCmd
            // :slug/butler/:butlerTab/log/:butlerCmd
            // :slug/butler/:butlerTab/usage
            // :slug/butler/:butlerTab/account
            params.screen = rest[1] as ButlerScreen;
            params.paramOrCommand = rest[2];
          }
        }

        return params;
      }
      case 'member': {
        const params: BoardMemberActivityParams = {
          shortLink,
          shortName,
          view: 'member',
          username: rest[0],
        };

        return params;
      }
      default:
        return { shortLink, shortName, view: 'board' };
    }
  },
});

/**
 * @deprecated
 */
const boardOld = createRouteDefinition<{ path: string }>({
  id: RouteId.BOARD_OLD,
  backbonePattern: 'board/*path',
  regExp: new RegExp('^board/(.*?)$'),
  routeParamsToPathname: ({ path }) => `/board/${path}`,
});
const boardReferral = createRouteDefinition<{
  shortLink: string;
  name: string;
  referrerUsername: string;
}>({
  id: RouteId.BOARD_REFERRAL,
  backbonePattern: 'b/:shortLink/:name/:referrerUsername/recommend',
  regExp: new RegExp('^b/([^/]+)/([^/]+)/([^/]+)/recommend$'),
  routeParamsToPathname: ({ shortLink, name, referrerUsername }) =>
    `/b/${shortLink}/${name}/${referrerUsername}/recommend`,
});
const card = createRouteDefinition<{ shortLink: string; path: string }>({
  id: RouteId.CARD,
  backbonePattern: 'c/:shortLink(/*path)',
  regExp: new RegExp('^c/([^/]+)(?:/(.*?))?$'),
  routeParamsToPathname: ({ shortLink, path }) => `/c/${shortLink}/${path}`,
});
/**
 * @deprecated
 */
const cardOld = createRouteDefinition<{
  slug: string;
  idBoard: string;
  cardComponent: string;
}>({
  id: RouteId.CARD_OLD,
  backbonePattern: 'card/(:slug/):idBoard/:cardComponent',
  regExp: new RegExp('^card/(?:([^/]+)/)?([^/]+)/([^/]+)$'),
  /**
   * @deprecated
   */
  routeParamsToPathname: ({ slug, idBoard, cardComponent }) =>
    `/card/${slug}/${idBoard}/${cardComponent}`,
});
/**
 * @deprecated
 */
const cardAndBoardOld = createRouteDefinition<{
  slug: string;
  idBoard: string;
  cardComponent: string;
}>({
  id: RouteId.CARD_AND_BOARD_OLD,
  backbonePattern: 'card/board/(:slug/):idBoard/:cardComponent',
  regExp: new RegExp('^card/board/(?:([^/]+)/)?([^/]+)/([^/]+)$'),
  /**
   * @deprecated
   */
  routeParamsToPathname: ({ slug, idBoard, cardComponent }) =>
    `/card/board/${slug}/${idBoard}/${cardComponent}`,
});
const createFirstBoard = createRouteDefinition<null>({
  id: RouteId.CREATE_FIRST_BOARD,
  backbonePattern: 'create-first-board(?*querystring)',
  regExp: new RegExp('^create-first-board(?:\\?(.*?))?$'),
  routeParamsToPathname: () => `/create-first-board`,
});
const welcomeToTrello = createRouteDefinition<null>({
  id: RouteId.WELCOME_TO_TRELLO,
  backbonePattern: 'welcome-to-trello(?*querystring)',
  regExp: new RegExp('^welcome-to-trello(?:\\?(.*?))?$'),
  routeParamsToPathname: () => `/welcome-to-trello`,
});
const doubleSlash = createRouteDefinition<{ search: string }>({
  id: RouteId.DOUBLE_SLASH,
  backbonePattern: '/*search',
  regExp: new RegExp('^/(.*?)$'),
  routeParamsToPathname: ({ search }) => `/${search}`,
});
const enterpriseAdmin = createRouteDefinition<{ name: string }>({
  id: RouteId.ENTERPRISE_ADMIN,
  backbonePattern: 'e/:name/admin',
  modernizationFeatureGate: 'tplat_migrate_route_enterprise_admin',
  reactPattern: 'e/:name/admin/*',
  regExp: new RegExp('^e/([^/]+)/admin$'),
  routeParamsToPathname: ({ name }) => `/e/${name}/admin`,
});
const enterpriseAdminTab = createRouteDefinition<{ name: string; tab: string }>(
  {
    id: RouteId.ENTERPRISE_ADMIN_TAB,
    backbonePattern: 'e/:name/admin/*tab',
    modernizationFeatureGate: 'tplat_migrate_route_enterprise_admin',
    reactPattern: 'e/:name/admin/*',
    regExp: new RegExp('^e/([^/]+)/admin/(.*?)$'),
    routeParamsToPathname: ({ name, tab }) => `/e/${name}/admin/${tab}`,
  },
);
const errorPage = createRouteDefinition<null>({
  id: RouteId.ERROR_PAGE,
  backbonePattern: '*splat',
  regExp: new RegExp('^(.*?)$'),
  routeParamsToPathname: () => '',
});
const go = createRouteDefinition<{ search: string }>({
  id: RouteId.GO,
  backbonePattern: 'go/*search',
  regExp: new RegExp('^go/(.*?)$'),
  routeParamsToPathname: ({ search }) => `/go/${search}`,
});
const getApp = createRouteDefinition<null>({
  id: RouteId.GET_APP,
  backbonePattern: 'get-app',
  regExp: new RegExp('^get-app$'),
  routeParamsToPathname: () => '/get-app',
});
const inviteAcceptBoard = createRouteDefinition<null>({
  id: RouteId.INVITE_ACCEPT_BOARD,
  backbonePattern: 'invite/accept-board',
  regExp: new RegExp('^invite/accept-board$'),
  routeParamsToPathname: () => '/invite/accept-board',
});
const inviteAcceptTeam = createRouteDefinition<null>({
  id: RouteId.INVITE_ACCEPT_TEAM,
  backbonePattern: 'invite/accept-team',
  regExp: new RegExp('^invite/accept-team$'),
  routeParamsToPathname: () => '/invite/accept-team',
});
/**
 * @deprecated
 */
const oldMemberActivity = createRouteDefinition<{ username: PIIString }>({
  id: RouteId.OLD_MEMBER_ACTIVITY,
  backbonePattern: ':username/activity',
  regExp: new RegExp('^([^/]+)/activity$'),
  /**
   * @deprecated
   */
  routeParamsToPathname: ({ username }) =>
    `/${dangerouslyConvertPrivacyString(username)}/activity`,
});
const memberActivity = createRouteDefinition<{ username: PIIString }>({
  id: RouteId.MEMBER_ACTIVITY,
  backbonePattern: 'u/:username/activity',
  regExp: new RegExp('^u/([^/]+)/activity$'),
  routeParamsToPathname: ({ username }) =>
    `/u/${dangerouslyConvertPrivacyString(username)}/activity`,
});
const memberAllBoards = createRouteDefinition<{ username: PIIString }>({
  id: RouteId.MEMBER_ALL_BOARDS,
  backbonePattern: 'u/:username/boards',
  regExp: new RegExp('^u/([^/]+)/boards$'),
  routeParamsToPathname: ({ username }) =>
    `/u/${dangerouslyConvertPrivacyString(username)}/boards`,
});
/**
 * @deprecated
 */
const oldMemberAllBoards = createRouteDefinition<{ username: PIIString }>({
  id: RouteId.OLD_MEMBER_ALL_BOARDS,
  backbonePattern: ':username/boards',
  regExp: new RegExp('^([^/]+)/boards$'),
  /**
   * @deprecated
   */
  routeParamsToPathname: ({ username }) =>
    `/${dangerouslyConvertPrivacyString(username)}/boards`,
});
/**
 * @deprecated
 */
const oldMemberCards = createRouteDefinition<{ username: PIIString }>({
  id: RouteId.OLD_MEMBER_CARDS,
  backbonePattern: ':username/cards',
  regExp: new RegExp('^([^/]+)/cards$'),
  /**
   * @deprecated
   */
  routeParamsToPathname: ({ username }) =>
    `/${dangerouslyConvertPrivacyString(username)}/cards`,
});
const memberCards = createRouteDefinition<{ username: PIIString }>({
  id: RouteId.MEMBER_CARDS,
  backbonePattern: 'u/:username/cards',
  regExp: new RegExp('^u/([^/]+)/cards$'),
  routeParamsToPathname: ({ username }) =>
    `/u/${dangerouslyConvertPrivacyString(username)}/cards`,
});
/**
 * @deprecated
 */
const oldMemberCardsForOrg = createRouteDefinition<{
  username: PIIString;
  orgname: string;
}>({
  id: RouteId.OLD_MEMBER_CARDS_FOR_ORG,
  backbonePattern: ':username/cards/:orgname',
  regExp: new RegExp('^([^/]+)/cards/([^/]+)$'),
  /**
   * @deprecated
   */
  routeParamsToPathname: ({ username, orgname }) =>
    `/${dangerouslyConvertPrivacyString(username)}/cards/${orgname}`,
});
const memberCardsForOrg = createRouteDefinition<{
  username: PIIString;
  orgname: string;
}>({
  id: RouteId.MEMBER_CARDS_FOR_ORG,
  backbonePattern: 'u/:username/cards/:orgname',
  regExp: new RegExp('^u/([^/]+)/cards/([^/]+)$'),
  routeParamsToPathname: ({ username, orgname }) =>
    `/u/${dangerouslyConvertPrivacyString(username)}/cards/${orgname}`,
});
const memberAccount = createRouteDefinition<{ username: PIIString }>({
  modernizationFeatureGate: 'tplat_migrate_route_account_settings',
  id: RouteId.MEMBER_ACCOUNT,
  backbonePattern: 'u/:username/account',
  reactPattern: 'u/:username/account',
  regExp: new RegExp('^u/([^/]+)/account$'),
  routeParamsToPathname: ({ username }) =>
    `/u/${dangerouslyConvertPrivacyString(username)}/account`,
});
const memberAiSettings = createRouteDefinition<{ username: PIIString }>({
  id: RouteId.MEMBER_AI_SETTINGS,
  pattern: 'u/:username/ai-settings',
  regExp: new RegExp('^u/([^/]+)/ai-settings$'),
  routeParamsToPathname: ({ username }) =>
    `/u/${dangerouslyConvertPrivacyString(username)}/ai-settings`,
});
const memberHome = createRouteDefinition<null>({
  id: RouteId.MEMBER_HOME,
  backbonePattern: '',
  regExp: new RegExp('^$'),
  routeParamsToPathname: () => '',
});
const memberHomeBoards = createRouteDefinition<{ orgname: string }>({
  id: RouteId.MEMBER_HOME_WORKSPACE_BOARDS,
  backbonePattern: 'w/:orgname/home',
  regExp: new RegExp('^w/([^/]+)/home$'),
  routeParamsToPathname: ({ orgname }) => `/w/${orgname}/home`,
});
/**
 * @deprecated
 */
const oldMemberHomeBoards = createRouteDefinition<{ orgname: string }>({
  id: RouteId.OLD_MEMBER_HOME_WORKSPACE_BOARDS,
  backbonePattern: ':orgname/home',
  regExp: new RegExp('^([^/]+)/home$'),
  /**
   * @deprecated
   */
  routeParamsToPathname: ({ orgname }) => `/${orgname}/home`,
});
const memberProfile = createRouteDefinition<{
  username: PIIString;
  section: string;
  subsection: string;
}>({
  id: RouteId.MEMBER_PROFILE_SECTION,
  backbonePattern: 'u/:username(/:section)(/:subsection)(/)(#*locationHash)',
  regExp: new RegExp('^u/([^/]+)(?:/([^/]+)){0,2}(?:/)?$'),
  routeParamsToPathname: ({ username, section, subsection }) =>
    `/u/${dangerouslyConvertPrivacyString(username)}/${section}/${subsection}`,
});
const memberTasks = createRouteDefinition<{ username: PIIString }>({
  id: RouteId.MEMBER_TASKS,
  backbonePattern: ':username/tasks',
  regExp: new RegExp('^([^/]+)/tasks$'),
  routeParamsToPathname: ({ username }) =>
    `/${dangerouslyConvertPrivacyString(username)}/tasks`,
});
const memberLabs = createRouteDefinition<{ username: PIIString }>({
  id: RouteId.MEMBER_LABS,
  backbonePattern: 'u/:username/labs',
  regExp: new RegExp('^u/([^/]+)/labs$'),
  routeParamsToPathname: ({ username }) =>
    `/u/${dangerouslyConvertPrivacyString(username)}/labs`,
});
/**
 * @deprecated
 */
const oldMemberLabs = createRouteDefinition<{ username: PIIString }>({
  id: RouteId.OLD_MEMBER_LABS,
  backbonePattern: ':username/labs',
  regExp: new RegExp('^([^/]+)/labs$'),
  /**
   * @deprecated
   */
  routeParamsToPathname: ({ username }) =>
    `/${dangerouslyConvertPrivacyString(username)}/labs`,
});
/**
 * @deprecated
 */
const oldOrganizationGuests = createRouteDefinition<{ name: string }>({
  id: RouteId.OLD_ORGANIZATION_GUESTS,
  backbonePattern: ':name/members/guests',
  regExp: new RegExp('^([^/]+)/members/guests$'),
  /**
   * @deprecated
   */
  routeParamsToPathname: ({ name }) => `/${name}/members/guests`,
});
/**
 * @deprecated
 */
const oldOrganizationMembers = createRouteDefinition<{ name: string }>({
  id: RouteId.OLD_ORGANIZATION_MEMBERS,
  backbonePattern: ':name/members',
  regExp: new RegExp('^([^/]+)/members$'),
  /**
   * @deprecated
   */
  routeParamsToPathname: ({ name }) => `/${name}/members`,
});
/**
 * @deprecated
 */
const oldOrganizationRequests = createRouteDefinition<{ name: string }>({
  id: RouteId.OLD_ORGANIZATION_REQUESTS,
  backbonePattern: ':name/members/requests',
  regExp: new RegExp('^([^/]+)/members/requests$'),
  /**
   * @deprecated
   */
  routeParamsToPathname: ({ name }) => `/${name}/members/requests`,
});
const organizationById = createRouteDefinition<{ id: string }>({
  id: RouteId.ORGANIZATION_BY_ID,
  backbonePattern: 'org/:id',
  regExp: new RegExp('^org/([^/]+)$'),
  routeParamsToPathname: ({ id }) => `/org/${id}`,
});
const organizationExport = createRouteDefinition<{ name: string }>({
  id: RouteId.ORGANIZATION_EXPORT,
  backbonePattern: 'w/:name/export',
  regExp: new RegExp('^w/([^/]+)/export$'),
  routeParamsToPathname: ({ name }) => `/w/${name}/export`,
});
/**
 * @deprecated
 */
const oldOrganizationExport = createRouteDefinition<{ name: string }>({
  id: RouteId.OLD_ORGANIZATION_EXPORT,
  backbonePattern: ':name/export',
  regExp: new RegExp('^([^/]+)/export$'),
  /**
   * @deprecated
   */
  routeParamsToPathname: ({ name }) => `/${name}/export`,
});
const organizationFreeTrial = createRouteDefinition<{ orgname: string }>({
  id: RouteId.ORGANIZATION_FREE_TRIAL,
  backbonePattern: 'w/:orgname/free-trial',
  regExp: new RegExp('^w/([^/]+)/free-trial$'),
  routeParamsToPathname: ({ orgname }) => `/w/${orgname}/free-trial`,
});
/**
 * @deprecated
 */
const oldOrganizationFreeTrial = createRouteDefinition<{ orgname: string }>({
  id: RouteId.OLD_ORGANIZATION_FREE_TRIAL,
  backbonePattern: ':orgname/free-trial',
  regExp: new RegExp('^([^/]+)/free-trial$'),
  /**
   * @deprecated
   */
  routeParamsToPathname: ({ orgname }) => `/${orgname}/free-trial`,
});
const organizationGuests = createRouteDefinition<{ name: string }>({
  id: RouteId.ORGANIZATION_GUESTS,
  backbonePattern: 'w/:name/members/guests',
  regExp: new RegExp('^w/([^/]+)/members/guests$'),
  routeParamsToPathname: ({ name }) => `/w/${name}/members/guests`,
});
const organizationRequests = createRouteDefinition<{ name: string }>({
  id: RouteId.ORGANIZATION_REQUESTS,
  backbonePattern: 'w/:name/members/requests',
  regExp: new RegExp('^w/([^/]+)/members/requests$'),
  routeParamsToPathname: ({ name }) => `/w/${name}/members/requests`,
});
const organizationMemberCards = createRouteDefinition<{
  name: string;
  username: PIIString;
}>({
  id: RouteId.ORGANIZATION_MEMBER_CARDS,
  backbonePattern: ':name/:username/cards',
  regExp: new RegExp('^([^/]+)/([^/]+)/cards$'),
  routeParamsToPathname: ({ name, username }) =>
    `/${name}/${dangerouslyConvertPrivacyString(username)}/cards`,
});
const organizationMembers = createRouteDefinition<{ name: string }>({
  id: RouteId.ORGANIZATION_MEMBERS,
  backbonePattern: 'w/:name/members',
  regExp: new RegExp('^w/([^/]+)/members$'),
  routeParamsToPathname: ({ name }) => `/w/${name}/members`,
});
const organizationPowerUps = createRouteDefinition<{ name: string }>({
  id: RouteId.ORGANIZATION_POWER_UPS,
  backbonePattern: 'w/:name/power-ups',
  regExp: new RegExp('^w/([^/]+)/power-ups$'),
  routeParamsToPathname: ({ name }) => `/w/${name}/power-ups`,
});
/**
 * @deprecated
 */
const oldOrganizationPowerUps = createRouteDefinition<{ name: string }>({
  id: RouteId.OLD_ORGANIZATION_POWER_UPS,
  backbonePattern: ':name/power-ups',
  regExp: new RegExp('^([^/]+)/power-ups$'),
  /**
   * @deprecated
   */
  routeParamsToPathname: ({ name }) => `/${name}/power-ups`,
});
const organizationTables = createRouteDefinition<{ name: string }>({
  id: RouteId.ORGANIZATION_TABLES,
  backbonePattern: 'w/:name/tables(?*query)',
  regExp: new RegExp('^w/([^/]+)/tables(?:\\?(.*?))?$'),
  routeParamsToPathname: ({ name }) => `/w/${name}/tables`,
});
/**
 * @deprecated
 */
const oldOrganizationTables = createRouteDefinition<{ name: string }>({
  id: RouteId.OLD_ORGANIZATION_TABLES,
  backbonePattern: ':name/tables(?*query)',
  regExp: new RegExp('^([^/]+)/tables(?:\\?(.*?))?$'),
  /**
   * @deprecated
   */
  routeParamsToPathname: ({ name }) => `/${name}/tables`,
});
const powerUpAdmin = createRouteDefinition<{ section: string }>({
  id: RouteId.POWER_UP_ADMIN,
  backbonePattern: 'power-ups/admin(/:section)(/)',
  regExp: new RegExp('^power-ups/admin(?:/([^/]+))?(?:/)?$'),
  routeParamsToPathname: ({ section }) => `/power-ups/admin/${section}`,
});
const appsAdmin = createRouteDefinition<{ section: string }>({
  id: RouteId.APPS_ADMIN,
  backbonePattern: 'apps/admin(/:section)(/)',
  regExp: new RegExp('^apps/admin(?:/([^/]+))?(?:/)?$'),
  routeParamsToPathname: ({ section }) => `/apps/admin/${section}`,
});
const powerUpEdit = createRouteDefinition<{
  idPlugin: string;
  subsection: string;
}>({
  id: RouteId.POWER_UP_EDIT,
  backbonePattern: 'power-ups/:idPlugin/edit(/:subsection)(/)',
  regExp: new RegExp('^power-ups/([^/]+)/edit(?:/([^/]+))?(?:/)?$'),
  routeParamsToPathname: ({ idPlugin, subsection }) =>
    `/power-ups/${idPlugin}/edit/${subsection}`,
});
const appsAdminEdit = createRouteDefinition<{
  idPlugin: string;
  subsection: string;
}>({
  id: RouteId.APPS_ADMIN_EDIT,
  backbonePattern: 'apps/:idPlugin/edit(/:subsection)(/)',
  regExp: new RegExp('^apps/([^/]+)/edit(?:/([^/]+))?(?:/)?$'),
  routeParamsToPathname: ({ idPlugin, subsection }) =>
    `/apps/${idPlugin}/edit/${subsection}`,
});
const powerUpPublicDirectory = createRouteDefinition<{
  section: string;
  subsection: string;
}>({
  id: RouteId.POWER_UP_PUBLIC_DIRECTORY,
  backbonePattern: 'power-ups(/:section)(/:subsection)(/)',
  regExp: new RegExp('^power-ups(?:/([^/]+))?(?:/([^/]+))?(?:/)?$'),
  routeParamsToPathname: ({ section, subsection }) =>
    `/power-ups/${section}/${subsection}`,
});
const profile = createRouteDefinition<{ name: PIIString }>({
  id: RouteId.PROFILE,
  backbonePattern: ':name/profile',
  regExp: new RegExp('^([^/]+)/profile$'),
  routeParamsToPathname: ({ name }) =>
    `/${dangerouslyConvertPrivacyString(name)}/profile`,
});
const redeem = createRouteDefinition<null>({
  id: RouteId.REDEEM,
  backbonePattern: 'redeem(?*code)',
  regExp: new RegExp('^redeem(?:\\?(.*?))?$'),
  routeParamsToPathname: () => `/redeem`,
});
const search = createRouteDefinition<null>({
  id: RouteId.SEARCH,
  backbonePattern: 'search(?*query)',
  regExp: new RegExp('^search(?:\\?(.*?))?$'),
  routeParamsToPathname: () => '/search',
});
const openSourceAttributionsPage = createRouteDefinition<null>({
  id: RouteId.OPEN_SOURCE_ATTRIBUTIONS,
  modernizationFeatureGate: 'tplat_migrate_route_oss_attributions',
  reactPattern: 'attributions',
  backbonePattern: 'attributions',
  regExp: new RegExp('^attributions$'),
  routeParamsToPathname: () => '/attributions',
});
const selectOrgToUpgrade = createRouteDefinition<null>({
  id: RouteId.SELECT_ORG_TO_UPGRADE,
  backbonePattern: 'select-org-to-upgrade',
  regExp: new RegExp('^select-org-to-upgrade$'),
  routeParamsToPathname: () => '/select-org-to-upgrade',
});
const selectTeamToUpgrade = createRouteDefinition<null>({
  id: RouteId.SELECT_TEAM_TO_UPGRADE,
  backbonePattern: 'select-team-to-upgrade',
  regExp: new RegExp('^select-team-to-upgrade$'),
  routeParamsToPathname: () => '/select-team-to-upgrade',
});
const shortcuts = createRouteDefinition<null>({
  id: RouteId.SHORTCUTS,
  backbonePattern: 'shortcuts',
  regExp: new RegExp('^shortcuts$'),
  routeParamsToPathname: () => '/shortcuts',
});
const shortcutsOverlay = createRouteDefinition<null>({
  id: RouteId.SHORTCUTS_OVERLAY,
  backbonePattern: 'shortcuts/overlay',
  regExp: new RegExp('^shortcuts/overlay$'),
  routeParamsToPathname: () => '/shortcuts/overlay',
});
const templates = createRouteDefinition<{
  category: string;
  templateSlug: string;
}>({
  id: RouteId.TEMPLATES,
  backbonePattern: 'templates(/:category)(/:templateSlug)(/)',
  regExp: new RegExp('^templates(?:/([^/]+))?(?:/([^/]+))?(?:/)?$'),
  routeParamsToPathname: ({ category, templateSlug }) =>
    `/templates/${category}/${templateSlug}`,
});
const templatesRecommend = createRouteDefinition<{
  category: string;
  templateSlug: string;
  referrerUsername: string;
}>({
  id: RouteId.TEMPLATES_RECOMMEND,
  backbonePattern:
    'templates(/:category)(/:templateSlug)(/:referrerUsername)/recommend(/)',
  regExp: new RegExp(
    '^templates(?:/([^/]+))?(?:/([^/]+))?(?:/([^/]+))?/recommend(?:/)?$',
  ),
  routeParamsToPathname: ({ category, templateSlug, referrerUsername }) =>
    `/templates/${category}/${templateSlug}/${referrerUsername}/recommend`,
});
const to = createRouteDefinition<{ search: string }>({
  id: RouteId.TO,
  backbonePattern: 'to/*search',
  regExp: new RegExp('^to/(.*?)$'),
  routeParamsToPathname: (params) => `/to/${params.search}`,
});
const userOrOrg = createRouteDefinition<{ name: string }>({
  id: RouteId.USER_OR_ORG,
  backbonePattern: ':name(/)',
  regExp: new RegExp('^([^/]+)(?:/)?$'),
  routeParamsToPathname: ({ name }) => `/${name}`,
});
const organizationBoards = createRouteDefinition<{ orgname: string }>({
  id: RouteId.ORGANIZATION_BOARDS,
  backbonePattern: 'w/:orgname(/)',
  regExp: new RegExp('^w/([^/]+)(?:/)?$'),
  routeParamsToPathname: ({ orgname }) => `/w/${orgname}`,
});
const workspaceDefaultCustomTableView = createRouteDefinition<{
  orgname: string;
}>({
  id: RouteId.WORKSPACE_DEFAULT_CUSTOM_TABLE_VIEW,
  backbonePattern: 'w/:orgname/views/table(?*query)',
  regExp: new RegExp('^w/([^/]+)/views/table(?:\\?(.*?))?$'),
  routeParamsToPathname: ({ orgname }) => `/w/${orgname}/views/table`,
});
/**
 * @deprecated
 */
const oldWorkspaceDefaultCustomTableView = createRouteDefinition<{
  orgname: string;
}>({
  id: RouteId.OLD_WORKSPACE_DEFAULT_CUSTOM_TABLE_VIEW,
  backbonePattern: ':orgname/views/table(?*query)',
  regExp: new RegExp('^([^/]+)/views/table(?:\\?(.*?))?$'),
  /**
   * @deprecated
   */
  routeParamsToPathname: ({ orgname }) => `/${orgname}/views/table`,
});
const workspaceView = createRouteDefinition<{ shortLink: string }>({
  id: RouteId.WORKSPACE_VIEW,
  backbonePattern: 'v/:shortLink(/*path)',
  regExp: new RegExp('^v/([^/]+)(?:/(.*?))?$'),
  routeParamsToPathname: ({ shortLink }) => `/v/${shortLink}`,
});
const workspaceDefaultCustomCalendarView = createRouteDefinition<{
  orgname: string;
}>({
  id: RouteId.WORKSPACE_DEFAULT_CUSTOM_CALENDAR_VIEW,
  backbonePattern: 'w/:orgname/views/calendar(?*query)',
  regExp: new RegExp('^w/([^/]+)/views/calendar(?:\\?(.*?))?$'),
  routeParamsToPathname: ({ orgname }) => `/w/${orgname}/views/calendar`,
});
/**
 * @deprecated
 */
const oldWorkspaceDefaultCustomCalendarView = createRouteDefinition<{
  orgname: string;
}>({
  id: RouteId.OLD_WORKSPACE_DEFAULT_CUSTOM_CALENDAR_VIEW,
  backbonePattern: ':orgname/views/calendar(?*query)',
  regExp: new RegExp('^([^/]+)/views/calendar(?:\\?(.*?))?$'),
  /**
   * @deprecated
   */
  routeParamsToPathname: ({ orgname }) => `/${orgname}/views/calendar`,
});
const inbox = createRouteDefinition<{ username: string }>({
  id: RouteId.INBOX,
  modernizationFeatureGate: 'tplat_migrate_route_inbox',
  backbonePattern: 'my/inbox',
  reactPattern: 'my/inbox',
  regExp: new RegExp('my/inbox$'),
  routeParamsToPathname: () => '/my/inbox',
});
const oldInbox = createRouteDefinition<{ username: string }>({
  id: RouteId.OLD_INBOX,
  modernizationFeatureGate: 'tplat_migrate_route_inbox',
  backbonePattern: ':username/inbox',
  reactPattern: ':username/inbox',
  regExp: new RegExp('^([^/]+)/inbox$'),
  routeParamsToPathname: ({ username }) => `/${username}/inbox`,
});

export const routeDefinitions = {
  [RouteId.ACCOUNT]: account,
  [RouteId.BILLING]: billing,
  [RouteId.BLANK]: blank,
  [RouteId.BOARD]: board,
  [RouteId.BOARD_OLD]: boardOld,
  [RouteId.BOARD_REFERRAL]: boardReferral,
  [RouteId.CARD]: card,
  [RouteId.CARD_AND_BOARD_OLD]: cardAndBoardOld,
  [RouteId.CARD_OLD]: cardOld,
  [RouteId.CREATE_FIRST_BOARD]: createFirstBoard,
  [RouteId.WELCOME_TO_TRELLO]: welcomeToTrello,
  [RouteId.DOUBLE_SLASH]: doubleSlash,
  [RouteId.ENTERPRISE_ADMIN]: enterpriseAdmin,
  [RouteId.ENTERPRISE_ADMIN_TAB]: enterpriseAdminTab,
  [RouteId.ERROR_PAGE]: errorPage,
  [RouteId.GET_APP]: getApp,
  [RouteId.GO]: go,
  [RouteId.INBOX]: inbox,
  [RouteId.OLD_INBOX]: oldInbox,
  [RouteId.INVITE_ACCEPT_BOARD]: inviteAcceptBoard,
  [RouteId.INVITE_ACCEPT_TEAM]: inviteAcceptTeam,
  [RouteId.MEMBER_ACCOUNT]: memberAccount,
  [RouteId.MEMBER_AI_SETTINGS]: memberAiSettings,
  [RouteId.MEMBER_ACTIVITY]: memberActivity,
  [RouteId.OLD_MEMBER_ACTIVITY]: oldMemberActivity,
  [RouteId.MEMBER_ALL_BOARDS]: memberAllBoards,
  [RouteId.OLD_MEMBER_ALL_BOARDS]: oldMemberAllBoards,
  [RouteId.MEMBER_CARDS]: memberCards,
  [RouteId.OLD_MEMBER_CARDS]: oldMemberCards,
  [RouteId.MEMBER_CARDS_FOR_ORG]: memberCardsForOrg,
  [RouteId.OLD_MEMBER_CARDS_FOR_ORG]: oldMemberCardsForOrg,
  [RouteId.MEMBER_HOME]: memberHome,
  [RouteId.MEMBER_HOME_WORKSPACE_BOARDS]: memberHomeBoards,
  [RouteId.OLD_MEMBER_HOME_WORKSPACE_BOARDS]: oldMemberHomeBoards,
  [RouteId.MEMBER_PROFILE_SECTION]: memberProfile,
  [RouteId.MEMBER_TASKS]: memberTasks,
  [RouteId.MEMBER_LABS]: memberLabs,
  [RouteId.OLD_MEMBER_LABS]: oldMemberLabs,
  [RouteId.OLD_ORGANIZATION_GUESTS]: oldOrganizationGuests,
  [RouteId.OLD_ORGANIZATION_MEMBERS]: oldOrganizationMembers,
  [RouteId.OLD_ORGANIZATION_REQUESTS]: oldOrganizationRequests,
  [RouteId.ORGANIZATION_BOARDS]: organizationBoards,
  [RouteId.ORGANIZATION_BY_ID]: organizationById,
  [RouteId.ORGANIZATION_EXPORT]: organizationExport,
  [RouteId.OLD_ORGANIZATION_EXPORT]: oldOrganizationExport,
  [RouteId.ORGANIZATION_FREE_TRIAL]: organizationFreeTrial,
  [RouteId.OLD_ORGANIZATION_FREE_TRIAL]: oldOrganizationFreeTrial,
  [RouteId.ORGANIZATION_GUESTS]: organizationGuests,
  [RouteId.ORGANIZATION_REQUESTS]: organizationRequests,
  [RouteId.ORGANIZATION_MEMBER_CARDS]: organizationMemberCards,
  [RouteId.ORGANIZATION_MEMBERS]: organizationMembers,
  [RouteId.ORGANIZATION_POWER_UPS]: organizationPowerUps,
  [RouteId.OLD_ORGANIZATION_POWER_UPS]: oldOrganizationPowerUps,
  [RouteId.ORGANIZATION_TABLES]: organizationTables,
  [RouteId.OLD_ORGANIZATION_TABLES]: oldOrganizationTables,
  [RouteId.POWER_UP_ADMIN]: powerUpAdmin,
  [RouteId.APPS_ADMIN]: appsAdmin,
  [RouteId.POWER_UP_EDIT]: powerUpEdit,
  [RouteId.APPS_ADMIN_EDIT]: appsAdminEdit,
  [RouteId.POWER_UP_PUBLIC_DIRECTORY]: powerUpPublicDirectory,
  [RouteId.PROFILE]: profile,
  [RouteId.REDEEM]: redeem,
  [RouteId.SEARCH]: search,
  [RouteId.OPEN_SOURCE_ATTRIBUTIONS]: openSourceAttributionsPage,
  [RouteId.SELECT_ORG_TO_UPGRADE]: selectOrgToUpgrade,
  [RouteId.SELECT_TEAM_TO_UPGRADE]: selectTeamToUpgrade,
  [RouteId.SHORTCUTS]: shortcuts,
  [RouteId.SHORTCUTS_OVERLAY]: shortcutsOverlay,
  [RouteId.OLD_ACCOUNT]: oldAccount,
  [RouteId.TEMPLATES]: templates,
  [RouteId.TEMPLATES_RECOMMEND]: templatesRecommend,
  [RouteId.TO]: to,
  [RouteId.USER_OR_ORG]: userOrOrg,
  [RouteId.WORKSPACE_BILLING]: workspaceBilling,
  [RouteId.WORKSPACE_DEFAULT_CUSTOM_TABLE_VIEW]:
    workspaceDefaultCustomTableView,
  [RouteId.OLD_WORKSPACE_DEFAULT_CUSTOM_TABLE_VIEW]:
    oldWorkspaceDefaultCustomTableView,
  [RouteId.WORKSPACE_VIEW]: workspaceView,
  [RouteId.WORKSPACE_DEFAULT_CUSTOM_CALENDAR_VIEW]:
    workspaceDefaultCustomCalendarView,
  [RouteId.OLD_WORKSPACE_DEFAULT_CUSTOM_CALENDAR_VIEW]:
    oldWorkspaceDefaultCustomCalendarView,
} as const;

export type Routes = typeof routeDefinitions;
export type RouteDefinition = Routes[RouteIdType];

/**
 * This represents the order in which the paths are matched by the router
 */
export const orderedRouteList: (typeof routeDefinitions)[RouteIdType][] = [
  /**
   * Quick Boards
   */
  routeDefinitions.go,
  routeDefinitions.to,
  routeDefinitions.doubleSlash,
  /**
   * Power Ups
   */
  routeDefinitions.powerUpAdmin,
  routeDefinitions.powerUpEdit,
  routeDefinitions.powerUpPublicDirectory,
  routeDefinitions.appsAdmin,
  routeDefinitions.appsAdminEdit,
  /**
   * Other
   */
  routeDefinitions.welcomeToTrello,
  routeDefinitions.getApp,
  routeDefinitions.shortcuts,
  routeDefinitions.shortcutsOverlay,
  routeDefinitions.blank,
  routeDefinitions.selectOrgToUpgrade,
  routeDefinitions.selectTeamToUpgrade,
  routeDefinitions.search,
  routeDefinitions.openSourceAttributionsPage,
  routeDefinitions.templates,
  routeDefinitions.templatesRecommend,
  routeDefinitions.redeem,
  /**
   * Invitation
   */
  routeDefinitions.inviteAcceptBoard,
  routeDefinitions.inviteAcceptTeam,
  /**
   * Board
   */
  routeDefinitions.boardOld,
  routeDefinitions.boardReferral,
  routeDefinitions.board,
  routeDefinitions.cardAndBoardOld,
  routeDefinitions.cardOld,
  routeDefinitions.card,
  routeDefinitions.createFirstBoard,
  /**
   * User or Org
   */
  routeDefinitions.account,
  routeDefinitions.oldAccount,
  routeDefinitions.profile,
  routeDefinitions.workspaceBilling,
  routeDefinitions.billing,
  routeDefinitions.userOrOrg,
  /**
   * Enterprise
   */
  routeDefinitions.enterpriseAdmin,
  routeDefinitions.enterpriseAdminTab,
  /**
   * Workspace View
   */
  routeDefinitions.workspaceView,
  /**
   * Member
   */
  routeDefinitions.memberHome,
  routeDefinitions.memberHomeBoards,
  routeDefinitions.oldMemberHomeBoards,
  routeDefinitions.memberAccount,
  routeDefinitions.memberAllBoards,
  routeDefinitions.oldMemberAllBoards,
  routeDefinitions.memberCards,
  routeDefinitions.oldMemberCards,
  routeDefinitions.memberCardsForOrg,
  routeDefinitions.oldMemberCardsForOrg,
  routeDefinitions.memberActivity,
  routeDefinitions.oldMemberActivity,
  routeDefinitions.inbox,
  routeDefinitions.oldInbox,
  routeDefinitions.memberLabs,
  routeDefinitions.oldMemberLabs,
  routeDefinitions.memberAiSettings,
  routeDefinitions.memberProfile,
  routeDefinitions.memberTasks,
  /**
   * Organization
   */
  routeDefinitions.organizationBoards,
  routeDefinitions.oldOrganizationGuests,
  routeDefinitions.oldOrganizationRequests,
  routeDefinitions.oldOrganizationMembers,
  routeDefinitions.organizationById,
  routeDefinitions.organizationGuests,
  routeDefinitions.organizationRequests,
  routeDefinitions.organizationMembers,
  routeDefinitions.organizationMemberCards,
  routeDefinitions.organizationExport,
  routeDefinitions.oldOrganizationExport,
  routeDefinitions.organizationPowerUps,
  routeDefinitions.oldOrganizationPowerUps,
  routeDefinitions.organizationTables,
  routeDefinitions.oldOrganizationTables,
  routeDefinitions.organizationFreeTrial,
  routeDefinitions.oldOrganizationFreeTrial,
  /**
   * Default Workspace Views
   */
  routeDefinitions.workspaceView,
  routeDefinitions.workspaceDefaultCustomTableView,
  routeDefinitions.oldWorkspaceDefaultCustomTableView,
  routeDefinitions.workspaceDefaultCustomCalendarView,
  routeDefinitions.oldWorkspaceDefaultCustomCalendarView,
  /**
   * Catch all
   */
  routeDefinitions.errorPage,
];
