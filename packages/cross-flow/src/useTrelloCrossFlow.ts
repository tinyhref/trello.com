import { useCallback, useMemo } from 'react';

import { useCrossFlow } from '@atlassiansox/cross-flow-support/trello';
import { Analytics } from '@trello/atlassian-analytics';
import { useFeatureGate } from '@trello/feature-gate-client';
import { useHasValidAaSession } from '@trello/heartbeat/session';

import { useCrossFlowForAllUsersExperience } from './experimental/useCrossFlowForAllUsersExperience';
import {
  useCrossFlowForDeFactoBandits,
  type CrossFlowForDefactoBanditsExperimentVariations,
} from './experimental/useCrossFlowForDeFactoBandits';
import { useCrossFlowForFreeExistingUsersExperience } from './experimental/useCrossFlowForFreeExistingUsersExperience';
import { useCrossFlowForNewUserExperience } from './experimental/useCrossFlowForNewUserExperience';
import { useCrossFlowForOnboardingUserExperience } from './experimental/useCrossFlowForOnboardingUserExperience';
import { useCrossFlowForPaidUsersExperience } from './experimental/useCrossFlowForPaidUsersExperience';
import type { TouchpointSourceType } from './TouchpointSourceType';
import {
  trelloCrossFlowOpen,
  type TrelloCrossFlow,
  type TrelloCrossFlowOptions,
} from './TrelloCrossFlow';

/**
 * Union type of all possible variations for crossFlow experiments
 */
export type ExperimentVariations =
  TrelloCrossFlow<CrossFlowForDefactoBanditsExperimentVariations>;

export const useTrelloCrossFlow = (
  source: TouchpointSourceType,
  {
    workspaceId,
    boardId,
    isNewTrelloUser,
    jiraTemplateId,
    shouldSkipMarketingPage,
    interactionName,
  }: TrelloCrossFlowOptions = {},
): ExperimentVariations => {
  const crossFlow = useCrossFlow();

  const [hasValidAaSession] = useHasValidAaSession();

  const analyticsContainers = useMemo(
    () => ({
      organization: {
        id: workspaceId,
      },
      board: {
        id: boardId,
      },
    }),
    [workspaceId, boardId],
  );

  const { value: doSendOperationalEvent } = useFeatureGate(
    'trello_xf_experiment_analytics_toggle',
  );

  const sendOperationalEvent = useCallback(
    (operationalEventFn: () => void) => {
      if (doSendOperationalEvent) {
        operationalEventFn();
      }
    },
    [doSendOperationalEvent],
  );

  const crossFlowForDeFactoBandits = useCrossFlowForDeFactoBandits({
    source,
    workspaceId,
    hasValidAaSession,
  });

  /**
   * Hooks for productionized experiences
   *
   */
  const crossFlowForNewUserExperience = useCrossFlowForNewUserExperience({
    source,
    workspaceId,
    boardId,
    hasValidAaSession,
    jiraTemplateId,
  });

  const crossFlowForOnboardingUserExperience =
    useCrossFlowForOnboardingUserExperience({ hasValidAaSession, source });

  const defaultPaidUsersCrossFlowExperience =
    useCrossFlowForPaidUsersExperience({
      source,
      workspaceId,
      boardId,
      hasValidAaSession,
      jiraTemplateId,
    });

  const defaultFreeExistingUsersCrossFlowExperience =
    useCrossFlowForFreeExistingUsersExperience({
      source,
      workspaceId,
      boardId,
      hasValidAaSession,
      jiraTemplateId,
    });

  const defaultAllUsersCrossFlowExperience = useCrossFlowForAllUsersExperience({
    source,
    workspaceId,
    boardId,
    hasValidAaSession,
    jiraTemplateId,
  });

  const trelloCrossFlow = {
    open: trelloCrossFlowOpen(crossFlow, source, [], hasValidAaSession, {
      workspaceId,
      boardId,
      isNewTrelloUser,
      shouldSkipMarketingPage,
      interactionName,
    }),
    getIsTargeted: () =>
      crossFlowForDeFactoBandits.getIsTargeted() ||
      defaultPaidUsersCrossFlowExperience.getIsTargeted() ||
      defaultFreeExistingUsersCrossFlowExperience.getIsTargeted() ||
      crossFlowForOnboardingUserExperience.getIsTargeted() ||
      crossFlowForNewUserExperience.getIsTargeted() ||
      defaultAllUsersCrossFlowExperience.getIsTargeted(),
    getExperimentCohort: () => null,
    isEligible: false,
  };

  const { value: isDiscoveryAdExperienceEnabled } = useFeatureGate(
    'trello_xf_discovery_ads_control',
  );

  // Return early if crossFlow is disabled (missing context provider, incompatible version...)
  if (!crossFlow.isEnabled || !isDiscoveryAdExperienceEnabled) {
    return trelloCrossFlow;
  }

  // Check if the current source is eligible for the de facto bandits experiment
  if (crossFlowForDeFactoBandits.isEligible) {
    sendOperationalEvent(() => {
      Analytics.sendOperationalEvent({
        action: 'enrolled',
        actionSubject: 'crossFlowExperiment',
        source,
        containers: analyticsContainers,
        attributes: {
          experiment: 'crossFlowForDeFactoBandits',
        },
      });
    });
    return crossFlowForDeFactoBandits;
  }

  if (defaultPaidUsersCrossFlowExperience.isEligible) {
    sendOperationalEvent(() => {
      Analytics.sendOperationalEvent({
        action: 'served',
        actionSubject: 'crossFlowExperience',
        source,
        containers: analyticsContainers,
        attributes: {
          experience: defaultPaidUsersCrossFlowExperience.experience,
          cohortType: 'dynamic',
        },
      });
    });

    return {
      ...defaultPaidUsersCrossFlowExperience,
      getExperimentCohort: () => null,
    };
  }

  if (defaultFreeExistingUsersCrossFlowExperience.isEligible) {
    sendOperationalEvent(() => {
      Analytics.sendOperationalEvent({
        action: 'served',
        actionSubject: 'crossFlowExperience',
        source,
        containers: analyticsContainers,
        attributes: {
          experience: defaultFreeExistingUsersCrossFlowExperience.experience,
          cohortType: 'dynamic',
        },
      });
    });

    return {
      ...defaultFreeExistingUsersCrossFlowExperience,
      getExperimentCohort: () => null,
    };
  }

  if (crossFlowForNewUserExperience.isEligible) {
    sendOperationalEvent(() => {
      Analytics.sendOperationalEvent({
        action: 'served',
        actionSubject: 'crossFlowExperience',
        source,
        containers: analyticsContainers,
        attributes: {
          experience: crossFlowForNewUserExperience.experience,
          cohortType: 'dynamic',
        },
      });
    });
    return {
      ...crossFlowForNewUserExperience,
      getExperimentCohort: () => null,
    };
  }

  if (crossFlowForOnboardingUserExperience.isEligible) {
    sendOperationalEvent(() => {
      Analytics.sendOperationalEvent({
        action: 'served',
        actionSubject: 'crossFlowExperience',
        source,
        containers: analyticsContainers,
        attributes: {
          experience: crossFlowForOnboardingUserExperience.experience,
          cohortType: 'dynamic',
        },
      });
    });

    return {
      ...crossFlowForOnboardingUserExperience,
      getExperimentCohort: () => null,
    };
  }

  if (defaultAllUsersCrossFlowExperience.isEligible) {
    sendOperationalEvent(() => {
      Analytics.sendOperationalEvent({
        action: 'served',
        actionSubject: 'crossFlowExperience',
        source,
        containers: analyticsContainers,
        attributes: {
          experience: defaultAllUsersCrossFlowExperience.experience,
          cohortType: 'dynamic',
        },
      });
    });

    return {
      ...defaultAllUsersCrossFlowExperience,
      getExperimentCohort: () => null,
    };
  }
  return trelloCrossFlow;
};
