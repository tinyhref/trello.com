import { isBefore } from 'date-fns';

import type { SourceType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';
import type { Credit } from '@trello/business-logic/organization';
import { idToDate } from '@trello/dates';
import { getNetworkError } from '@trello/graphql-error-handling';
import { intl } from '@trello/i18n';
import { getScreenFromUrl } from '@trello/marketing-screens';
import type { Organization } from '@trello/model-types';
import { showFlag } from '@trello/nachos/experimental-flags';
import { useMemberInboxIds } from '@trello/personal-workspace';

import { type EligibleWorkspaceToUpgrade } from 'app/src/components/SelectWorkspaceToUpgrade';
import { useAddFreeTrialCreditMutation } from 'app/src/components/UpgradePrompts/AddFreeTrialCreditMutation.generated';
import { FreeTrialTeamBillingStatementsDocument } from './FreeTrialTeamBillingStatementsQuery.generated';
import { PersonalWorkspacePremiumFeaturesDocument } from './PersonalWorkspacePremiumFeaturesQuery.generated';

// The most recent GTM date we reset Free Trials.
// Ensure parity with server's addFreeTrial method
export const FREE_TRIAL_RESET_DATE = new Date('2025-03-20T14:00:00+0000');

type StartFreeTrialForOrg = [
  (options: StartFreeTrialForOrgOptions, source?: SourceType) => Promise<void>,
  { loading: boolean },
];

export type FreeTrialVia =
  | 'email-verification'
  | 'in-app'
  | 'mobile'
  | 'reverse-trial'
  | 'teamify-migration'
  | 'teamify-wizard';

interface StartFreeTrialForOrgOptions {
  count?: number;
  organization: Pick<Organization, 'id'> & {
    credits?: Pick<Credit, 'id' | 'type'>[];
  };
  via?: FreeTrialVia;
}

export const hasAlreadyUsedTrial = (credits: Pick<Credit, 'id' | 'type'>[]) =>
  credits.some((credit) => {
    return (
      credit.type === 'freeTrial' &&
      // if the free trial happened before the most recent reset date, we'll
      // allow them to start a new one.  we reset free trials at various points
      // to allow users to try out the product again
      !isBefore(idToDate(credit.id), FREE_TRIAL_RESET_DATE)
    );
  });

export const isEligibleForTrial = (workspace: EligibleWorkspaceToUpgrade) => {
  return !hasAlreadyUsedTrial(workspace.credits ?? []);
};

export const useStartFreeTrialForOrg = (): StartFreeTrialForOrg => {
  const { idOrganization: personalWorkspaceId } = useMemberInboxIds();

  const [addFreeTrialCredit, { loading: addingTrial }] =
    useAddFreeTrialCreditMutation();

  const startFreeTrialForOrg = async (
    { count, organization, via }: StartFreeTrialForOrgOptions,
    source?: SourceType,
  ): Promise<void> => {
    const credits = organization?.credits || [];
    const hasRecentTrial = hasAlreadyUsedTrial(credits);

    if (!organization?.id || hasRecentTrial || addingTrial) {
      return;
    }

    const trialSource = source ?? getScreenFromUrl();

    const traceId = Analytics.startTask({
      taskName: 'edit-organization/freeTrial',
      source: trialSource,
    });

    try {
      const addFreeTrialCreditVariables = {
        orgId: organization.id,
        ...(count ? { count } : {}),
        traceId,
        via,
      };
      await addFreeTrialCredit({
        variables: addFreeTrialCreditVariables,
        refetchQueries: [
          {
            query: FreeTrialTeamBillingStatementsDocument,
            variables: {
              orgId: organization.id,
            },
            context: {
              operationName: 'FreeTrialTeamBillingStatements',
              document: FreeTrialTeamBillingStatementsDocument,
            },
          },
          ...(personalWorkspaceId
            ? [
                {
                  query: PersonalWorkspacePremiumFeaturesDocument,
                  variables: {
                    id: personalWorkspaceId,
                    nodeId: `ari:cloud:trello::workspace/${personalWorkspaceId}`,
                  },
                  context: {
                    operationName: 'PersonalWorkspacePremiumFeatures',
                    document: PersonalWorkspacePremiumFeaturesDocument,
                  },
                },
              ]
            : []),
        ],
      });

      Analytics.taskSucceeded({
        taskName: 'edit-organization/freeTrial',
        traceId,
        source: trialSource,
      });

      if (source) {
        Analytics.sendTrackEvent({
          action: 'accepted',
          actionSubject: 'freeTrial',
          source,
          containers: {
            organization: {
              id: organization.id,
            },
          },
          attributes: {
            via,
            freeTrialLength: count,
          },
        });

        // Update default analytics context
        Analytics.mergeContext({
          organization: {
            paidStatus: 'bc',
          },
          workspace: {
            paidStatus: 'bc',
          },
        });
      }
    } catch (e) {
      const err = e as Error;
      /**
       * Server only sends this error message when the workspace has already
       * started the free trial, and we attempt to start it again.
       *
       * In which case, we don't show the user the error flag
       * since it would cause confusion.
       */
      if (!/Cannot redeem free trial on this team/.test(err.message)) {
        showFlag({
          id: 'useFreeTrialEligibilityRules',
          title: intl.formatMessage({
            id: 'alerts.something-went-wrong',
            defaultMessage: 'Something went wrong',
            description: 'Something went wrong',
          }),
          appearance: 'error',
          msTimeout: 5000,
        });

        const networkError = getNetworkError(e);

        Analytics.taskFailed({
          error: e,
          taskName: 'edit-organization/freeTrial',
          traceId,
          source: trialSource,
        });

        let errorMessage = 'unknown';
        if (networkError?.message) {
          errorMessage = networkError.message;
        } else if (e instanceof Error) {
          errorMessage = e.message;
        }

        if (source) {
          Analytics.sendOperationalEvent({
            action: 'errored',
            actionSubject: 'freeTrial',
            source,
            attributes: {
              errorMessage,
              errorCode: networkError?.code,
            },
          });
        }
      }
    }
  };

  return [startFreeTrialForOrg, { loading: addingTrial }];
};
