import { Entitlements } from '@trello/entitlements';
import { useFeatureGate } from '@trello/feature-gate-client';

import { useWorkspaceAtlassianIntelligenceAllowedQuery } from './WorkspaceAtlassianIntelligenceAllowedQuery.generated';

export const useIsAtlassianIntelligenceAllowed = ({
  workspaceId,
}: {
  workspaceId: string;
}): boolean => {
  const { data } = useWorkspaceAtlassianIntelligenceAllowedQuery({
    variables: { workspaceId },
    skip: !workspaceId,
    waitOn: ['MemberHeader'],
  });

  const { value: isInCohort } = useFeatureGate(
    'goo_ai_eligibility_quickcapture_ga_check',
  );

  // Return true if the board belongs to an enterprise
  if (data?.organization?.enterprise?.id) {
    return true;
  }

  const workspace = data?.organization;
  const isStandard = Entitlements.isStandard(workspace?.offering);
  const hasAtlassianIntelligence = workspace?.premiumFeatures?.includes(
    'atlassianIntelligence',
  );

  //if the board is standard paid, check if it is part of the cohort because we now offer quick capture to standard paid users
  if (isStandard) {
    return isInCohort;
  }
  // Otherwise, return true if AI is in feature set.
  return hasAtlassianIntelligence || false;
};
