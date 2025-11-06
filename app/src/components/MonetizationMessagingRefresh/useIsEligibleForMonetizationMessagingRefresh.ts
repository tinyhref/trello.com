import { useEffect, useState } from 'react';

import type { SourceType } from '@trello/analytics-types';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { Entitlements } from '@trello/entitlements';
import { useGetExperimentValue } from '@trello/feature-gate-client';

import { useMonetizationWorkspaceOfferingFragment } from './MonetizationWorkspaceOfferingFragment.generated';

export const useIsEligibleForMonetizationMessagingRefresh = ({
  workspaceId,
  source,
}: {
  workspaceId: string;
  source: SourceType;
}) => {
  const [fireExposureEvent, setFireExposureEvent] = useState(false);
  const { cohort } = useGetExperimentValue({
    experimentName: 'ghost_monetization_messaging',
    parameter: 'cohort',
    fireExposureEvent,
  });

  const { data: workspaceData } = useMonetizationWorkspaceOfferingFragment({
    from: { id: workspaceId },
  });

  const hasNotExpiredTrial =
    workspaceData?.paidAccount?.trialType === 'freeTrial' &&
    workspaceData?.paidAccount?.trialExpiration &&
    new Date(workspaceData.paidAccount.trialExpiration) > new Date();

  const hasNonTrialPremium =
    Entitlements.isPremium(workspaceData?.offering) && !hasNotExpiredTrial;

  const isEligibleWorkspace =
    !!workspaceData?.offering &&
    !Entitlements.isEnterprise(workspaceData.offering) &&
    !hasNonTrialPremium;

  useEffect(() => {
    if (
      isEligibleWorkspace &&
      !fireExposureEvent &&
      cohort !== 'not-enrolled'
    ) {
      Analytics.sendOperationalEvent({
        action: 'enrolled',
        actionSubject: 'monetizationMessagingRefresh',
        source,
        containers: formatContainers({
          workspaceId,
        }),
      });
      setFireExposureEvent(true);
    }
  }, [isEligibleWorkspace, fireExposureEvent, source, workspaceId, cohort]);

  return {
    isEligibleWorkspaceForRefresh:
      isEligibleWorkspace && cohort === 'experiment',
  };
};
