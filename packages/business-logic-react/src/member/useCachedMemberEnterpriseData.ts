import { useEffect } from 'react';

import { getMemberId } from '@trello/authentication';
import {
  getEnterpriseData,
  type EnterpriseData,
} from '@trello/business-logic/member';
import { deepEqual } from '@trello/objects';
import { PersistentSharedState, useSharedState } from '@trello/shared-state';

import { useMemberEnterprisesDataFragment } from './MemberEnterprisesDataFragment.generated';

export type MemberEnterpriseDataSharedState = EnterpriseData;

const enterpriseDataSharedState: MemberEnterpriseDataSharedState = {
  idEnterprise: undefined,
  idEnterprises: [],
  inEnterprise: undefined,
  inRealEnterprise: undefined,
  hasEnterpriseDomain: undefined,
};

// We version the key so that stale web versions do not try to write values
// with an old data shape to local storage.
// Please update this value when MemberEnterpriseDataSharedState type definition changes.
const version = 'f5e89a12fa7aa1a021f6fc50c7014c9bd4db058d';

const memberIdEnterprisesSharedState =
  new PersistentSharedState<MemberEnterpriseDataSharedState>(
    enterpriseDataSharedState,
    {
      storageKey: () =>
        `memberEnterpriseData-${getMemberId() || 'anonymous'}-${version}`,
      syncAcrossBrowser: false,
    },
  );

/**
 * Hook that provides cached member enterprise data
 * @param trelloMemberId - The ID of the Trello member
 * @returns The member's enterprise data
 */
export const useCachedMemberEnterpriseData: (
  trelloMemberId: string,
) => MemberEnterpriseDataSharedState = (trelloMemberId) => {
  const { data: memberData, complete: isMemberDataLoaded } =
    useMemberEnterprisesDataFragment({
      from: { id: trelloMemberId },
    });

  const [enterprisesState, setMemberEnterpriseData] = useSharedState(
    memberIdEnterprisesSharedState,
  );

  useEffect(() => {
    if (!isMemberDataLoaded) {
      return;
    }

    const fetchedEnterpriseData = getEnterpriseData(memberData);
    if (!deepEqual(enterprisesState, fetchedEnterpriseData)) {
      setMemberEnterpriseData(fetchedEnterpriseData);
    }
  }, [
    enterprisesState,
    isMemberDataLoaded,
    memberData,
    setMemberEnterpriseData,
  ]);

  if (!isMemberDataLoaded) {
    return enterprisesState;
  }

  return getEnterpriseData(memberData);
};
