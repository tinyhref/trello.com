import { Fragment, useMemo, type FunctionComponent } from 'react';

import { isMemberLoggedIn, useMemberId } from '@trello/authentication';
import type { ProductId } from '@trello/paid-account';
import { Products } from '@trello/paid-account';

import { useFreeTrialEligibilityRules } from 'app/src/components/FreeTrial/useFreeTrialEligibilityRules';
import { LoadingSpinner } from 'app/src/components/LoadingSpinner/LoadingSpinner';
import { useNuSkuListPriceQuotesQuery } from 'app/src/components/WorkspaceBillingView/NuSkuListPriceQuotesQuery.generated';
import { useNuSkuTeamBillingViewQuery } from 'app/src/components/WorkspaceBillingView/NuSkuTeamBillingViewQuery.generated';
import { PlanDetails } from '../index';
import { PlanComparisonContext } from '../PlanComparisonContext';
import { usePricingTierQuery } from '../usePricingTierQuery';

export interface EndOfTrialFrictionPlanComparisonModalProps {
  workspaceId: string;
  onChooseFree: () => void;
  onChooseStandard: () => void;
  onKeepPremium: () => void;
}

export const EndOfTrialFrictionPlanComparisonModal: FunctionComponent<
  EndOfTrialFrictionPlanComparisonModalProps
> = ({ workspaceId, onChooseFree, onChooseStandard, onKeepPremium }) => {
  const pricingTierQuery = usePricingTierQuery(workspaceId);
  const billingQuote = pricingTierQuery?.billingQuote;
  const premiumYearly = Products.Organization.Premium.current.yearly;
  const memberId = useMemberId();
  const { data } = useNuSkuTeamBillingViewQuery({
    variables: {
      memberId,
      orgId: workspaceId,
    },
    skip: !isMemberLoggedIn(),
    waitOn: ['MemberHeader', 'MemberBoards'],
  });
  const { isEligible: isEligibleForTrial } =
    useFreeTrialEligibilityRules(workspaceId);
  const workspace = data?.organization;
  // the workspace should not have an active subscription so we use the previous subscription to get the product code
  const productCode = workspace?.paidAccount?.previousSubscription
    ?.ixSubscriptionProductId as ProductId;
  const workspaceName = (
    <Fragment key={workspace?.displayName}>{workspace?.displayName}</Fragment>
  );
  const { data: listPriceData, loading: isLoadingListPrice } =
    useNuSkuListPriceQuotesQuery({
      variables: {
        orgId: workspaceId,
        product: productCode || premiumYearly,
      },
      waitOn: ['None'],
    });

  const context = useMemo(
    () => ({
      variation: 'end-of-trial-friction-overlay' as const,
      onChooseFree,
      onChooseStandard,
      onChoosePremium: onKeepPremium,
      billingQuote,
    }),
    [billingQuote, onChooseFree, onChooseStandard, onKeepPremium],
  );

  if (isLoadingListPrice) {
    return <LoadingSpinner />;
  }
  const numOfMembers =
    listPriceData?.newSubscriptionListPriceQuotes?.base.annual?.cTeamMembers;
  const dtPricingAdjustmentExpiration =
    listPriceData?.newSubscriptionListPriceQuotes?.subscriber?.annual
      ?.dtPricingAdjustmentExpiration;

  return (
    <PlanComparisonContext.Provider value={context}>
      <PlanDetails
        teamId={workspaceId}
        productCode={productCode}
        numOfMembers={numOfMembers || 0}
        teamDisplayName={workspaceName}
        teamName={workspace?.name || ''}
        isEligibleForTrial={Boolean(isEligibleForTrial)}
        dtPricingAdjustmentExpiration={dtPricingAdjustmentExpiration}
        viaEndOfTrialFriction={true}
      />
    </PlanComparisonContext.Provider>
  );
};
