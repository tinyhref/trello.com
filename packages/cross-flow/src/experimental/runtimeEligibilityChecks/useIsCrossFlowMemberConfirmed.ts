import { useMemberId } from '@trello/authentication';

import { useCrossFlowMemberFragment } from '../../CrossFlowMemberFragment.generated';
import type { RuntimeEligibilityCheckResult } from './RuntimeEligibilityCheck';

export const useIsCrossFlowMemberConfirmed =
  (): RuntimeEligibilityCheckResult => {
    const memberId = useMemberId();

    const { data: member } = useCrossFlowMemberFragment({
      from: { id: memberId },
      optimistic: false,
    });

    return {
      isEligible: member?.confirmed ?? false,
    };
  };
