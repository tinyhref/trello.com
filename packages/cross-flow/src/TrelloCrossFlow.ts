import type {
  CrossFlowInteractedUIActionSubjectIDs,
  CrossFlowViewedUIActionSubjectIDs,
} from '@atlassian/surface-analytics-specs';
import type {
  CompletionStatus,
  CrossFlowContextType,
  Options,
} from '@atlassiansox/cross-flow-support';
import { isDesktop } from '@trello/browser';
import type { FeatureExperimentKeys } from '@trello/feature-gates';
import { TrelloStorage } from '@trello/storage';

import { isCrossFlowIFrameOpenState } from './experimental/isCrossFlowIFrameOpenState';
import type { CrossFlowExperience } from './experimental/isSourceTargetedByExperience';
import type { EligibleWorkspaceOptions } from './experimental/useEligibleWorkspacesForProvisioning';
import { AUTO_OPEN_CFFE_STORAGE_KEY } from './crossFlowEssentials';
import type { JiraTemplateIdType } from './JiraTemplateId.types';
import type {
  AdTouchpointSourceType,
  CrossFlowPostOfficePlacementSourceType,
} from './TouchpointSourceType';

export interface TrelloCrossFlowOptions {
  workspaceId?: string;
  boardId?: string;
  enterpriseId?: string;
  isNewTrelloUser?: boolean;
  eligibleWorkspaceOptions?: EligibleWorkspaceOptions;
  shouldSkipMarketingPage?: boolean;
  jiraTemplateId?: JiraTemplateIdType;
  hideWorkspaceSelector?: boolean;
  isEnterpriseSelfServe?: boolean;
  isJiraPremiumTrial?: boolean;
  interactionName?: CrossFlowInteractedUIActionSubjectIDs;
}

export interface TrelloCrossFlow<T> {
  open: (
    options?: Options,
    overrideOptions?: TrelloCrossFlowOptions,
  ) => Promise<CompletionStatus | undefined>;
  /**
   * getIsTargeted returns whether the user is targeted, but does not necessarily mean anything about eligibility.
   * Targeted users may then be checked under more criteria and possibly allocated to a not enrolled cohort.
   */
  getIsTargeted: () => boolean;
  /**
   * Returns the experiment cohort after all runtime criteria have been checked.
   * May return null or the not enrolled variation if the user is not enrolled in the experiment.
   * Emits an exposure event for the user and their cohort if the user is enrolled in the experiment.
   */
  getExperimentCohort: () => T | null;

  /**
   * Returns the name of the experiment being used.
   * May return undefined if the user is not enrolled in any experiment(s).
   */
  experimentName?: FeatureExperimentKeys;

  /**
   * Returns whether the user is eligible to receive a crossflow experience. This has no implications about enrollment in any experiment.
   */
  isEligible: boolean;

  /**
   * Returns one of the productionized experiences the user is targeted for.
   */
  experience?: CrossFlowExperience;
}

export const trelloCrossFlowOpen = (
  crossflow: CrossFlowContextType,
  source: AdTouchpointSourceType | CrossFlowPostOfficePlacementSourceType,
  eligibleWorkspaceOptions: EligibleWorkspaceOptions,
  hasValidAaSession: boolean,
  crossflowOptions: TrelloCrossFlowOptions = {},
) => {
  return async (
    options?: Options,
    overrideOptions?: TrelloCrossFlowOptions,
  ) => {
    // Disable crossFlow on desktop due to compliance risks
    if (isDesktop()) {
      return;
    }

    if (!crossflow.isEnabled) {
      return;
    }

    // Redirect to login if AA session is invalid
    if (!hasValidAaSession) {
      const queryParams = `?returnUrl=${encodeURIComponent(
        window.location.pathname + window.location.search,
      )}`;

      //Set source value in local storage to auto open CFFE on return from login
      TrelloStorage.set(AUTO_OPEN_CFFE_STORAGE_KEY, source);

      window.location.assign(`/login${queryParams}`);
      return;
    }

    // Deconstruct crossflow options whilst allowing for runtime overrides
    const {
      workspaceId,
      boardId,
      isNewTrelloUser,
      shouldSkipMarketingPage,
      jiraTemplateId,
      hideWorkspaceSelector,
      interactionName,
    } = { ...crossflowOptions, ...overrideOptions };

    // Take override workspace options over the initial parameter
    eligibleWorkspaceOptions = overrideOptions?.eligibleWorkspaceOptions
      ? overrideOptions?.eligibleWorkspaceOptions
      : eligibleWorkspaceOptions;

    isCrossFlowIFrameOpenState.setValue(true);

    const targetProduct = 'jira-software.ondemand';

    const getOverrideOptionsForExperiment = async (): Promise<object> => {
      if (source === 'welcomeTaskSelectionScreen') {
        return {
          shouldSkipMarketingPage: true,
          siteCreationOptions: {
            trello_xf_site_creation_copy_change: 'experiment',
          },
        };
      }

      return {};
    };

    const response = await crossflow.apiV1.open({
      v1: true,
      targetProduct,
      journey: 'get-started',
      // Remove type casting once all touchpoints have been implemented in registry
      sourceComponent: source as CrossFlowViewedUIActionSubjectIDs,
      sourceContext: (interactionName ||
        'get-started') as CrossFlowInteractedUIActionSubjectIDs,
      experimentalOptions: {
        trelloWorkspaceId: workspaceId || null,
        trelloWorkspaceOptions: eligibleWorkspaceOptions,
        trelloBoardId: boardId || null,
        isNewTrelloUser: isNewTrelloUser || false,
        shouldSkipMarketingPage: shouldSkipMarketingPage || false,
        jiraTemplateId: jiraTemplateId || '',
        hideWorkspaceSelector: hideWorkspaceSelector || false,
        isEnterpriseSelfServe: crossflowOptions?.isEnterpriseSelfServe || false,
        isJiraPremiumTrial: crossflowOptions?.isJiraPremiumTrial || false,
        ...(await getOverrideOptionsForExperiment()),
      },
    });

    isCrossFlowIFrameOpenState.setValue(false);
    return response;
  };
};
