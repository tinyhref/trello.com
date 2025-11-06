import { useEffect } from 'react';

import { getMemberId } from '@trello/authentication';
import { deepEqual } from '@trello/objects';
import { PersistentSharedState, useSharedState } from '@trello/shared-state';

import type { MemberCohortsFragment } from './MemberCohortsFragment.generated';
import { useMemberCohortsFragment } from './MemberCohortsFragment.generated';

export interface MemberCohortsSharedState {
  cohorts: Record<string, string> | undefined;
}

const cohortsSharedState: MemberCohortsSharedState = {
  cohorts: undefined,
};

const makeCohorts = (
  memberData: MemberCohortsFragment | undefined,
): MemberCohortsSharedState => {
  return {
    cohorts: memberData?.cohorts?.userCohortPersonalProductivity
      ? {
          userCohortPersonalProductivity:
            memberData?.cohorts?.userCohortPersonalProductivity,
        }
      : undefined,
  };
};

const memberCohortsSharedState =
  new PersistentSharedState<MemberCohortsSharedState>(cohortsSharedState, {
    storageKey: () => `memberCohorts-${getMemberId() || 'anonymous'}`,
  });

export const useCachedMemberCohorts: (
  trelloMemberId: string,
) => MemberCohortsSharedState = (trelloMemberId) => {
  const { data: cohortsData, complete: isCohortDataLoaded } =
    useMemberCohortsFragment({
      from: { id: trelloMemberId },
    });

  const [cohortsState, setMemberCohorts] = useSharedState(
    memberCohortsSharedState,
  );

  useEffect(() => {
    if (!isCohortDataLoaded) {
      return;
    }

    const fetchedCohorts = makeCohorts(cohortsData);
    if (!deepEqual(cohortsState, fetchedCohorts)) {
      setMemberCohorts(fetchedCohorts);
    }
  }, [isCohortDataLoaded, cohortsData, setMemberCohorts, cohortsState]);

  if (!isCohortDataLoaded) {
    return cohortsState;
  }

  return makeCohorts(cohortsData);
};
