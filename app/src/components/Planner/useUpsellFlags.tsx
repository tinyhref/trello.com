import { useCallback, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { useContextSelector } from 'use-context-selector';

import type { ActionSubjectIdType, FlagId } from '@trello/analytics-types';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { dismissFlag, showFlag } from '@trello/nachos/experimental-flags';
import { usePlannerAccounts, useWorkspaceAri } from '@trello/planner';
import type { UpsellCohortType } from '@trello/planner';
import { useSharedState } from '@trello/shared-state';
import { token } from '@trello/theme';
import { useLazyComponent } from '@trello/use-lazy-component';

import { WithEnterpriseManagedOverride } from 'app/src/components/UpgradePrompts';
import { ADSUpgradePromptButton } from 'app/src/components/UpgradePrompts/ADSUpgradePromptButton';
import { PlannerPopoverScreen } from './PlannerHeaderToolbar/CalendarsPopover/PlannerPopoverScreen';
import { canShowUpsells } from './utils/canShowUpsells';
import { hasAdvancedPlanner } from './utils/hasAdvancedPlanner';
import { openSettingsPopoverState } from './openSettingsPopoverState';
import { PlannerContext } from './PlannerContext';
import { upsellModalSharedState } from './upsellModalSharedState';
import { useCanUseMultiAccount } from './useCanUseMultiAccount';
import { useIsEligibleForPlannerFeaturesDiscovery } from './useIsEligibleForPlannerFeaturesDiscovery';
import { UpsellCohort } from './useUpsellData';

const FLAG_IDS = {
  FREE_PLANNER_UPGRADE: 'freePlannerUpgradeFlag',
  PLANNER_PAID_ACTION: 'plannerPaidAction',
  PLANNER_PAID_ACTION_DESKTOP: 'plannerPaidActionDesktop',
  PLANNER_CONNECTED: 'plannerConnected',
  PLANNER_CONNECTED_DESKTOP: 'plannerConnectedDesktop',
} as const;

/**
 * Hook for managing upsell flags and modals in the Planner component.
 * Handles different types of upgrade prompts based on user's account status.
 *
 * @param upsellCohortOverride - Optional upsell cohort to use instead of getting it from PlannerContext.
 *                              This is useful when the hook is used outside of the Planner context,
 *                              such as in the QuickCardEditor.
 * @returns Object containing functions to show different types of upsell flags and modals
 */
export const useUpsellFlags = (upsellCohortOverride?: UpsellCohortType) => {
  const { workspaceId } = useWorkspaceAri();
  const { validAccounts } = usePlannerAccounts();
  const canUseMultiAccount = useCanUseMultiAccount();
  const contextUpsellCohort = useContextSelector(
    PlannerContext,
    (value) => value.upsellCohort,
  );
  const upsellCohort = upsellCohortOverride ?? contextUpsellCohort;
  const isEligibleForPlannerFeaturesDiscovery =
    useIsEligibleForPlannerFeaturesDiscovery();

  const [, setUpsellModalState] = useSharedState(upsellModalSharedState);

  const [, setOpenSettingsPopoverScreen] = useSharedState(
    openSettingsPopoverState,
  );

  const hasShownMultiAccountUpsellFlagOnFreeAccountRef = useRef(false);

  const UpsellIcon = useLazyComponent(
    () => import(/* webpackChunkName: "upsell-icon" */ './UpsellIcon'),
    { namedImport: 'UpsellIcon' },
  );

  const trackFlagEvent = useCallback(
    (
      actionSubjectId: FlagId,
      isFreeTrial: boolean = upsellCohort === UpsellCohort.TrialAvailable,
    ) => {
      Analytics.sendUIEvent({
        action: 'viewed',
        actionSubject: 'flag',
        actionSubjectId,
        source: 'plannerScreen',
        attributes: { isFreeTrial },
        containers: formatContainers({ workspaceId }),
      });
    },
    [upsellCohort, workspaceId],
  );

  const handleActionClick = useCallback(
    (id: FlagId, buttonName?: ActionSubjectIdType) => {
      Analytics.sendClickedButtonEvent({
        buttonName: buttonName ? buttonName : id,
        attributes: {
          isFreeTrial: upsellCohort === UpsellCohort.TrialAvailable,
        },
        source: 'plannerScreen',
        containers: formatContainers({ workspaceId }),
      });
      setUpsellModalState({ showUpsellModal: true, flagId: id });
      dismissFlag({ id });
    },
    [upsellCohort, workspaceId, setUpsellModalState],
  );

  const handleManageAccountsClick = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'freePlannerUpgradeFlagManageAccountsButton',
      attributes: {
        isFreeTrial: upsellCohort === UpsellCohort.TrialAvailable,
      },
      source: 'plannerScreen',
      containers: formatContainers({ workspaceId }),
    });
    dismissFlag({ id: FLAG_IDS.FREE_PLANNER_UPGRADE });
    setOpenSettingsPopoverScreen({
      screen: PlannerPopoverScreen.ManageAccounts,
      account: null,
    });
  }, [setOpenSettingsPopoverScreen, upsellCohort, workspaceId]);

  /**
   * Shows a flag when user has multiple accounts connected but needs to upgrade
   * to keep them all active on the free plan.
   */
  const showMultiAccountUpsellFlagOnFreeAccount = useCallback(() => {
    if (hasShownMultiAccountUpsellFlagOnFreeAccountRef.current) {
      return;
    }

    if (
      canUseMultiAccount &&
      canShowUpsells(upsellCohort) &&
      validAccounts.length > 1
    ) {
      showFlag({
        id: FLAG_IDS.FREE_PLANNER_UPGRADE,
        title: (
          <FormattedMessage
            id="templates.planner.keep-multiple-accounts-connected"
            defaultMessage="Keep multiple accounts connected"
            description="Success flag message for keeping multiple accounts connected"
          />
        ),
        description: (
          <div
            style={{
              marginLeft: token('space.500', '40px'),
            }}
          >
            <FormattedMessage
              id="templates.planner.keep-multiple-accounts-connected-description"
              defaultMessage="Upgrade to keep all your accounts active. Free plan supports one at a time."
              description="Success flag description for keeping multiple accounts connected"
            />
          </div>
        ),
        appearance: 'info',
        icon: <UpsellIcon />,
        isAutoDismiss: true,
        actions: [
          {
            content: (
              <span
                style={{
                  marginLeft: token('space.500', '40px'),
                }}
              >
                <FormattedMessage
                  id="templates.planner.upgrade"
                  defaultMessage="Upgrade"
                  description="Upgrade button text"
                />
              </span>
            ),
            type: 'link',
            onClick: () =>
              handleActionClick(
                FLAG_IDS.FREE_PLANNER_UPGRADE,
                'freePlannerUpgradeFlagUpgradeButton',
              ),
          },
          {
            content: (
              <FormattedMessage
                id="templates.planner.manage-accounts"
                defaultMessage="Manage accounts"
                description="Manage accounts button text"
              />
            ),
            type: 'link',
            onClick: () => handleManageAccountsClick(),
          },
        ],
      });

      hasShownMultiAccountUpsellFlagOnFreeAccountRef.current = true;
    }
  }, [
    canUseMultiAccount,
    upsellCohort,
    validAccounts.length,
    handleActionClick,
    handleManageAccountsClick,
    UpsellIcon,
  ]);

  /**
   * Shows a flag when user tries to use paid features but doesn't have access.
   * Shows different messages based on whether upgrade is available or not.
   */
  const showPaygatingFlag = useCallback(() => {
    // isEligibleForPlannerFeaturesDiscovery being true is an impermanent state,
    // so the user will see the flags again shortly.
    if (
      hasAdvancedPlanner(upsellCohort) ||
      isEligibleForPlannerFeaturesDiscovery
    ) {
      return;
    }

    if (
      upsellCohort === UpsellCohort.UpgradeAvailableWithoutUpsell ||
      upsellCohort === UpsellCohort.NoUpgradeAvailable
    ) {
      showFlag({
        id: FLAG_IDS.PLANNER_PAID_ACTION_DESKTOP,
        title: (
          <FormattedMessage
            id="templates.planner.upsell-flag-desktop-title"
            defaultMessage="Scheduling isn’t available"
            description="Message to user explaining that the action they just performed is not available to their account"
          />
        ),
        description: (
          <FormattedMessage
            id="templates.planner.upsell-flag-desktop-description"
            defaultMessage="Scheduling focus time and to-dos isn’t available for your account."
            description="Message to user explaining that the action they just performed is not available to their account"
          />
        ),
        appearance: 'error',
      });
      trackFlagEvent(FLAG_IDS.PLANNER_PAID_ACTION_DESKTOP, false);
      return;
    }

    showFlag({
      id: FLAG_IDS.PLANNER_PAID_ACTION,
      title: (
        <FormattedMessage
          id="templates.planner.upsell-flag-title"
          defaultMessage="Upgrade to get full Planner access"
          description="Title on flag shown prompting user to upgrade their account to get full access to Planner"
        />
      ),
      description: (
        <FormattedMessage
          id="templates.planner.upsell-flag-description"
          defaultMessage="Standard and Premium plans support scheduling to-dos, creating focus time, and linking cards to events."
          description="Description of functionality available with Planner on paid plans"
        />
      ),
      appearance: 'info',
      actions: [
        {
          content: (
            <ADSUpgradePromptButton
              onClick={() => handleActionClick(FLAG_IDS.PLANNER_PAID_ACTION)}
            >
              <WithEnterpriseManagedOverride>
                {upsellCohort === UpsellCohort.TrialAvailable ? (
                  <FormattedMessage
                    id="templates.planner.try-premium-free"
                    defaultMessage="Try Premium free"
                    description="Button call-to-action to try Premium for free"
                  />
                ) : (
                  <FormattedMessage
                    id="templates.planner.view-plans"
                    defaultMessage="View plans"
                    description="Button call-to-action to view Trello's paid plans"
                  />
                )}
              </WithEnterpriseManagedOverride>
            </ADSUpgradePromptButton>
          ),
          type: 'link',
        },
      ],
    });
    trackFlagEvent(FLAG_IDS.PLANNER_PAID_ACTION);
  }, [
    handleActionClick,
    isEligibleForPlannerFeaturesDiscovery,
    upsellCohort,
    trackFlagEvent,
  ]);

  /**
   * Shows a flag when user's calendar is connected but they need to upgrade
   * to use scheduling features.
   */
  const showAuthPaygatingFlag = useCallback(() => {
    if (
      hasAdvancedPlanner(upsellCohort) ||
      isEligibleForPlannerFeaturesDiscovery
    ) {
      return;
    }

    if (
      upsellCohort === UpsellCohort.UpgradeAvailableWithoutUpsell ||
      upsellCohort === UpsellCohort.NoUpgradeAvailable
    ) {
      showFlag({
        id: FLAG_IDS.PLANNER_CONNECTED_DESKTOP,
        title: (
          <FormattedMessage
            id="templates.planner.upsell-flag-connected-title"
            defaultMessage="Your calendar is connected to Planner"
            description="Title on flag after calendar is connected to planner"
          />
        ),
        appearance: 'success',
      });
      trackFlagEvent(FLAG_IDS.PLANNER_CONNECTED_DESKTOP, false);
      return;
    }

    showFlag({
      id: FLAG_IDS.PLANNER_CONNECTED,
      title: (
        <FormattedMessage
          id="templates.planner.upsell-flag-connected-title"
          defaultMessage="Your calendar is connected to Planner"
          description="Title on flag after calendar is connected to planner"
        />
      ),
      description: (
        <FormattedMessage
          id="templates.planner.upsell-flag-connected-description"
          defaultMessage="Upgrade to Standard or Premium to schedule focus time and to-dos."
          description="Prompt to upgrade paid plans to schedule on planner"
        />
      ),
      appearance: 'success',
      actions: [
        {
          content: (
            <ADSUpgradePromptButton
              onClick={() => handleActionClick(FLAG_IDS.PLANNER_CONNECTED)}
            >
              <WithEnterpriseManagedOverride>
                {upsellCohort === UpsellCohort.TrialAvailable ? (
                  <FormattedMessage
                    id="templates.planner.try-premium-free"
                    defaultMessage="Try Premium free"
                    description="Button call-to-action to try Premium for free"
                  />
                ) : (
                  <FormattedMessage
                    id="templates.planner.view-plans"
                    defaultMessage="View plans"
                    description="Button call-to-action to view Trello's paid plans"
                  />
                )}
              </WithEnterpriseManagedOverride>
            </ADSUpgradePromptButton>
          ),
          type: 'link',
        },
      ],
    });
    trackFlagEvent(FLAG_IDS.PLANNER_CONNECTED);
  }, [
    handleActionClick,
    isEligibleForPlannerFeaturesDiscovery,
    upsellCohort,
    trackFlagEvent,
  ]);

  const showUpsellModalWithoutFlag = useCallback(() => {
    setUpsellModalState({ showUpsellModal: true, flagId: undefined });
  }, [setUpsellModalState]);

  return {
    showPaygatingFlag,
    showAuthPaygatingFlag,
    showUpsellModalWithoutFlag,
    showMultiAccountUpsellFlagOnFreeAccount,
  };
};
