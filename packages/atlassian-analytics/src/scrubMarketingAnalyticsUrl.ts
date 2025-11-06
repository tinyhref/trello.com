import { isShortLink } from '@trello/id-cache';

type RouteId =
  | 'attributions'
  | 'board-butler-page'
  | 'board-butler'
  | 'board-recommend'
  | 'board'
  | 'card'
  | 'enterprise-admin-tab-subsection'
  | 'enterprise-admin-tab'
  | 'enterprise-admin'
  | 'home'
  | 'power-ups-all'
  | 'power-ups-categories'
  | 'power-ups-home'
  | 'power-ups-trello'
  | 'select-team-to-upgrade'
  | 'shortcuts'
  | 'templates-categories'
  | 'templates-recommend'
  | 'templates-story'
  | 'templates'
  | 'user-cards-workspace'
  | 'user-tabs'
  | 'user'
  | 'view'
  | 'workspace-members-subsection'
  | 'workspace-section'
  | 'workspace-views-subsection'
  | 'workspace';

// indices of non-UGC/PII in the pathname depending on the route
const ALLOWLIST_INDICES = {
  ROUTE_IDENTIFIER: 0,
  ROUTE_SHORTLINK: 1,
  B_ROUTE_BUTLER: 3,
  B_ROUTE_BUTLER_PAGE: 4,
  B_ROUTE_RECOMMEND: 4,
  E_ROUTE_ADMIN: 2,
  E_ROUTE_ADMIN_TAB_NAME: 3,
  E_ROUTE_ADMIN_TAB_SUBSECTION_NAME: 4,
  POWER_UPS_ROUTE_PAGE: 1,
  POWER_UPS_ROUTE_CATEGORY: 1,
  POWER_UPS_ROUTE_CATEGORY_NAME: 2,
  TEMPLATES_ROUTE_PAGE: 1,
  TEMPLATES_ROUTE_CATEGORY: 1,
  TEMPLATES_ROUTE_TEMPLATE_NAME: 2,
  TEMPLATES_ROUTE_RECOMMEND: 4,
  U_ROUTE_TAB_NAME: 2,
  W_ROUTE_PAGE: 2,
  W_ROUTE_PAGE_SUBSECTION: 3,
};
interface RouteDefinition {
  id: RouteId;
  regExp: RegExp;
  allowlist: number[];
}
const routePatternMap = new Map<RouteId, RouteDefinition>([
  [
    'attributions',
    {
      id: 'attributions',
      regExp: new RegExp('^/attributions$'),
      allowlist: [ALLOWLIST_INDICES.ROUTE_IDENTIFIER],
    },
  ],
  [
    'board-recommend',
    {
      id: 'board-recommend',
      regExp: new RegExp('^/b/([^/]+)/([^/]+)/([^/]+)/recommend$'),
      allowlist: [
        ALLOWLIST_INDICES.ROUTE_IDENTIFIER,
        ALLOWLIST_INDICES.ROUTE_SHORTLINK,
        ALLOWLIST_INDICES.B_ROUTE_RECOMMEND,
      ],
    },
  ],
  [
    'board-butler-page',
    {
      id: 'board-butler-page',
      regExp: new RegExp(
        '^/b/([^/]+)/([^/]+)/butler/(rules|card-buttons|board-buttons|schedule|on-dates|connected-apps)$',
      ),
      allowlist: [
        ALLOWLIST_INDICES.ROUTE_IDENTIFIER,
        ALLOWLIST_INDICES.ROUTE_SHORTLINK,
        ALLOWLIST_INDICES.B_ROUTE_BUTLER,
        ALLOWLIST_INDICES.B_ROUTE_BUTLER_PAGE,
      ],
    },
  ],
  [
    'board-butler',
    {
      id: 'board-butler',
      regExp: new RegExp('^/b/([^/]+)/([^/]+)/butler/$'),
      allowlist: [
        ALLOWLIST_INDICES.ROUTE_IDENTIFIER,
        ALLOWLIST_INDICES.ROUTE_SHORTLINK,
        ALLOWLIST_INDICES.B_ROUTE_BUTLER,
      ],
    },
  ],
  [
    'board',
    {
      id: 'board',
      regExp: new RegExp('^/b/([^/]+)(?:/(.*?))?$'),
      allowlist: [
        ALLOWLIST_INDICES.ROUTE_IDENTIFIER,
        ALLOWLIST_INDICES.ROUTE_SHORTLINK,
      ],
    },
  ],
  [
    'card',
    {
      id: 'card',
      regExp: new RegExp('^/c/([a-zA-Z0-9]{8})(?:[/@](.*?))?$'),
      allowlist: [
        ALLOWLIST_INDICES.ROUTE_IDENTIFIER,
        ALLOWLIST_INDICES.ROUTE_SHORTLINK,
      ],
    },
  ],
  [
    'enterprise-admin-tab-subsection',
    {
      id: 'enterprise-admin-tab-subsection',
      regExp: new RegExp(
        '^/e/([^/]+)/admin/(members|workspaces|boards)/(managed|boardguests|deactivated|non-enterprise|pending|public)$',
      ),
      allowlist: [
        ALLOWLIST_INDICES.ROUTE_IDENTIFIER,
        ALLOWLIST_INDICES.E_ROUTE_ADMIN,
        ALLOWLIST_INDICES.E_ROUTE_ADMIN_TAB_NAME,
        ALLOWLIST_INDICES.E_ROUTE_ADMIN_TAB_SUBSECTION_NAME,
      ],
    },
  ],
  [
    'enterprise-admin-tab',
    {
      id: 'enterprise-admin-tab',
      regExp: new RegExp(
        '^/e/([^/]+)/admin/(members|workspaces|settings|attachment-restrictions|boards|power-ups|auditlog|account-administration|sso|api-tokens)$',
      ),
      allowlist: [
        ALLOWLIST_INDICES.ROUTE_IDENTIFIER,
        ALLOWLIST_INDICES.E_ROUTE_ADMIN,
        ALLOWLIST_INDICES.E_ROUTE_ADMIN_TAB_NAME,
      ],
    },
  ],
  [
    'enterprise-admin',
    {
      id: 'enterprise-admin',
      regExp: new RegExp('^/e/([^/]+)/admin$'),
      allowlist: [
        ALLOWLIST_INDICES.ROUTE_IDENTIFIER,
        ALLOWLIST_INDICES.E_ROUTE_ADMIN,
      ],
    },
  ],
  [
    'power-ups-home',
    {
      id: 'power-ups-home',
      regExp: new RegExp('^/power-ups$'),
      allowlist: [ALLOWLIST_INDICES.ROUTE_IDENTIFIER],
    },
  ],
  [
    'power-ups-all',
    {
      id: 'power-ups-all',
      regExp: new RegExp('^/power-ups/all$'),
      allowlist: [
        ALLOWLIST_INDICES.ROUTE_IDENTIFIER,
        ALLOWLIST_INDICES.POWER_UPS_ROUTE_PAGE,
      ],
    },
  ],
  [
    'power-ups-trello',
    {
      id: 'power-ups-trello',
      regExp: new RegExp('^/power-ups/made-by-trello$'),
      allowlist: [
        ALLOWLIST_INDICES.ROUTE_IDENTIFIER,
        ALLOWLIST_INDICES.POWER_UPS_ROUTE_PAGE,
      ],
    },
  ],
  [
    'power-ups-categories',
    {
      id: 'power-ups-categories',
      regExp: new RegExp(
        '^/power-ups/category/(automation|analytics-reporting|board-utilities|communication-collaboration|developer-tools|file-management|hr-operations|it-project-management|marketing-social-media|product-design|sales-support)$',
      ),
      allowlist: [
        ALLOWLIST_INDICES.ROUTE_IDENTIFIER,
        ALLOWLIST_INDICES.POWER_UPS_ROUTE_CATEGORY,
        ALLOWLIST_INDICES.POWER_UPS_ROUTE_CATEGORY_NAME,
      ],
    },
  ],
  [
    'home',
    {
      id: 'home',
      regExp: new RegExp('^/$'),
      allowlist: [ALLOWLIST_INDICES.ROUTE_IDENTIFIER],
    },
  ],
  [
    'select-team-to-upgrade',
    {
      id: 'select-team-to-upgrade',
      regExp: new RegExp('^/select-team-to-upgrade$'),
      allowlist: [ALLOWLIST_INDICES.ROUTE_IDENTIFIER],
    },
  ],
  [
    'shortcuts',
    {
      id: 'shortcuts',
      regExp: new RegExp('^/shortcuts$'),
      allowlist: [ALLOWLIST_INDICES.ROUTE_IDENTIFIER],
    },
  ],
  [
    'templates-recommend',
    {
      id: 'templates-recommend',
      regExp: new RegExp('^/templates/([^/]+)/([^/]+)/([^/]+)/recommend$'),
      allowlist: [
        ALLOWLIST_INDICES.ROUTE_IDENTIFIER,
        ALLOWLIST_INDICES.TEMPLATES_ROUTE_CATEGORY,
        ALLOWLIST_INDICES.TEMPLATES_ROUTE_TEMPLATE_NAME,
        ALLOWLIST_INDICES.TEMPLATES_ROUTE_RECOMMEND,
      ],
    },
  ],
  [
    'templates-categories',
    {
      id: 'templates-categories',
      regExp: new RegExp(
        '^/templates/(business|design|education|engineering|marketing|operations-hr|personal|productivity|product-management|project-management|remote-work|sales|support|team-management)$',
      ),
      allowlist: [
        ALLOWLIST_INDICES.ROUTE_IDENTIFIER,
        ALLOWLIST_INDICES.TEMPLATES_ROUTE_CATEGORY,
      ],
    },
  ],
  [
    'templates-story',
    {
      id: 'templates-story',
      regExp: new RegExp('^/templates/([^/]+)/([^/]+)$'),
      allowlist: [
        ALLOWLIST_INDICES.ROUTE_IDENTIFIER,
        ALLOWLIST_INDICES.TEMPLATES_ROUTE_CATEGORY,
        ALLOWLIST_INDICES.TEMPLATES_ROUTE_TEMPLATE_NAME,
      ],
    },
  ],
  [
    'templates',
    {
      id: 'templates',
      regExp: new RegExp('^/templates$'),
      allowlist: [ALLOWLIST_INDICES.ROUTE_IDENTIFIER],
    },
  ],
  [
    'user-cards-workspace',
    {
      id: 'user-cards-workspace',
      regExp: new RegExp('^/u/([^/]+)/cards/([^/]+)$'),
      allowlist: [
        ALLOWLIST_INDICES.ROUTE_IDENTIFIER,
        ALLOWLIST_INDICES.U_ROUTE_TAB_NAME,
      ],
    },
  ],
  [
    'user-tabs',
    {
      id: 'user-tabs',
      regExp: new RegExp(
        '^/u/([^/]+)/(profile|activity|boards|cards|labs|tasks)$',
      ),
      allowlist: [
        ALLOWLIST_INDICES.ROUTE_IDENTIFIER,
        ALLOWLIST_INDICES.U_ROUTE_TAB_NAME,
      ],
    },
  ],
  [
    'user',
    {
      id: 'user',
      regExp: new RegExp('^/u/'),
      allowlist: [ALLOWLIST_INDICES.ROUTE_IDENTIFIER],
    },
  ],
  [
    'view',
    {
      id: 'view',
      regExp: new RegExp('^/v/'),
      allowlist: [
        ALLOWLIST_INDICES.ROUTE_IDENTIFIER,
        ALLOWLIST_INDICES.ROUTE_SHORTLINK,
      ],
    },
  ],
  [
    'workspace-section',
    {
      id: 'workspace-section',
      regExp: new RegExp(
        '^/w/([^/]+)/(account|billing|home|export|free-trial|members|tables|getting-started|highlights|reports)$',
      ),
      allowlist: [
        ALLOWLIST_INDICES.ROUTE_IDENTIFIER,
        ALLOWLIST_INDICES.W_ROUTE_PAGE,
      ],
    },
  ],
  [
    'workspace-members-subsection',
    {
      id: 'workspace-members-subsection',
      regExp: new RegExp('^/w/([^/]+)/members/(guests|requests)$'),
      allowlist: [
        ALLOWLIST_INDICES.ROUTE_IDENTIFIER,
        ALLOWLIST_INDICES.W_ROUTE_PAGE,
        ALLOWLIST_INDICES.W_ROUTE_PAGE_SUBSECTION,
      ],
    },
  ],
  [
    'workspace-views-subsection',
    {
      id: 'workspace-views-subsection',
      regExp: new RegExp('^/w/([^/]+)/views/(table|calendar|)$'),
      allowlist: [
        ALLOWLIST_INDICES.ROUTE_IDENTIFIER,
        ALLOWLIST_INDICES.W_ROUTE_PAGE,
        ALLOWLIST_INDICES.W_ROUTE_PAGE_SUBSECTION,
      ],
    },
  ],
  [
    'workspace',
    {
      id: 'workspace',
      regExp: new RegExp('^/w/'),
      allowlist: [ALLOWLIST_INDICES.ROUTE_IDENTIFIER],
    },
  ],
]);

const determineRoute = (urlPathname: string): RouteDefinition | undefined => {
  for (const [, routeDefinition] of routePatternMap) {
    if (urlPathname.match(routeDefinition.regExp)) {
      return routeDefinition;
    }
  }
};

// reconstructs the pathname to include sections that DO NOT include UGC/PII
const reconstructPathname = (
  pathnameSections: string[],
  sectionsToKeep: number[],
): string => {
  let reconstructedUrl = '';
  for (let i = 0; i < pathnameSections.length; i++) {
    if (sectionsToKeep.includes(i)) {
      reconstructedUrl += '/' + pathnameSections[i];
    }
  }
  return reconstructedUrl;
};

// finds the matching route for the pathname we want to include in our marketing
// analytics and then sanitizes it of UGC/PII
export const scrubMarketingUrl = (
  urlPathname: string,
  screenName: string,
): string => {
  const matchingRoute = determineRoute(urlPathname);
  // remove starting slash to allow matchers to use ^ properly
  const partialUrl = urlPathname.substring(1, urlPathname.length);
  const pathnameSections = `${partialUrl}`.split('/');

  // Validate shortlinks, do not return marketing URL if shortlinks
  // are invalid
  if (
    pathnameSections[0] === 'b' ||
    pathnameSections[0] === 'c' ||
    pathnameSections[0] === 'v'
  ) {
    if (!isShortLink(pathnameSections[1])) {
      return '/';
    }
  }
  // to avoid UGC/PII related HOTs, we should be extra cautious & return a
  // generic screen name for URLs that don't follow a known pattern
  return matchingRoute
    ? reconstructPathname(pathnameSections, matchingRoute.allowlist)
    : `/${screenName}`;
};
