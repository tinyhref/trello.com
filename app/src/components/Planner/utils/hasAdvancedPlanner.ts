import type { UpsellCohortType } from '@trello/planner';

import { UpsellCohort } from '../useUpsellData';

export const hasAdvancedPlanner = (upsellCohort: UpsellCohortType) => {
  return (
    upsellCohort === UpsellCohort.PaidUser ||
    upsellCohort === UpsellCohort.FreeTrial
  );
};
