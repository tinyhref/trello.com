import { useEffect, useRef, useState } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import {
  TRELLO_JIRA_CONF_CO_USERS,
  TRELLO_VNEXT_JIRA_CONF_CO_USERS,
  useUserTrait,
} from '@trello/atlassian-personalization';
import { getAaId, useMemberId } from '@trello/authentication';
import { getDateBefore, idToDate } from '@trello/dates';
import { useFeatureGate } from '@trello/feature-gate-client';

import { getAccessibleProducts } from '../../getAccessibleProducts';
import type { RuntimeEligibilityCheckResult } from './RuntimeEligibilityCheck';
import { useIsCrossFlowMemberConfirmed } from './useIsCrossFlowMemberConfirmed';

let hasSentPersonalizationLoadedAnalyticsEvent = false;

// Export for testing
export const setHasSentPersonalizationLoadedAnalyticsEvent = (
  value: boolean,
) => {
  hasSentPersonalizationLoadedAnalyticsEvent = value;
};

export const getHasSentPersonalizationLoadedAnalyticsEvent = () =>
  hasSentPersonalizationLoadedAnalyticsEvent;

export const useHasNoAvailableSites = ({
  doLoadAvailableSites,
}: {
  doLoadAvailableSites: boolean;
}): RuntimeEligibilityCheckResult => {
  const isLoadingAvailableSites = useRef(false);

  const [hasNoAvailableSites, setHasNoAvailableSites] = useState(false);

  const { isEligible: isMemberConfirmed } = useIsCrossFlowMemberConfirmed();
  const memberId = useMemberId();
  const aaId = getAaId();
  const isNewUser = idToDate(memberId) > getDateBefore({ days: 2 });

  const { value: isJiraConfCoUsageVNextTraitEnabled } = useFeatureGate(
    'ghost_trello_jira_conf_co_usage_trait_vnext',
  );

  const { value: isJiraConfCoUserTrait, loading: jiraConfCoUserTraitLoading } =
    useUserTrait(TRELLO_JIRA_CONF_CO_USERS);

  const {
    value: isVNextJiraConfCoUserTrait,
    loading: vNextJiraConfCoUserTraitLoading,
  } = useUserTrait(TRELLO_VNEXT_JIRA_CONF_CO_USERS);

  useEffect(() => {
    if (
      vNextJiraConfCoUserTraitLoading ||
      jiraConfCoUserTraitLoading ||
      !isJiraConfCoUsageVNextTraitEnabled ||
      hasSentPersonalizationLoadedAnalyticsEvent
    ) {
      return;
    }
    hasSentPersonalizationLoadedAnalyticsEvent = true;
    Analytics.sendOperationalEvent({
      action: 'loaded',
      actionSubject: 'personalization',
      actionSubjectId: 'jiraConfCoUserTrait',
      source: 'crossFlowAvailableSites',
      attributes: {
        isVNextJiraConfCoUserTrait,
        isJiraConfCoUserTrait,
      },
    });
  }, [
    isJiraConfCoUserTrait,
    isJiraConfCoUsageVNextTraitEnabled,
    isVNextJiraConfCoUserTrait,
    jiraConfCoUserTraitLoading,
    vNextJiraConfCoUserTraitLoading,
  ]);

  useEffect(() => {
    const loadSiteEligibility = async () => {
      try {
        isLoadingAvailableSites.current = true;
        const { products } = await getAccessibleProducts();
        const hasNoSites =
          products?.length > 0 &&
          products?.filter(({ productId }) => productId !== 'trello').length ===
            0;
        setHasNoAvailableSites(hasNoSites);
      } finally {
        isLoadingAvailableSites.current = false;
      }
    };

    // if the user isn't confirmed, they won't have any sites
    if (!isMemberConfirmed) {
      setHasNoAvailableSites(true);
      return;
    }

    if (!isNewUser) {
      if (!aaId) {
        setHasNoAvailableSites(true);
      } else if (!jiraConfCoUserTraitLoading) {
        setHasNoAvailableSites(!isJiraConfCoUserTrait);
      }
    } else {
      if (doLoadAvailableSites && !isLoadingAvailableSites.current) {
        loadSiteEligibility();
      }
    }
  }, [
    doLoadAvailableSites,
    isMemberConfirmed,
    isNewUser,
    aaId,
    memberId,
    isJiraConfCoUserTrait,
    jiraConfCoUserTraitLoading,
  ]);

  return {
    isEligible: hasNoAvailableSites,
  };
};
