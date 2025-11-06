import { useMemberId } from '@trello/authentication';
import { getDateBefore, idToDate } from '@trello/dates';

import { useNewUserFragment } from './NewUserFragment.generated';
import type { RuntimeEligibilityCheckResult } from './RuntimeEligibilityCheck';

export const useIsNewUser = (): RuntimeEligibilityCheckResult => {
  const memberId = useMemberId();
  const { data: memberData } = useNewUserFragment({ from: { id: memberId } });
  const campaigns = memberData?.campaigns ?? [];
  const newUserOnboardingCampaign = campaigns?.find(
    (c: { name: string }) => c.name === 'moonshot' || c.name === 'splitscreen',
  );
  const wentThroughNewUserOnboarding =
    newUserOnboardingCampaign?.dateDismissed !== undefined &&
    newUserOnboardingCampaign.dateDismissed !== null;

  const isNewUser = idToDate(memberId) > getDateBefore({ days: 7 });

  return {
    isEligible: wentThroughNewUserOnboarding && isNewUser,
  };
};
