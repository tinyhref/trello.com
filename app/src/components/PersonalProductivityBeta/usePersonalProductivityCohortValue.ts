import { useMemberId } from '@trello/authentication';

import { useCachedMemberCohorts } from 'app/src/components/TrelloOnline/useCachedMemberCohorts';
import { usePersonalProductivityLocalOverride } from './personalProductivityLocalOverrideState';

export const usePersonalProductivityCohortValue = () => {
  const memberId = useMemberId();

  const userCohorts = useCachedMemberCohorts(memberId);
  const personalProductivityLocalOverride =
    usePersonalProductivityLocalOverride();

  return personalProductivityLocalOverride
    ? personalProductivityLocalOverride
    : userCohorts?.cohorts?.userCohortPersonalProductivity;
};
