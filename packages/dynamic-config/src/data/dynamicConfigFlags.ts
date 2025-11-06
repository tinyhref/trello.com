import type { SupportedFlagTypes } from '../dynamicConfig.types';

export type DynamicConfigFlagManifestValue = {
  createdOn: string;
  defaultValue: SupportedFlagTypes;
  owner: string;
};

/**
 * Dynamic configs in Statsig have to be registered here.
 * The `owner` field should be your Atlassian user name.
 */
const dynamicConfigManifest = {
  butler_ent_admin_only_allowlist: {
    createdOn: '2024-11-18',
    defaultValue: [''] as string[],
    owner: 'ssilber',
  },
  mirror_cards_ent_blocklist: {
    createdOn: '2025-01-23',
    defaultValue: ['55c389e4e94b6c5acb767b23'] as string[],
    owner: 'slondon',
  },
  trello_enterprise_planner_blocklist: {
    createdOn: '2025-05-09',
    defaultValue: [''] as string[],
    owner: 'jlei',
  },
  trello_web_apollo_cache_hydrator_metrics: {
    createdOn: '2024-11-20',
    defaultValue: false,
    owner: 'koduche',
  },
  trello_web_apollo_read_write_metrics: {
    createdOn: '2024-11-18',
    defaultValue: false,
    owner: 'cilleyd',
  },
  trello_web_atlassian_team: {
    createdOn: '2024-11-13',
    defaultValue: false,
    owner: 'mfaith',
  },
  trello_web_billing_down_for_maintenance: {
    createdOn: '2024-11-08',
    defaultValue: false,
    owner: 'jmatthews',
  },
  trello_web_disconnect_active_clients: {
    createdOn: '2024-11-07',
    defaultValue: false,
    owner: 'mfaith',
  },
  trello_web_enable_ufo: {
    createdOn: '2025-06-05',
    defaultValue: false,
    owner: 'mfoulks',
  },
  trello_web_enable_web_vitals: {
    createdOn: '2025-06-24',
    defaultValue: true,
    owner: 'dminshew',
  },
  trello_web_error_handling_rrs: {
    createdOn: '2024-11-20',
    defaultValue: false,
    owner: 'dcilley',
  },
  trello_web_forcefully_reload_to_exact_version: {
    createdOn: '2024-11-18',
    defaultValue: 0,
    owner: 'mfaith',
  },
  trello_web_google_tag_manager: {
    createdOn: '2024-11-04',
    defaultValue: true,
    owner: 'mfaith',
  },
  trello_web_inbox_native_graphql_provisioning: {
    createdOn: '2025-02-11',
    defaultValue: false,
    owner: 'greznicov',
  },
  trello_web_max_first_active_delay: {
    createdOn: '2024-11-20',
    defaultValue: 2000,
    owner: 'mfaith',
  },
  trello_web_max_first_idle_delay: {
    createdOn: '2024-11-20',
    defaultValue: 60000,
    owner: 'mfaith',
  },
  trello_web_native_current_board_info: {
    createdOn: '2024-11-20',
    defaultValue: true,
    owner: 'koduche',
  },
  trello_web_native_current_board_lists_cards: {
    createdOn: '2025-10-24',
    defaultValue: false,
    owner: 'greznicov',
  },
  trello_web_passively_reload_to_minimum_version: {
    createdOn: '2024-11-18',
    defaultValue: 0,
    owner: 'mfaith',
  },
  trello_web_somethings_wrong: {
    createdOn: '2024-11-07',
    defaultValue: false,
    owner: 'mfaith',
  },
  trello_web_take_trello_offline: {
    createdOn: '2024-11-07',
    defaultValue: false,
    owner: 'mfaith',
  },
  trello_web_ufo_sampling_rate: {
    createdOn: '2025-07-11',
    defaultValue: 0.0,
    owner: 'mfoulks',
  },
  trello_web_update_nudge_time_interval: {
    createdOn: '2025-05-22',
    defaultValue: 604800000, // One week in milliseconds
    owner: 'mellis',
  },
} as const;

export type RegisteredDynamicConfigFlagKey = keyof typeof dynamicConfigManifest;
// exporting the manifest as a separate object to type using the sealed const
export const dynamicConfigFlags: Record<
  RegisteredDynamicConfigFlagKey,
  DynamicConfigFlagManifestValue
> = dynamicConfigManifest;
