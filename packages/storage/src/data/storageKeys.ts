/**
 * Category for the specific storage key logged in the registry.
 * Categories are defined as follows:
 * - functional: used to personalize the site for individual users, for example by remembering preferences.
 * - necessary: required for the operation of the site. For example, authenticating users, shopping cart, site preferences. These storage items are always set.
 * - performance: used to measure the performance of the site and its features. For example, things related to analytics.
 * - targeting: used to deliver content that is more relevant to a user and their interests. For example, targeted advertising, and/or marketing.
 */
type StorageCategory = 'functional' | 'necessary' | 'performance' | 'targeting';

type StorageKeyData = {
  /** Category for this storage item. See above */
  category: StorageCategory;

  /** Date of creation */
  createdOn: string;

  /** Brief description of purpose for use */
  purpose: string;

  /** Team that owns this key */
  owner: string;
};

/**
 * Registry for all keys (and key prefixes) used to access localStorage.
 */
export const localStorageKeys = {
  'BoardWarning-': {
    category: 'necessary',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose:
      'Stores the board limit warnings the user has seen, and the limits of those warnings. Used to determine if a new warning needs to be shown.',
  },
  HIDE_FRAGMENT_WARNINGS: {
    category: 'functional',
    createdOn: '2025-05-22',
    owner: 'cross-flow',
    purpose: 'Hides Apollo fragment warnings when running Trello locally',
  },
  'NotificationsSeenState-': {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'cross-flow',
    purpose: 'Keeps track of seen notifications/notification groups.',
  },
  PLATFORM_LOCAL_OVERRIDES_KEY: {
    category: 'functional',
    createdOn: '2025-08-14',
    owner: 'platform',
    purpose:
      'Local storage for ADS Platform-level gate overrides. Can be modified by going to Internal Tools -> Statsig Gates and enabling/disabling gates for the gates. Value: object',
  },
  STATSIG_OVERRIDES: {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'cross-flow',
    purpose:
      'Local storage for Statsig Gates&Experiments overrides. Can be modified by going to Internal Tools -> Statsig Gates or Internal Tools -> Statsig Experiments and enabling/disabling gates for the gates or modifying values for Experiments. Not sure if the experiments functionality is exposed to users in any way. Value: object  ',
  },
  STATSIG_OVERRIDES_SERVER: {
    category: 'functional',
    createdOn: '2025-07-19',
    owner: 'web-eng',
    purpose:
      'Local storage for Statsig Server Gates overrides. Can be modified by going to Internal Tools -> Statsig Server Gates and enabling/disabling gates. Value: object (ServerGateOverridesConfig from @trello/server-gate-overrides) ',
  },
  TRAITS_OVERRIDES: {
    category: 'functional',
    createdOn: '2025-10-06',
    owner: 'ghost',
    purpose:
      'Local storage for Traits overrides. Can be modified by going to Internal Tools -> Traits Override and modifying the value for a trait. Value: object  ',
  },
  'accessibleProducts-': {
    category: 'necessary',
    createdOn: '2025-04-16',
    owner: 'cross-flow',
    purpose:
      "Stores the other Atlassian products in use by a user. Doesn't really matter if this is transmitted, as it's a cache of a web request. Value: {}",
  },
  action_history_: {
    category: 'necessary',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose:
      'Stores the undo stack, not normally transmitted, but some actions do call network endpoints selectively depending on the situation.',
  },
  action_history_undo_stack_: {
    category: 'necessary',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose:
      'Stores the "redo" stack (if an action is undone, this stack stores it so it can be redone).',
  },
  'announcement-': {
    category: 'necessary',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose:
      'Stores the read state for taco announcements. Sent in app/src/components/TacoAnnouncements/Announcements.tsx:68',
  },
  'attachment-viewer-magnification-preference': {
    category: 'functional',
    createdOn: '2024-10-08',
    owner: 'cross-flow',
    purpose:
      'Persists user magnification preference for the attachment viewer. Value: boolean',
  },
  autoJoinQueue: {
    category: 'necessary',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose:
      "I suspect this may be dead code, I didn't see any usage, but it looks like this relates to the board invites system?",
  },
  autoOpenCFFE: {
    category: 'targeting',
    createdOn: '2025-04-16',
    owner: 'cross-flow',
    purpose: 'Sets if the fullscreen Cross Flow UI should spawn',
  },
  boardAdMinifiedState: {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'cross-flow',
    purpose: 'Stores the minified state of discovery ads. Value: bool ',
  },
  'boardCardComposerSettings-': {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'enterprise',
    purpose: 'Contains info from card drafts, appears to only be used locally.',
  },
  'boardCardFilterSettings-': {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose: 'Contains saved filter info.',
  },
  'boardListComposerSettings-': {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose: 'Used for List Composer drafts.',
  },
  boardSwitcherLayout: {
    category: 'functional',
    createdOn: '2025-06-03',
    owner: 'web-eng',
    purpose: 'Stores the layout of the board switcher. Value: "grid" | "list"',
  },
  boardSwitcherState: {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose: 'Stores the state of the board switcher.',
  },
  calendar: {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose: 'Calendar view preferences.',
  },
  calendarZoomLevel: {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose:
      "Calendar (/boardName/calendar) time period setting that is changed using corresponding dropdown. Seems to be enabled only when having the Calendar powerup + `trello_xf_use_view_for_calendar_powerup` gate ENABLED Value = 'day' | 'week' | 'month' ",
  },
  'cardBackState-': {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose:
      "Stores the setting for \"Comments & Activity\" panel when the corresponding button is clicked. Value: 'activity' | 'planner' | null",
  },
  cardIdsInRovoContextSharedState: {
    category: 'functional',
    createdOn: '2025-10-15',
    owner: 'web-eng',
    purpose:
      'Stores card IDs that have been added to Rovo AI context for each member. Used to track which cards are part of the Rovo conversation context.',
  },
  'client-initialization-method-': {
    category: 'functional',
    createdOn: '2025-05-23',
    owner: 'cross-flow',
    purpose: 'Stores the feature gate client initialization method',
  },
  'collapsed-lists': {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'cross-flow',
    purpose:
      "Can be modified in Board '...' menu ->  Collapse/Expand all lists or by expanding/collapsing a single list Value: { memberId: { listId: stateNumber, ... }} where stateNumber = 0 (for expanded) | 1 (collapsed)",
  },
  'collapsed-popover-section-ids': {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'platform',
    purpose:
      'In List actions menu: stores the settings for "Automation" and "Change list color" lists being expanded or collapsed.  ',
  },
  custom_action_i18n: {
    category: 'performance',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose:
      "We support loading translations for custom actions from server on-demand, when the client receives a notification that requires it. These translations are stored in the client's local storage.",
  },
  cut: {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose:
      'Used for Trello clipboard functionality. If a card is cut using the `CMD+X` shortcut, contains the URL of the cut card. Otherwise, the key does not exist.',
  },
  dateLastViewedNotifications: {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'cross-flow',
    purpose:
      'This value represents the last time the user viewed their notifications (by clicking on the Notifications icon) Value: number corresponding to new Date().getTime()',
  },
  developerConsoleState: {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'platform',
    purpose:
      'Object representing the developer console settings. The console can be accessed with Internal Tools -> Enable Developer Console. Value: object ',
  },
  draftComments: {
    category: 'necessary',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose: 'Draft comments.',
  },
  draft_: {
    category: 'necessary',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose:
      "When editing board description, the draft text is saved here. Values aren't normally transmitted, but can be part of analytics data if an error is caught. Value: string",
  },
  dynamicConfigClient: {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'platform',
    purpose:
      "`@trello/dynamic-config` initializes a shared state using `@trello/shared-state`.  The package also uses `@trello/storage` to read it directly before shared state is initialized, dangerously.  Values aren't normally transmitted, but can be part of analytics data if an error is caught.",
  },
  dynamicConfigOverrides: {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'platform',
    purpose:
      "`@trello/dynamic-config` sets and gets values from local storage through the `@trello/storage` wrapper.  Values aren't normally transmitted, but can be part of analytics data if an error is caught.",
  },
  dynamicConfigStarred: {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'platform',
    purpose:
      "`@trello/dynamic-config` sets and gets values from local storage through the `@trello/storage` wrapper.  Values aren't normally transmitted, but can be part of analytics data if an error is caught.  An array of dynamic config names which were marked by a star in Internal Tools -> Statsig Dynamic Configuration Value: string[]  ",
  },
  dynamicConfigUserData: {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'platform',
    purpose:
      "`@trello/dynamic-config` sets and gets values from local storage through the `@trello/storage` wrapper.  Values aren't normally transmitted, but can be part of analytics data if an error is caught.",
  },
  'editor-placeholder-hints-': {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose:
      "We have a set of 6 placeholders for the description with tips for the user that we want to rotate through once per card view. We don't want it to change when a user is switching from view to edit on the same card. So, we store the index of last viewed hint in storage and only update it when the current card gets unmounted.",
  },
  expanded_team_tabs: {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose:
      'Keeps track of expanded state of workspaces in the left sidebar. Value: string[]',
  },
  'featureGates-': {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'cross-flow',
    purpose:
      "`@trello/feature-gate-client` sets and gets values from local storage through the `@trello/shared-state` wrapper. This call is not persistent, and is manually persisted/recalled through a call to `@trello/storage`  The package also uses `@trello/storage` to read it directly before shared state is initialized, dangerously.  Values aren't normally transmitted, but can be part of analytics data if an error is caught.",
  },
  'fep.feature-flags-sort-order': {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'platform',
    purpose:
      'Stores the setting for FF sort order. Looks like a dev-only thing.',
  },
  'focus-mode-show-cards': {
    category: 'functional',
    createdOn: '2025-02-21',
    owner: 'web-eng',
    purpose: 'Used to show/hide cards in focus mode. Value: boolean. ',
  },
  'focus-mode-show-time': {
    category: 'functional',
    createdOn: '2025-02-21',
    owner: 'web-eng',
    purpose: 'Used to show/hide time in focus mode. Value: boolean. ',
  },
  'focus-mode-theme': {
    category: 'functional',
    createdOn: '2025-03-28',
    owner: 'web-eng',
    purpose: "Persists the user's focus mode theme",
  },
  'global-theme': {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose: 'Used for the color mode across the app.',
  },
  home_: {
    category: 'performance',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose:
      'Defines where the user will go after pressing the Home button in Trello.',
  },
  idCollapsedChecklists: {
    category: 'functional',
    createdOn: '2024-07-30',
    owner: 'web-eng',
    purpose:
      'Used to persis which checklists are collapsed on the card back. Value: boolean',
  },
  idLastOrganization: {
    category: 'necessary',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose: 'This is used in copying a board. Might be dead code.',
  },
  inboxIds: {
    category: 'necessary',
    createdOn: '2025-04-16',
    owner: 'enterprise',
    purpose: 'Stores inbox IDs for memberId.',
  },
  inboxInfoPanelAnimation: {
    category: 'functional',
    createdOn: '2025-07-14',
    owner: 'cross-flow',
    purpose:
      'Stores inbox quick capture panel animation status (plays each time a card is added to an empty inbox)',
  },
  inboxInfoPanelCollapsedState: {
    category: 'functional',
    createdOn: '2025-10-24',
    owner: 'cross-flow',
    purpose: 'Stores if the inbox info panel has further collapsed.',
  },
  'inviteToJiraPermissions-': {
    category: 'necessary',
    createdOn: '2025-04-16',
    owner: 'cross-flow',
    purpose:
      'Stores if a user can invite another to Jira, and if they have any restrictions.',
  },
  labelState: {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose:
      "In collapsed mode, the card's label name is hidden. This is controlled by showLabelsState. Might be dead code.",
  },
  'last-mirrored-data-': {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'cross-flow',
    purpose: 'Stores the value for the last mirrored card.',
  },
  lastActivity: {
    category: 'performance',
    createdOn: '2025-04-16',
    owner: 'platform',
    purpose:
      'Contains an epoch timestamp for the last time user activity was detected, used to defer network requests when the user is idle.',
  },
  lastDueDateReminder_: {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose:
      'This is set when we open Dates on a card and select a value from the "Set due date reminder" dropdown. Values aren\'t normally transmitted, but can be part of analytics data if an error is caught.a',
  },
  lastReloadTimestamp: {
    category: 'necessary',
    createdOn: '2025-04-16',
    owner: 'platform',
    purpose:
      'Stores the last time the page was refreshed. Related code refreshes the page if 5+ mins passed since last refresh. It looks like this value is set using Internal Tools -> Pick a version -> dropdowns for branch and version.  Value: Date.now() ',
  },
  'lastViewedPowerUpUpdates-': {
    category: 'functional',
    createdOn: '2025-07-28',
    owner: 'ecosystem',
    purpose:
      'Tracks when users last viewed Updates for each Power-Up to show number badges for unseen updates. Keyed by member ID and contains timestamps per power-up ID.',
  },
  'locale-': {
    category: 'necessary',
    createdOn: '2025-04-16',
    owner: 'platform',
    purpose:
      "Stores the user's locale. Direct localStorage access in packages/bootstrap/src/getPreferredLocale.ts:25",
  },
  'memberCohorts-': {
    category: 'performance',
    createdOn: '2025-04-16',
    owner: 'cross-flow',
    purpose:
      "Stores cached member cohorts data. Doesn't seem to be used outside of useFeatureGateClientCustomAttributes.ts, might be dead code. Values aren't normally transmitted, but can be part of analytics data if an error is caught.",
  },
  'memberEnterpriseData-': {
    category: 'performance',
    createdOn: '2025-04-16',
    owner: 'enterprise',
    purpose:
      "Stores cached enterprise data. Doesn't seem to be used outside of useFeatureGateClientCustomAttributes.ts, might be dead code. Values aren't normally transmitted, but can be part of analytics data if an error is caught.",
  },
  'memberState-': {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'platform',
    purpose: "Stores user preferences like 'showSuggestions': bool",
  },
  'mirror-tab-': {
    category: 'functional',
    createdOn: '2025-05-13',
    owner: 'cross-flow',
    purpose: 'Stores the tab of the mirror card popover.',
  },
  mobilePromptClosed: {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose:
      "Stores the date when the mobile app download prompt banner was dismissed. We don't show this banner again for the next 24 hours. Values aren't normally transmitted, but can be part of analytics data if an error is caught. Value: Date.now()",
  },
  nocontext: {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose:
      "When this key is set to true, right click on a card opens the system context menu instead of card context menu.  I don't see any place where this value is written to localStorage. This might be a developer-only option.",
  },
  'notificationFilterState-': {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'cross-flow',
    purpose: 'Preferences for filtering notifications.',
  },
  notification_lock_: {
    category: 'necessary',
    createdOn: '2025-04-16',
    owner: 'platform',
    purpose:
      'This is related to browser notification API. Probably a synchronization mechanism for cases when the user has Trello opened in browser and a desktop app, and a notification arrives.',
  },
  'onboardingBoardUrl-': {
    category: 'functional',
    createdOn: '2025-03-19',
    owner: 'cross-flow',
    purpose: 'Stores an onboarding redirect url for the member',
  },
  otmd: {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'platform',
    purpose: 'Related to one time messages functionality. Value: string[]',
  },
  'personalProductivityLocalOverride-': {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'enterprise',
    purpose:
      'Stores the setting from Personal Productivity Toggle. Might be a dev-only thing, but not 100% sure.',
  },
  'planner-calendar-issue-flag-last-dismissed-': {
    category: 'functional',
    createdOn: '2025-09-10',
    owner: 'trello-planner',
    purpose:
      'Stores the timestamp when a planner calendar issue flag was last manually dismissed for a specific account. Keyed by planner account ID. Used to prevent showing flags too frequently for each account independently. Value: number (timestamp)',
  },
  'planner-calendar-list-expanded-': {
    category: 'functional',
    createdOn: '2025-10-17',
    owner: 'trello-planner',
    purpose:
      'Stores the expanded/collapsed state of calendar lists in the calendars popover. Keyed by planner account ID. Value: boolean',
  },
  'planner:custom_view': {
    category: 'necessary',
    createdOn: '2025-04-16',
    owner: 'cross-flow',
    purpose: 'Persists which view to show when the user opens the planner.',
  },
  'planner:weekend_view': {
    category: 'necessary',
    createdOn: '2025-03-19',
    owner: 'cross-flow',
    purpose:
      'Whether the user prefers to show weekends in the planner view. Value: boolean',
  },
  planner_multi_account_allocated: {
    category: 'functional',
    createdOn: '2025-10-17',
    owner: 'electric',
    purpose:
      'Stores whether the user was allocated to the treatment group in the planner multi-account experiment. Used as an immediate fallback while the user trait syncs across devices. Value: boolean',
  },
  postOfficeEnvironment: {
    category: 'necessary',
    createdOn: '2025-04-16',
    owner: 'cross-flow',
    purpose:
      "Stores the post office environment. Looks like a dev-only setting, but not 100% sure. Value: 'local' | 'production' | 'staging'",
  },
  'recentBoardsState-': {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose:
      'Stores recent boards to use them for suggestions, for example in board switcher or link picker.',
  },
  'recentCardsState-': {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose: 'Stores recent cards to suggest them when linking a card.',
  },
  recentMentions: {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose: 'Stores recent mentions to use them in a mention dialog.',
  },
  recentlyFlaggedInvites: {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'enterprise',
    purpose:
      "Used to track last time we showed a flag for a invite accepted notification.  Values aren't normally transmitted, but can be part of analytics data if an error is caught.",
  },
  recentlyUsedFeatures: {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose:
      'Stores feature usage in LocalStorage and for a delayed preload on app entry only if the feature has been used by that user within a given time frame (3 days by default).',
  },
  reloadedToUpdate: {
    category: 'necessary',
    createdOn: '2025-04-16',
    owner: 'platform',
    purpose:
      'This is needed for reload-to-update functionality Sent in packages/client-updater/src/sendReloadedToUpdateEvent.ts:19',
  },
  sandboxState: {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'platform',
    purpose: 'This seems to be a dev-only preference for Apollo.',
  },
  'selected-rovo-site-id': {
    category: 'functional',
    createdOn: '2025-05-09',
    owner: 'web-eng',
    purpose: 'Stores the selected site id for Rovo.',
  },
  serverTimeDelta: {
    category: 'performance',
    createdOn: '2025-04-16',
    owner: 'platform',
    purpose:
      'Holds the difference between the current system epoch, and the epoch returned from the last API request. Updated when API requests are returned. (This appears to be older, backbone-related code)',
  },
  showDetails: {
    category: 'performance',
    createdOn: '2025-04-16',
    owner: 'platform',
    purpose:
      'Stores the setting for Show/Hide Details button in cardback Activity.',
  },
  'sidebarBoardOrderState-': {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'enterprise',
    purpose: 'Stores the board sort order (alphabet, recent) in the sidebar.',
  },
  sidebar_boardslist_full_show_collapsed_: {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'enterprise',
    purpose:
      'Stores the setting for showing collapsed boards in BoardsList. Value: bool  Sent in app/src/components/WorkspaceNavigation/BoardsList.tsx:197',
  },
  'split-screen-configuration': {
    category: 'necessary',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose:
      'Contains information about the split screen mode. If you go to a board and click "planner" and/or "inbox" at the bottom of the page, the values in the storage update accordingly.',
  },
  'splitScreenOnboardingMessageDismissal-': {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose:
      "Gets set after the 'split-screen-onboarding' one time message is dismissed. Value: Date.now()",
  },
  'starred-feature-flags': {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'platform',
    purpose:
      'Stores the FFs that we mark as starred in "Statsig Feature Gates"',
  },
  'tacoShowFlags-': {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose:
      "Defines the style of taco announcement that is going to be shown when the user interacts with the crouched taco Icon. Value: {     tacoExpires: date.toString(),     tacoStyle: 'maintenance' | 'normal'   }",
  },
  tacoTimeMs: {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'web-eng',
    purpose:
      'Used to fast forward the taco announcements polling rate. Dev only',
  },
  unsupportedBrowserBannerLastDismissed: {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'platform',
    purpose:
      'Contains Date string of the last time the "Unsupported browser version" banner was dismissed. When this date is older than 1 week, the banner is displayed again. Values aren\'t normally transmitted, but can be part of analytics data if an error is caught. Value: Date.toISOString()',
  },
  useGraphqlWebsocketPings: {
    category: 'functional',
    createdOn: '2025-07-11',
    owner: 'goo',
    purpose:
      'When set, allows the GraphQL websocket to send pings to the server. Value: boolean',
  },
  useWebSockets: {
    category: 'necessary',
    createdOn: '2025-04-16',
    owner: 'platform',
    purpose:
      "Persists a value to enable or disable web sockets. It's pass through to the window, but doesn't appear to actually do anything other than send a message to the console, and persist the value? Value: 'yes' | 'no'",
  },
  userHasSite: {
    category: 'necessary',
    createdOn: '2025-04-16',
    owner: 'cross-flow',
    purpose:
      'Is set to true when the response from /xpsearch-aggregator returns non-zero length for any of jiraSites/confluenceSites/atlasWorkspaces. Is part of a condition if an Atlassian Account login should be rendered. Value: bool',
  },
  'workspaceNavigation-': {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'enterprise',
    purpose:
      'Describes the state of the sidebar (can be changed with the [ hotkey) Value: { view: bool, expandedViewStatus: string }',
  },
  'workspaceViewDismissedDefaultView-': {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'enterprise',
    purpose: 'Settings for workspace views.',
  },
  'workspaceViewNavigationState-': {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'enterprise',
    purpose: 'Settings for workspace views.',
  },
  yourCardsSortView: {
    category: 'functional',
    createdOn: '2025-04-16',
    owner: 'enterprise',
    purpose:
      "/u/<username>/cards -- defines how the cards will be sorted: by board or by due date. Possible values: 'board' | 'date'",
  },
} satisfies Record<string, StorageKeyData>;

/**
 * Registry for all keys (and key prefixes) used to access sessionStorage.
 */
export const sessionStorageKeys = {
  PLATFORM_ROUTER_DIAGNOSTICS_LOG: {
    category: 'performance',
    createdOn: '2025-09-04',
    owner: 'platform',
    purpose:
      'Local storage for log of router/navigation events, used to diagnose router-related issues. Only used when the currently logged-in user is a Trellist. Value: object[]',
  },
  newFeaturesSeen: {
    category: 'functional',
    createdOn: '2025-04-08',
    owner: 'web-eng',
    purpose: 'Stores the seen state of new features.',
  },
  searchConfigurationSession: {
    category: 'functional',
    createdOn: '2025-04-08',
    owner: 'cross-flow',
    purpose: 'Stores cached cross-product search configuration.',
  },
  searchSessionId: {
    category: 'functional',
    createdOn: '2025-04-08',
    owner: 'cross-flow',
    purpose: 'Used in calculating a search journey.',
  },
  'trello.currentUserActivityStatus': {
    category: 'necessary',
    createdOn: '2025-04-08',
    owner: 'platform',
    purpose: 'Tracks the active/idle state of the user for the page.',
  },
  typeof_: {
    category: 'necessary',
    createdOn: '2025-04-08',
    owner: 'enterprise',
    purpose: 'Used to cache view data to avoid loading it multiple times',
  },
} satisfies Record<string, StorageKeyData>;

/**
 * Storage key (or key prefix) used for accessing localStorage.
 */
export type LocalStorageKey = keyof typeof localStorageKeys;
/**
 * Storage key (or key prefix) used for accessing sessionStorage.
 */
export type SessionStorageKey = keyof typeof sessionStorageKeys;
