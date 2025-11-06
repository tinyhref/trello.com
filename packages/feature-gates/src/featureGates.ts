type PrimitiveSupportedGateTypes = boolean | number | string;
export type SupportedGateTypes =
  | Array<PrimitiveSupportedGateTypes>
  | PrimitiveSupportedGateTypes
  | {
      [key: string]: PrimitiveSupportedGateTypes;
    };

/**
 * Feature gates / experiments in Statsig have to be defined here as well.
 * The `owner` field should be your Trello username.
 */
export const featureGates = {
  billplat_ccp_create_workspace: {
    createdOn: '2024-07-09',
    owner: 'jborczuk',
  },
  billplat_deprecate_popover_content_renderer: {
    createdOn: '2025-09-18',
    owner: 'kchen9',
  },
  billplat_deprecate_popover_powerupsettingsbutton: {
    createdOn: '2025-09-03',
    owner: 'kchen9',
  },
  billplat_deprecate_popover_use_render_avatar: {
    createdOn: '2025-08-27',
    owner: 'kchen9',
  },
  billplat_enterprise_dashboard_context: {
    createdOn: '2025-10-02',
    owner: 'pperry',
  },
  billplat_planner_privacy: {
    createdOn: '2025-10-27',
    owner: 'pperry',
  },
  billplat_recurring_tasks: {
    createdOn: '2025-01-27',
    owner: 'jborczuk',
  },
  billplat_soft_deprovisioning: {
    createdOn: '2025-07-08',
    owner: 'jborczuk',
  },
  ecosystem_apps_admin_route: {
    createdOn: '2025-08-01',
    owner: 'jlo',
  },
  ecosystem_listing_updates_dev: {
    createdOn: '2025-06-04',
    owner: 'ktran2',
  },
  ecosystem_listing_updates_directory: {
    createdOn: '2025-06-20',
    owner: 'ktran2',
  },
  ecosystem_power_up_views: {
    createdOn: '2024-10-02',
    owner: 'jlo',
  },
  electric_automation_client_modernization: {
    createdOn: '2025-10-17',
    owner: 'bessary',
  },
  electric_calendar_filtering: {
    createdOn: '2025-10-07',
    owner: 'jnierendorf',
  },
  electric_client_side_all_day_transform: {
    createdOn: '2025-10-08',
    owner: 'jday2',
  },
  electric_planner_multi_account_m2: {
    createdOn: '2025-09-04',
    owner: 'handrulis',
  },
  ghost_chrome_supported_qc_discovery: {
    createdOn: '2025-09-18',
    owner: 'achung',
  },
  ghost_cross_flow_all_users_experience: {
    createdOn: '2025-09-23',
    owner: 'achung',
  },
  ghost_experimentation_dev_discovery: {
    createdOn: '2025-09-05',
    owner: 'achung',
  },
  ghost_fix_board_screen_ad_new_user: {
    createdOn: '2025-09-29',
    owner: 'dvenkatachalam',
  },
  ghost_inbox_indicator_save_for_later_spike: {
    createdOn: '2025-08-15',
    owner: 'gbolloch',
  },
  ghost_inbox_list_drop: {
    createdOn: '2025-10-07',
    owner: 'achung',
  },
  ghost_inbox_mobile_qr_code: {
    createdOn: '2025-09-08',
    owner: 'achung',
  },
  ghost_internal_traits_override: {
    createdOn: '2025-10-06',
    owner: 'dvenkatachalam',
  },
  ghost_is_in_place_message_event_preview_enabled: {
    createdOn: '2025-08-11',
    owner: 'achung',
  },
  ghost_mirror_card_back_subscription: {
    createdOn: '2025-01-14',
    owner: 'jsaussy',
  },
  ghost_mirror_card_popover_tabs: {
    createdOn: '2025-05-17',
    owner: 'jsaussy',
  },
  ghost_mirror_popover_experiment_gate: {
    createdOn: '2025-05-06',
    owner: 'jsaussy',
  },
  ghost_notification_inbox_read_mutation: {
    createdOn: '2025-10-29',
    owner: 'gbolloch',
  },
  ghost_notification_quick_capture_query: {
    createdOn: '2025-10-28',
    defaultValue: false,
    owner: 'mahieieva',
  },
  ghost_onboarding_a11y_move_card: {
    createdOn: '2025-08-15',
    owner: 'mahieieva',
  },
  ghost_one_subscription_per_mirror: {
    createdOn: '2025-02-25',
    owner: 'jsaussy',
  },
  ghost_personal_productivity_survey: {
    createdOn: '2025-09-26',
    owner: 'dvenkatachalam',
  },
  ghost_planner_existing_user_discovery: {
    createdOn: '2025-10-31',
    owner: 'ashaw',
  },
  ghost_planner_feature_discovery_ui: {
    createdOn: '2025-08-06',
    owner: 'achung',
  },
  ghost_poll_user_traits: {
    createdOn: '2025-06-05',
    owner: 'achung',
  },
  ghost_prevent_onboarding_load: {
    createdOn: '2025-10-01',
    owner: 'dvenkatachalam',
  },
  ghost_qc_inbox_notifications: {
    createdOn: '2025-10-01',
    defaultValue: false,
    owner: 'mahieieva',
  },
  ghost_qc_info_panel_chrome_highlight: {
    createdOn: '2025-10-29',
    owner: 'achung',
  },
  ghost_refresh_feature_gates_on_visibility_change: {
    createdOn: '2025-09-03',
    owner: 'achung',
  },
  ghost_simulate_new_user_dev: {
    createdOn: '2025-05-21',
    owner: 'dvenkatachalam',
  },
  ghost_simulate_quick_capture_in_internal_tools: {
    createdOn: '2025-09-05',
    owner: 'gbolloch',
  },
  ghost_trello_jira_conf_co_usage_trait_vnext: {
    createdOn: '2025-10-07',
    owner: 'gbolloch',
  },
  ghost_ungate_template_placement: {
    createdOn: '2025-09-12',
    owner: 'achung',
  },
  ghost_use_context_for_card_cover_pref: {
    createdOn: '2025-10-31',
    owner: 'jsaussy',
  },
  ghost_use_mirror_card_subscriptions: {
    createdOn: '2024-12-16',
    owner: 'jsaussy',
  },
  ghost_use_mirror_quickload_errors: {
    createdOn: '2025-06-11',
    owner: 'jsaussy',
  },
  ghost_use_react_focus_lock_pups: {
    createdOn: '2025-04-08',
    owner: 'slondon',
  },
  ghost_use_server_add_starter_guide: {
    createdOn: '2025-04-10',
    owner: 'achung',
  },
  goo_ai_eligibility_quickcapture_ga_check: {
    createdOn: '2025-03-14',
    defaultValue: false,
    owner: 'fkrawczyk',
  },
  goo_ai_retries_enabled: {
    createdOn: '2025-08-14',
    defaultValue: false,
    owner: 'fkrawczyk',
  },
  goo_allow_disabling_keyboard_shortcuts: {
    createdOn: '2025-05-20',
    defaultValue: false,
    owner: 'evgeniyagorobets1',
  },
  goo_card_back_cache_syncing: {
    createdOn: '2025-06-09',
    owner: 'evgeniyagorobets1',
  },
  goo_dev_portal_native_gql_migration: {
    createdOn: '2024-08-06',
    owner: 'cgarrison',
  },
  goo_gql_ws_connection_ack_timeout: {
    createdOn: '2025-10-01',
    owner: 'ccurtis',
  },
  goo_graphql_connectivity_flags: {
    createdOn: '2024-10-17',
    owner: 'ccurtis',
  },
  goo_horsefly_dev_portal: {
    createdOn: '2025-05-29',
    owner: 'cgarrison',
  },
  goo_native_graphql_migration_milestone_3: {
    createdOn: '2025-07-31',
    owner: 'stuo',
  },
  goo_quick_capture_card_front_external_link: {
    createdOn: '2025-08-12',
    owner: 'rryumae',
  },
  goo_quick_capture_webpages_popover: {
    createdOn: '2025-09-30',
    owner: 'rryumae',
  },
  goo_remove_non_native_gql_board_stars: {
    createdOn: '2025-10-14',
    owner: 'stuo',
  },
  goo_send_ws_ping: {
    createdOn: '2025-07-11',
    owner: 'ccurtis',
  },
  goo_sequence_number_replays: {
    createdOn: '2025-09-02',
    owner: 'ccurtis',
  },
  goo_slower_client_reconnects: {
    createdOn: '2024-10-21',
    owner: 'ccurtis',
  },
  goo_sync_reactions_to_cache: {
    createdOn: '2025-09-04',
    owner: 'jhunt',
  },
  goo_throw_error_for_missing_typename: {
    createdOn: '2025-10-17',
    owner: 'egorobets',
  },
  goo_use_graphql_ws_rate_limiting: {
    createdOn: '2025-08-26',
    owner: 'ccurtis',
  },
  gql_client_subscriptions: {
    createdOn: '2024-10-28',
    owner: 'egorobets',
  },
  gqldata_email_attachment_preview: {
    createdOn: '2024-09-12',
    owner: 'cgarrison',
  },
  gqldata_inbox_email_ai: {
    createdOn: '2024-10-18',
    owner: 'cgarrison',
  },
  legacy_url_error_page: {
    createdOn: '2024-09-10',
    owner: 'dbernal',
  },
  phx_archive_all_cards_in_list: {
    createdOn: '2025-10-02',
    owner: 'hburinda',
  },
  phx_auto_archive_workspace_setting: {
    createdOn: '2025-07-30',
    owner: 'cfranco2',
  },
  phx_bulk_actions: {
    createdOn: '2025-06-26',
    owner: 'ajaiman',
  },
  phx_bulk_actions_v2: {
    createdOn: '2025-11-03',
    owner: 'hburinda',
  },
  phx_card_back_cover_reposition: {
    createdOn: '2025-10-09',
    owner: 'cma2',
  },
  phx_card_back_onboarding: {
    createdOn: '2025-04-07',
    owner: 'mellis',
  },
  phx_card_composer_rovo_agents: {
    createdOn: '2025-10-22',
    owner: 'dstraus',
  },
  phx_cardback_resize_panel: {
    createdOn: '2025-09-04',
    owner: 'mcalarco',
  },
  phx_drag_and_drop_to_rovo_context: {
    createdOn: '2025-10-16',
    owner: 'mramosmartins',
  },
  phx_drag_to_merge: {
    createdOn: '2025-10-24',
    owner: 'dsnyder',
  },
  phx_editor_view_bypass: {
    createdOn: '2025-10-01',
    owner: 'mellis',
  },
  phx_generate_checklists: {
    createdOn: '2025-09-25',
    owner: 'dsnyder',
  },
  phx_inbox_labels: {
    createdOn: '2025-10-03',
    owner: 'tgolden',
  },
  phx_localize_count_refactor: {
    createdOn: '2025-10-27',
    owner: 'ajaiman',
  },
  phx_merge_cards: {
    createdOn: '2025-08-26',
    owner: 'ajaiman',
  },
  phx_modernize_board_collections_ux: {
    createdOn: '2025-06-24',
    owner: 'agupta45',
  },
  phx_modernize_board_switcher_collections_ux: {
    createdOn: '2025-08-18',
    owner: 'agupta45',
  },
  phx_modernize_copy_board: {
    createdOn: '2025-10-14',
    owner: 'mcalarco',
  },
  phx_multi_card_drag_and_drop: {
    createdOn: '2025-09-23',
    owner: 'cma2',
  },
  phx_rovo_card_back: {
    createdOn: '2025-05-12',
    owner: 'ajaiman',
  },
  phx_rovo_island: {
    createdOn: '2025-05-06',
    owner: 'ajaiman',
  },
  phx_smart_schedule_m1: {
    createdOn: '2025-06-18',
    owner: 'ajaiman',
  },
  phx_smart_schedule_m2: {
    createdOn: '2025-10-17',
    owner: 'cma2',
  },
  phx_smart_schedule_native_query: {
    createdOn: '2025-10-01',
    owner: 'dsnyder',
  },
  phx_typography_refresh_2: {
    createdOn: '2025-05-08',
    owner: 'mellis',
  },
  phx_zen_mode: {
    createdOn: '2025-02-14',
    owner: 'ajaiman',
  },
  'platform-component-visual-refresh': {
    createdOn: '2025-04-11',
    owner: 'mellis',
  },
  tplat_migrate_route_account_settings: {
    createdOn: '2025-08-26',
    owner: 'mfoulks',
  },
  tplat_migrate_route_blank: {
    createdOn: '2025-10-20',
    owner: 'mfaith',
  },
  tplat_migrate_route_enterprise_admin: {
    createdOn: '2025-10-21',
    owner: 'mfaith',
  },
  tplat_migrate_route_inbox: {
    createdOn: '2025-08-22',
    owner: 'mfaith',
  },
  tplat_migrate_route_oss_attributions: {
    createdOn: '2025-10-21',
    owner: 'dminshew',
  },
  tplat_ssr_error_warning_banner: {
    createdOn: '2025-10-31', // ~Spooky~
    owner: 'mfoulks',
  },
  tplat_ufo_integration_planner_component: {
    createdOn: '2025-10-14',
    owner: 'mfoulks',
  },
  'trello-member-cards-query': {
    createdOn: '2025-04-16',
    owner: 'greznicov',
  },
  'trello-server-e2b-ai': {
    createdOn: '2024-05-14',
    owner: 'brianzawisza1',
  },
  'trello-web-seat-automation-member-blocklist': {
    createdOn: '2024-08-08',
    owner: 'alitskevitch',
  },
  trello_ads_icons: {
    createdOn: '2025-04-15',
    owner: 'wloo2',
  },
  trello_beta_ga: {
    createdOn: '2025-04-14',
    owner: 'bessary',
  },
  trello_cancel_trial_gate: {
    createdOn: '2025-09-18',
    owner: 'mpinnell',
  },
  trello_electric_use_login_hint: {
    createdOn: '2025-07-15',
    owner: 'afecenko',
  },
  trello_enterprise_all_organization_closed_boards: {
    createdOn: '2025-09-17',
    owner: 'alitskevitch',
  },
  trello_enterprise_allow_same_active_and_inactive: {
    createdOn: '2025-08-28',
    owner: 'alitskevitch',
  },
  trello_enterprise_inbox_always_fetch_inbox: {
    createdOn: '2025-07-24',
    owner: 'alitskevitch',
  },
  trello_enterprise_member_planner_update_on_data: {
    createdOn: '2025-07-31',
    owner: 'alitskevitch',
  },
  trello_enterprise_refetch_inbox: {
    createdOn: '2025-08-19',
    owner: 'ccanoy',
  },
  trello_enterprise_shadowit_member_in_workspace: {
    createdOn: '2025-06-16',
    owner: 'jlei',
  },
  trello_enterprise_workspace_member_infinite_list: {
    createdOn: '2025-09-22',
    owner: 'jlei',
  },
  trello_feature_gate_client_init_with_provider: {
    createdOn: '2025-02-20',
    owner: 'achung',
  },
  trello_goo_custom_ai_prompts: {
    createdOn: '2025-05-19',
    owner: 'fkrawczyk',
  },
  trello_graphql_retry_link: {
    createdOn: '2025-08-20',
    owner: 'jasmar',
  },
  trello_hover_inbetween_lists: {
    createdOn: '2025-10-16',
    owner: 'greznicov',
  },
  'trello_non-ppm_single_player': {
    createdOn: '2024-01-22',
    owner: 'achung',
  },
  trello_optimistically_clear_card_url_on_move: {
    createdOn: '2025-09-10',
    owner: 'greznicov',
  },
  trello_paid_workspaces: {
    createdOn: '2024-03-01',
    owner: 'wloo2',
  },
  trello_personal_productivity_release: {
    createdOn: '2024-11-13',
    owner: 'sronderos',
  },
  trello_reverse_trials: {
    createdOn: '2024-10-07',
    owner: 'greznicov',
  },
  trello_web_native_gql_labels: {
    createdOn: '2025-10-28',
    owner: 'apoudyal',
  },
  trello_web_pinned_cards: {
    createdOn: '2024-06-07',
    owner: 'jlei',
  },
  trello_web_ufo_inbox: {
    createdOn: '2025-10-30',
    owner: 'greznicov',
  },
  trello_xf_discovery_ads_control: {
    createdOn: '2024-08-02',
    owner: 'achung',
  },
  trello_xf_experiment_analytics_toggle: {
    createdOn: '2024-03-11',
    owner: 'achung',
  },
  trello_xf_exposure_event_rate_limiting: {
    createdOn: '2025-04-09',
    owner: 'gbolloch',
  },
  trello_xf_invite_experience_2: {
    createdOn: '2024-05-14',
    owner: 'mleaf',
  },
  trello_xf_invite_skip_create_confirmation: {
    createdOn: '2025-05-19',
    owner: 'ldahill',
  },
  trello_xf_one_liner_header_experience: {
    createdOn: '2024-05-10',
    owner: 'mshih',
  },
  trello_xf_post_office_board_screen_placement: {
    createdOn: '2024-10-24',
    owner: 'gbolloch',
  },
  trello_xf_use_card_drag_external: {
    createdOn: '2024-05-08',
    owner: 'jsaussy',
  },
  trello_xf_use_view_for_calendar_powerup: {
    createdOn: '2024-04-23',
    owner: 'jsaussy',
  },
  xf_planner_auto_updating_date: {
    createdOn: '2025-04-17',
    owner: 'tvanh',
  },
  xf_planner_card_back_subscriptions: {
    createdOn: '2025-06-17',
    owner: 'jnierendorf',
  },
  xf_planner_event_preview_temporary: {
    createdOn: '2025-06-24',
    owner: 'jday2',
  },
  xf_planner_single_card_event: {
    createdOn: '2025-04-07',
    owner: 'handrulis',
  },
  xf_plugin_modernization_board_bar: {
    createdOn: '2025-07-28',
    owner: 'lren',
  },
  xf_plugin_modernization_modal: {
    createdOn: '2025-06-23',
    owner: 'lren',
  },
  xf_plugin_modernization_popover_views: {
    createdOn: '2025-05-28',
    owner: 'lren',
  },
  xf_statsig_feature_gates_refresher: {
    createdOn: '2024-10-10',
    owner: 'achung',
  },
} as const;

export const featureExperiments = {
  ghost_add_to_inbox: {
    createdOn: '2025-09-09',
    owner: 'mahieieva',
    parameters: {
      cohort: ['control', 'treatment-a', 'treatment-b'],
    },
    primaryIdentifier: 'atlassianAccountId',
  },
  ghost_eotf_with_pp: {
    createdOn: '2025-08-20',
    owner: 'dvenkatachalam',
    parameters: {
      cohort: ['control', 'treatment'],
    },
    primaryIdentifier: 'trelloWorkspaceId',
  },
  ghost_evergreen_quick_capture_tip: {
    createdOn: '2025-07-22',
    owner: 'gbolloch',
    parameters: {
      cohort: ['control', 'experiment'],
    },
    primaryIdentifier: 'atlassianAccountId',
  },
  ghost_monetization_messaging: {
    createdOn: '2025-07-24',
    owner: 'dvenkatachalam',
    parameters: {
      cohort: ['control', 'experiment'],
    },
    primaryIdentifier: 'trelloWorkspaceId',
  },
  ghost_nuo_nav_variants: {
    createdOn: '2025-10-20',
    owner: 'achung',
    parameters: {
      cohort: ['control', 'experiment'],
    },
    primaryIdentifier: 'atlassianAccountId',
  },
  ghost_planner_multi_account_discovery: {
    createdOn: '2025-10-07',
    owner: 'ashaw',
    parameters: {
      cohort: ['control', 'treatment'],
    },
    primaryIdentifier: 'atlassianAccountId',
  },
  ghost_pp_discovery_for_trello_invitees_d0: {
    createdOn: '2025-10-14',
    owner: 'mshih',
    parameters: {
      cohort: ['control', 'treatment'],
    },
    primaryIdentifier: 'atlassianAccountId',
  },
  ghost_pp_discovery_for_trello_invitees_d1: {
    createdOn: '2025-10-22',
    owner: 'mshih',
    parameters: {
      cohort: ['control', 'variant-b', 'variant-c'],
    },
    primaryIdentifier: 'atlassianAccountId',
  },
  ghost_test_pausing_experiment: {
    createdOn: '2025-08-19',
    owner: 'gbolloch',
    parameters: {
      cohort: ['control', 'experiment'],
    },
    primaryIdentifier: 'atlassianAccountId',
  },
  'new_user_onboarding_flow_and_in-product_discovery': {
    createdOn: '2025-01-31',
    owner: 'achung',
    parameters: {
      campaign: ['moonshot', 'newUserSplitScreenOnboarding'],
    },
    primaryIdentifier: 'atlassianAccountId',
  },
  trello_cancel_free_trial: {
    createdOn: '2025-09-18',
    owner: 'mpinnell',
    parameters: {
      cohort: ['control', 'treatment'],
    },
    primaryIdentifier: 'trelloWorkspaceId',
  },
  xf_boards_home_sidebar_placement: {
    createdOn: '2025-01-13',
    owner: 'gbolloch',
    parameters: {
      cohort: ['control', 'experiment'],
    },
    primaryIdentifier: 'atlassianAccountId',
  },
  xf_de_facto_bandits_grs_trello_feature_integration: {
    createdOn: '2025-02-14',
    owner: 'achung',
    parameters: {
      cohort: ['experiment', 'control'],
    },
    primaryIdentifier: 'atlassianAccountId',
  },
} as const;

// When adding a new layer, change the object type as shown below
// export const featureLayers = {} as const;
export const featureLayers: Record<string, { parameters: object }> = {};

export type FeatureGateKeys = keyof typeof featureGates;
export type FeatureExperimentKeys = keyof typeof featureExperiments;
export type FeatureLayersKeys = keyof typeof featureLayers;
export type FeatureExperimentParameters<
  TExperimentKey extends FeatureExperimentKeys,
> = keyof (typeof featureExperiments)[TExperimentKey]['parameters'];
export type FeatureExperimentPrimaryIdentifiers =
  | 'analyticsAnonymousId'
  | 'atlassianAccountId'
  | 'trelloWorkspaceId';
export type FeatureLayerParameters<TLayerKey extends FeatureLayersKeys> =
  keyof (typeof featureLayers)[TLayerKey]['parameters'];

export type RegisteredFeatureKey = FeatureExperimentKeys | FeatureGateKeys;

/**
 * Used to narrow down to the experiment variations types, given the experiment key and parameter key
 * e.g. type Variations = ExperimentVariations<'trello_experiment_key', 'cohort'>
 */
export type ExperimentVariations<
  TExperimentKey extends FeatureExperimentKeys,
  TExperimentParam extends FeatureExperimentParameters<TExperimentKey>,
> =
  // Explicit any type is used where we don't actually care about the type. It is used just so we can then
  // index on the variation tuples using [number].
  | 'not-enrolled'
  | ((typeof featureExperiments)[TExperimentKey]['parameters'] extends Record<
      TExperimentParam,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- we don't care about the type
      any
    >
      ? (typeof featureExperiments)[TExperimentKey]['parameters'][TExperimentParam][number]
      : never);

/**
 * Used to narrow down to the experiment variations types, given the layer key and parameter key
 * e.g. type Variations = ExperimentVariations<'trello_layer_key', 'cohort'>
 */
export type LayerVariations<
  TLayerKey extends FeatureLayersKeys,
  TLayerParam extends FeatureLayerParameters<TLayerKey>,
> =
  // Explicit any type is used where we don't actually care about the type. It is used just so we can then
  // index on the variation tuples using [number].
  | 'not-enrolled'
  | ((typeof featureLayers)[TLayerKey]['parameters'] extends Record<
      TLayerParam,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- we don't care about the type
      any
    >
      ? (typeof featureLayers)[TLayerKey]['parameters'][TLayerParam][number]
      : never);
