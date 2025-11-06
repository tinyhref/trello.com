import { useMemberId } from '@trello/authentication';
import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';
import { useFeatureGate } from '@trello/feature-gate-client';

import { useMemberPersonalProductivityBannerCohortFragment } from './MemberPersonalProductivityBannerCohortFragment.generated';

export const useIsEligibleForPersonalProductivitySurveyBanner = () => {
  const { value: isEligible } = useFeatureGate(
    'ghost_personal_productivity_survey',
  );
  const { isOneTimeMessageDismissed } = useOneTimeMessagesDismissed();
  const memberId = useMemberId();

  const { data } = useMemberPersonalProductivityBannerCohortFragment({
    from: { id: memberId },
  });

  const isGoldenPersonalProductivityEngagement =
    data?.cohorts?.userCohortGoldenPersonalProductivityEngagement === 'enabled';

  return {
    wouldRender:
      isEligible &&
      !isOneTimeMessageDismissed('personal-productivity-survey-banner') &&
      isGoldenPersonalProductivityEngagement,
  };
};
