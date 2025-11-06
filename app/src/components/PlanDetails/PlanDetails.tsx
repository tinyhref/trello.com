/* eslint-disable formatjs/enforce-description */
import debounce from 'debounce';
import type { FunctionComponent, ReactNode } from 'react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import type { ObservedSize } from 'use-resize-observer';
import useResizeObserver from 'use-resize-observer';

import { Analytics } from '@trello/atlassian-analytics';
import { intl } from '@trello/i18n';
import { ProductFeatures } from '@trello/paid-account';

import { PlanSelectionOverlay } from 'app/src/components/FreeTrial';
import { useIsEligibleForMonetizationMessagingRefresh } from 'app/src/components/MonetizationMessagingRefresh';
import { WorkspacePageHeader } from 'app/src/components/WorkspacePages/WorkspacePageHeader';
import { BillingCycleToggle } from './BillingCycleToggle';
import { NuSkuBillingStatusBanner } from './NuSkuBillingStatusBanner';
import { PlanComparison } from './PlanComparison';
import { PlanComparisonCards } from './PlanComparisonCards';
import { PlanComparisonContext } from './PlanComparisonContext';

import * as styles from './PlanDetails.module.less';

interface OwnProps {
  isEligibleForTrial: boolean;
  numOfMembers?: number;
  productCode: number;
  teamId: string;
  teamDisplayName: ReactNode;
  teamName: string;
  dtPricingAdjustmentExpiration: string | null | undefined;
  viaEndOfTrialFriction?: boolean;
}

export const PlanDetails: FunctionComponent<OwnProps> = ({
  isEligibleForTrial,
  numOfMembers,
  productCode,
  teamId,
  teamName,
  teamDisplayName,
  dtPricingAdjustmentExpiration,
  viaEndOfTrialFriction,
}) => {
  const isProductMonthly = ProductFeatures.isMonthly(productCode);
  const DEFAULT_WIDTH = 700;
  const [width, setWidth] = useState<number>(DEFAULT_WIDTH);

  const { ref } = useResizeObserver({
    onResize: debounce((entry: ObservedSize) => {
      setWidth(entry.width || DEFAULT_WIDTH);
    }, 100),
  });
  const [isMonthly, setIsMonthly] = useState(isProductMonthly);
  const [showFreeTrialModal, setShowFreeTrialModal] = useState(false);
  const [freeTrialProductSource, setFreeTrialProductSource] = useState('');

  // Modal is currently only available for BC admins
  // https://trello.com/c/cjBleYUw/417-bc-to-standard-downgrade-card-1-explore-plans-button-on-bc-billing-page-opens-plan-comparison-modal
  const { variation } = useContext(PlanComparisonContext);
  const { isEligibleWorkspaceForRefresh } =
    useIsEligibleForMonetizationMessagingRefresh({
      workspaceId: teamId,
      source:
        variation === 'billing-page'
          ? 'planComparisonSection'
          : 'planComparisonModal',
    });
  if (variation === 'end-of-trial-friction-overlay' && !isMonthly) {
    // handles the edge case where the isMonthly state is set to false
    setIsMonthly(true);
  }

  useEffect(() => {
    if (!viaEndOfTrialFriction) {
      Analytics.sendViewedComponentEvent({
        componentName:
          variation === 'billing-page'
            ? 'planComparisonSection'
            : 'planComparisonModal',
        componentType: variation === 'billing-page' ? 'section' : 'modal',
        source: 'workspaceBillingScreen',
        containers: {
          organization: {
            id: teamId,
          },
        },
      });
    }
  }, [teamId, viaEndOfTrialFriction, variation]);

  useEffect(() => {
    if (viaEndOfTrialFriction) {
      Analytics.sendScreenEvent({
        name: 'trelloPlanPricingModal',
        attributes: {
          viaEndOfTrial: true,
        },
      });
    }
  }, [viaEndOfTrialFriction]);

  const onShowFreeTrialModal = (productName: string) => {
    setFreeTrialProductSource(productName);
    setShowFreeTrialModal(true);
  };

  const onClosePlanSelectionOverlay = useCallback(() => {
    setShowFreeTrialModal(false);
  }, [setShowFreeTrialModal]);

  return (
    <>
      <article className={styles.upgradeView} ref={ref}>
        {variation === 'billing-page' ? (
          <WorkspacePageHeader
            title={intl.formatMessage(
              {
                id: 'templates.billing_page_one.upgrade-trello-for-team',
                defaultMessage: 'Upgrade Trello for {teamName}',
              },
              {
                teamName: teamDisplayName,
              },
            )}
          />
        ) : (
          <h2 className={styles.header}>
            {intl.formatMessage({
              id: 'templates.billing_page_one.trello-pricing',
              defaultMessage: 'Trello pricing',
            })}
          </h2>
        )}

        <NuSkuBillingStatusBanner
          teamId={teamId}
          dtPricingAdjustmentExpiration={dtPricingAdjustmentExpiration}
        />

        {variation === 'billing-page' ? (
          <BillingCycleToggle
            isMonthly={isMonthly}
            toggleLabel={setIsMonthly}
            hasDiscount={true}
            primaryLabel={intl.formatMessage({
              id: 'templates.billing_page_one.billing-cycle',
              defaultMessage: 'Billing Cycle',
            })}
            leftLabel={intl.formatMessage({
              id: 'templates.billing_page_one.monthly',
              defaultMessage: 'Monthly',
            })}
            rightLabel={intl.formatMessage({
              id: 'templates.billing_page_one.annually',
              defaultMessage: 'Annually',
            })}
            teamId={teamId}
          />
        ) : (
          <div className={styles.ppDesc}>
            <b>
              <FormattedMessage
                id="templates.billing_page_one.trello-main-description-heading-repackaging-personal-productivity"
                defaultMessage="Your productivity powerhouse"
              />
            </b>
            <p>
              {isEligibleWorkspaceForRefresh && (
                <FormattedMessage
                  id="templates.billing_page_one.trello-main-description-monetization-refresh"
                  defaultMessage="From small to-dos to big goals, Trello helps you keep everything organized in one place—and get more done."
                />
              )}
              {!isEligibleWorkspaceForRefresh && (
                <FormattedMessage
                  id="templates.billing_page_one.trello-main-description-repackaging-personal-productivity"
                  defaultMessage="Stay organized and efficient with boards, Inbox, and Planner. Every to-do, idea, or responsibility—no matter how small—finds its place, keeping you at the top of your game."
                />
              )}
            </p>
          </div>
        )}

        {width && width >= DEFAULT_WIDTH ? (
          <PlanComparison
            teamDisplayName={teamDisplayName}
            teamName={teamName}
            teamId={teamId}
            isMonthly={isMonthly}
            isEligibleForTrial={isEligibleForTrial}
            numOfMembers={numOfMembers}
            onShowFreeTrialModal={onShowFreeTrialModal}
            showRefreshedMessage={isEligibleWorkspaceForRefresh}
          />
        ) : (
          <PlanComparisonCards
            isEligibleForTrial={isEligibleForTrial}
            isMonthly={isMonthly}
            teamDisplayName={teamDisplayName}
            teamName={teamName}
            numOfMembers={numOfMembers}
            teamId={teamId}
            onShowFreeTrialModal={onShowFreeTrialModal}
            showRefreshedMessage={isEligibleWorkspaceForRefresh}
          />
        )}
      </article>
      {showFreeTrialModal && (
        <PlanSelectionOverlay
          onClose={onClosePlanSelectionOverlay}
          orgId={teamId}
          currentPlanSelected={freeTrialProductSource}
        />
      )}
    </>
  );
};
