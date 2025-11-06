import type { UpsellCohortType } from '@trello/planner';

import { UpsellCohort } from '../useUpsellData';

export const canShowUpsells = (upsellCohort: UpsellCohortType) => {
  return (
    upsellCohort === UpsellCohort.UpgradeAvailable ||
    upsellCohort === UpsellCohort.TrialAvailable
  );
};
