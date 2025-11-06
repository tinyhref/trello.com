import type { TrelloWindow } from '@trello/window-types';

import { Client } from './version';

declare const window: TrelloWindow;

/**
 * Configuration values set by the webpack.DefinePlugin (for storybook) and rspack.DefinePlugin (for app)
 * to be injected into the codebase.
 */
declare const __SLACK_TRELLO_DOMAIN__: string;
declare const __DEVSERVER__: boolean;
declare const __TRELLO_FOR_WEBSITES__: string;
declare const __CUSTOM_FIELDS_ID__: string;
declare const __FIRST_PARTY_PLUGINS_ORG__: string;
declare const __PLUGIN_CI_ORG__: string;
declare const __LIST_LIMITS_POWERUP_ID__: string;
declare const __MAP_POWERUP_ID__: string;
declare const __BITBUCKET_POWERUP_ID__: string;
declare const __BILLING_CONSOLE__: string;
declare const __ATTACHMENTS_DOMAIN__: string;
declare const __BACKGROUND_DOMAIN__: string;
declare const __LOGO_DOMAIN__: string;
declare const __ONE_DRIVE_CLIENT_ID__: string;
declare const __GOOGLE_DRIVE_CLIENT_ID__: string;
declare const __GOOGLE_DRIVE_EXTENSION_API_KEY__: string;
declare const __GOOGLE_DRIVE_EXTENSION_CLIENT_ID__: string;
declare const __DROPBOX_CLIENT_APP_KEY__: string;
declare const __BOX_CLIENT_ID__: string;
declare const __STRIPE_API_KEY__: string;
declare const __GOOGLE_MAPS_API_KEY__: string;
declare const __GOOGLE_MAPS_REACT_API_KEY__: string;
declare const __ANALYTICS_WEB_CLIENT_ENV__: string;
declare const __ANALYTICS_WEB_CLIENT_API_HOST__: string;
declare const __ANALYTICS_WEB_CLIENT_API_HOST_PROTOCOL__: string;
declare const __ATLASSIAN_FEATURE_FLAG_CLIENT_KEY__: string;
declare const __ATLASSIAN_FEATURE_FLAG_CLIENT_URL__: string;
declare const __ATLASSIAN_FONT_BASE_URL__: string;
declare const __ATLASSIAN_FONT_VERSION__: string;
declare const __ATLASSIAN_FONT_RULES_VERSION__: string;
declare const __ENV__: 'branch' | 'dev' | 'local' | 'prod' | 'staging';
declare const __IDENTITY_BASE_URL__: string;
declare const __ADMIN_HUB_BASE_URL__: string;
declare const __JANUS_BASE_URL__: string;
declare const __WAC_URL__: string;
declare const __SENTRY_DSN__: string;
declare const __BUTLER_API_BASE_URL__: string;
declare const __MS_TEAMS_POWER_UP_ID__: string;
declare const __MS_TEAMS_POWER_UP_URL__: string;
declare const __GMAIL_POWER_UP_ID__: string;
declare const __GMAIL_POWER_UP_URL__: string;
declare const __E2B_ID__: string;
declare const __SESSION_HEARTBEAT_ENABLED__: boolean;
declare const __GOOGLE_TAG_MANAGER_AUTH__: string;
declare const __GOOGLE_TAG_MANAGER_PREVIEW__: string;
declare const __TRELLO_SERVER_MICROS_URL__: string;
declare const __EMAIL_TO_INBOX_ADDRESS__: string;
declare const __PLANNER_OAUTH_CONTAINER_ID__: string;
declare const __AGG_SERVICE_OVERRIDE__: string | null;
declare const __AGG_SCHEMA_OVERRIDE__: string | null;
declare const __GOOGLE_MAPS_MAP_ID__: string;
declare const __DETECT_GPU_BENCHMARK_ASSETS_URL__: string;
declare const __OAUTH2_BASE_URL__: string;

export const googleTagManagerAuth: string = __GOOGLE_TAG_MANAGER_AUTH__;
export const googleTagManagerPreview: string = __GOOGLE_TAG_MANAGER_PREVIEW__;
export const slackTrelloDomain: string = __SLACK_TRELLO_DOMAIN__;
export const isDevserver: boolean = __DEVSERVER__;
export const trelloForWebsites: string = __TRELLO_FOR_WEBSITES__;
export const customFieldsId: string = __CUSTOM_FIELDS_ID__;
export const firstPartyPluginsOrg: string = __FIRST_PARTY_PLUGINS_ORG__;
export const pluginCiOrg: string = __PLUGIN_CI_ORG__;
export const listLimitsPowerUpId: string = __LIST_LIMITS_POWERUP_ID__;
export const mapPowerUpId: string = __MAP_POWERUP_ID__;
export const bitbucketPowerUpId: string = __BITBUCKET_POWERUP_ID__;
export const billingConsole: string = __BILLING_CONSOLE__;
export const attachmentsDomain: string = __ATTACHMENTS_DOMAIN__;
export const backgroundDomain: string = __BACKGROUND_DOMAIN__;
export const logoDomain: string = __LOGO_DOMAIN__;
export const oneDriveClientId: string = __ONE_DRIVE_CLIENT_ID__;
export const googleDriveClientId: string = __GOOGLE_DRIVE_CLIENT_ID__;
export const googleDriveExtensionApiKey: string =
  __GOOGLE_DRIVE_EXTENSION_API_KEY__;
export const googleDriveExtensionClientId: string =
  __GOOGLE_DRIVE_EXTENSION_CLIENT_ID__;
export const dropboxClientAppKey: string = __DROPBOX_CLIENT_APP_KEY__;
export const boxClientId: string = __BOX_CLIENT_ID__;
export const stripeApiKey: string = __STRIPE_API_KEY__;
export const googleMapsApiKey: string = __GOOGLE_MAPS_API_KEY__;
export const googleMapsReactApiKey: string = __GOOGLE_MAPS_REACT_API_KEY__;
export const analyticsWebClientEnv: string = __ANALYTICS_WEB_CLIENT_ENV__;
export const analyticsWebClientApiHost: string =
  __ANALYTICS_WEB_CLIENT_API_HOST__;
export const analyticsWebClientApiHostProtocol: string =
  __ANALYTICS_WEB_CLIENT_API_HOST_PROTOCOL__;
export const atlassianFeatureFlagClientKey: string =
  __ATLASSIAN_FEATURE_FLAG_CLIENT_KEY__;
export const atlassianFeatureFlagClientUrl: string =
  __ATLASSIAN_FEATURE_FLAG_CLIENT_URL__;
export const atlassianFontBaseUrl: string = __ATLASSIAN_FONT_BASE_URL__;
export const atlassianFontVersion: string = __ATLASSIAN_FONT_VERSION__;
export const atlassianFontRulesVersion: string =
  __ATLASSIAN_FONT_RULES_VERSION__;
export const environment = __ENV__;
export const identityBaseUrl: string = __IDENTITY_BASE_URL__;
export const adminHubBaseUrl: string = __ADMIN_HUB_BASE_URL__;
export const janusBaseUrl: string = __JANUS_BASE_URL__;
export const wacUrl: string = __WAC_URL__;
export const sentryDsn: string = __SENTRY_DSN__;
export const butlerApiBaseUrl: string = __BUTLER_API_BASE_URL__;
export const microsoftTeamsId: string = __MS_TEAMS_POWER_UP_ID__;
export const microsoftTeamsUrl: string = __MS_TEAMS_POWER_UP_URL__;
export const gmailId: string = __GMAIL_POWER_UP_ID__;
export const gmailUrl: string = __GMAIL_POWER_UP_URL__;
export const e2bId: string = __E2B_ID__;
export const sessionHeartbeatEnabled: boolean = __SESSION_HEARTBEAT_ENABLED__;
export const trelloServerMicrosUrl: string = __TRELLO_SERVER_MICROS_URL__;
export const emailToInboxAddress: string = __EMAIL_TO_INBOX_ADDRESS__;
export const plannerOauthContainerId: string = __PLANNER_OAUTH_CONTAINER_ID__;
export const aggServiceOverride: string | null = __AGG_SERVICE_OVERRIDE__;
export const aggSchemaOverride: string | null = __AGG_SCHEMA_OVERRIDE__;
export const googleMapsMapId: string = __GOOGLE_MAPS_MAP_ID__;
export const detectGpuBenchmarkAssetsUrl: string =
  __DETECT_GPU_BENCHMARK_ASSETS_URL__;
export const oauth2BaseUrl: string = __OAUTH2_BASE_URL__;

export const isLocalBackend: boolean =
  process.env.NODE_ENV === 'development' && !isDevserver;

/**
 * Current build version information.
 *
 * It is critical that we use window.trelloVersion in the constructor, otherwise we bake the version number into the
 * javascript assets, resulting in cache invalidations for every new build.
 */
const trelloVersion: string = window?.trelloVersion ?? 'dev-0';
export const client = new Client(trelloVersion);
export const clientVersion: string = client.toString();

export const atlassianTeams = [
  '538627f73cbb44d1bfbb58f0',
  '58adea146fcdb5f4e50bebf2',
];

/**
 * Locale value is set in all the localized html templates,
 * so needs to be read from the window
 */
export const locale: string = window.locale || 'en';

/**
 * Reference to runtime site origin
 */
export const siteDomain: string =
  location.origin || /^[^/]+?[/]{2}[^/]+/.exec(location.href)![0];

export const bifrostTrack: string = window.__bifrost_track__;
