import { useEffect } from 'react';

import { userType } from '@atlassiansox/analytics-web-client';
import { Analytics } from '@trello/atlassian-analytics';
import { getAaId, isMemberLoggedIn, useMemberId } from '@trello/authentication';

const setUserToAaId = (aaId: string | null) => {
  if (aaId) {
    Analytics.setUserInfo(userType.ATLASSIAN_ACCOUNT, aaId);
  } else {
    Analytics.clearUserInfo();
  }
};

const setTrelloMemberIdAttribute = (memberId: string) => {
  if (isMemberLoggedIn()) {
    Analytics.setTrelloMemberId(memberId);
  } else {
    Analytics.clearTrelloMemberId();
  }
};

export const useAnalyticsUser = (): void => {
  const memberId = useMemberId();
  const aaId = getAaId();

  useEffect(() => {
    setUserToAaId(aaId);
    setTrelloMemberIdAttribute(memberId);
  }, [aaId, memberId]);
};
