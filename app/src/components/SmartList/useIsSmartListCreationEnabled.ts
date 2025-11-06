import { useEffect, useState } from 'react';

import {
  ALL_TRELLO_JIRA_CO_USERS,
  useUserTrait,
} from '@trello/atlassian-personalization';
import { getAaId, useMemberId } from '@trello/authentication';
import { getDateBefore, idToDate } from '@trello/dates';
import { useDynamicConfig } from '@trello/dynamic-config';

export const useIsSmartListCreationEnabled = () => {
  const [isJiraCoUser, setIsJiraCoUser] = useState(false);
  const memberId = useMemberId();
  const aaId = getAaId();
  // Two days until new users are included in traits
  const isNewUser = idToDate(memberId) > getDateBefore({ days: 2 });
  const isInternalAtlassian = useDynamicConfig('trello_web_atlassian_team');
  const { value: isJiraCoUserTrait, loading } = useUserTrait(
    ALL_TRELLO_JIRA_CO_USERS,
  );

  useEffect(() => {
    if (!isNewUser && !loading) {
      setIsJiraCoUser(Boolean(isJiraCoUserTrait));
    }
  }, [aaId, isNewUser, isJiraCoUserTrait, loading]);

  return isJiraCoUser || isInternalAtlassian;
};
