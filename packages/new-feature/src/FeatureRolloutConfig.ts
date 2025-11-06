import { freeze } from '@trello/objects';

/**
 * These are all features that have some rollout configuration defined for the
 * sake of in-app "new" messaging.
 */
export type NewFeature =
  // Not a real feature; used exclusively for unit tests. Do not sort!
  | 'TestFeature'
  | 'trello-e2b-ai-new-pill'
  | 'trello-e2b-ai'
  | 'trello-mirror-card'
  | 'trello-smart-lists';

export const DATE_FORMAT = 'MM-dd-yyyy';
// Mirrors DATE_FORMAT.
type DateStringFormat = `${number}-${number}-${number}`;

type ConfigType = Record<
  NewFeature,
  [release: DateStringFormat, expiration: DateStringFormat]
>;

export const FeatureRolloutConfig = freeze<ConfigType>({
  // Defined exclusively for unit tests; don't sort this.
  TestFeature: ['01-01-2021', '01-01-9999'],
  'trello-e2b-ai': ['10-01-2024', '01-31-2025'],
  'trello-e2b-ai-new-pill': ['10-01-2024', '01-31-2025'],
  'trello-mirror-card': ['07-31-2024', '01-01-9999'],
  'trello-smart-lists': ['09-05-2024', '01-01-9999'],
});
