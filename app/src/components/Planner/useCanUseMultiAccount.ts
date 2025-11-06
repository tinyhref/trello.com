import {
  PLANNER_MULTI_ACCOUNT_ALLOCATED,
  useUserTrait,
} from '@trello/atlassian-personalization';
import { TrelloStorage, type StorageKey } from '@trello/storage';

import { usePlannerFeatureGate } from './usePlannerFeatureGate';

const PLANNER_MULTI_ACCOUNT_ALLOCATED_KEY: StorageKey<'localStorage'> =
  'planner_multi_account_allocated';

/**
 * Replaces isMultiAccountM2Enabled for multi-account UI visibility during experiment.
 *
 * Pattern:
 *   // Replace this:
 *   if (isMultiAccountM2Enabled) { ... }
 *
 *   // With this:
 *   if (canUseMultiAccount) { ... }
 *
 * During experiment (Nov-Dec 2025):
 *   - Treatment users: true (via persistent trait)
 *   - All other users: false
 *
 */
export const useCanUseMultiAccount = () => {
  // Electric's existing gate (OFF during experiment, ON post-experiment for rollout)
  const { isMultiAccountM2Enabled } = usePlannerFeatureGate();

  // Check if user was in treatment (persistent trait)
  const { value: wasInTreatment } = useUserTrait(
    PLANNER_MULTI_ACCOUNT_ALLOCATED,
  );

  // localStorage fallback (immediate, while trait syncs across devices)
  const localStorageTreatment =
    TrelloStorage.get(PLANNER_MULTI_ACCOUNT_ALLOCATED_KEY) === true;

  // Electric gate OR treatment trait
  // Note: component level handles trial/premium gating
  return (
    isMultiAccountM2Enabled || Boolean(wasInTreatment) || localStorageTreatment
  );
};
