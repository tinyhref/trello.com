import type { FunctionComponent, ReactNode } from 'react';
import { useContext } from 'react';

import { Analytics } from '@trello/atlassian-analytics';

import { EnterprisePlanCard } from './PlanCards/EnterprisePlanCard';
import { FreePlanCard } from './PlanCards/FreePlanCard';
import { PremiumPlanCard } from './PlanCards/PremiumPlanCard';
import { StandardPlanCard } from './PlanCards/StandardPlanCard';
import { FeatureCards } from './FeatureCards';
import type { FeatureItem } from './getFeatures';
import { getPersonalProductivityFeatures } from './getPersonalProductivityFeatures';
import { PlanComparisonContext } from './PlanComparisonContext';
import { useMonetizationMessagingRefreshFeatures } from './useMonetizationMessagingRefreshFeatures';

interface OwnProps {
  isEligibleForTrial: boolean;
  isMonthly: boolean;
  numOfMembers?: number;
  teamId: string;
  teamDisplayName: ReactNode;
  teamName: string;
  onShowFreeTrialModal: (planName: string) => void;
  showRefreshedMessage?: boolean;
}

export const PlanComparisonCards: FunctionComponent<OwnProps> = ({
  isEligibleForTrial,
  isMonthly,
  numOfMembers,
  teamName,
  teamDisplayName,
  teamId,
  onShowFreeTrialModal,
  showRefreshedMessage = false,
}) => {
  const { billingQuote } = useContext(PlanComparisonContext);
  const personalProductivityFeatures = getPersonalProductivityFeatures();
  const monetizationMessagingRefreshFeatures =
    useMonetizationMessagingRefreshFeatures();

  const featuresToDisplay = showRefreshedMessage
    ? monetizationMessagingRefreshFeatures
    : personalProductivityFeatures;

  const sendAnalytics = (name: string) => {
    Analytics.sendClickedButtonEvent({
      buttonName:
        name === 'standard' ? 'upgradeToStandardButton' : 'upgradeToBCButton',
      source: 'planComparisonSection',
      containers: {
        organization: {
          id: teamId,
        },
      },
    });
  };
  return (
    <article>
      <div>
        <FreePlanCard showRefreshedMessage={showRefreshedMessage} />
        <StandardPlanCard
          onShowFreeTrialModal={onShowFreeTrialModal}
          isMonthly={isMonthly}
          prices={billingQuote?.standardPrices}
          numOfMembers={numOfMembers}
          teamDisplayName={teamDisplayName}
          teamName={teamName}
          sendAnalytics={sendAnalytics}
          showRefreshedMessage={showRefreshedMessage}
        />
        <PremiumPlanCard
          onShowFreeTrialModal={onShowFreeTrialModal}
          isMonthly={isMonthly}
          prices={billingQuote?.businessPrices}
          isEligibleForTrial={isEligibleForTrial}
          numOfMembers={numOfMembers}
          teamDisplayName={teamDisplayName}
          teamName={teamName}
          sendAnalytics={sendAnalytics}
          showRefreshedMessage={showRefreshedMessage}
        />
        <EnterprisePlanCard showRefreshedMessage={showRefreshedMessage} />
      </div>
      <div>
        {featuresToDisplay.map(
          ({
            key,
            featureName,
            featureIcon,
            free,
            standard,
            business,
            enterprise,
            toolTipTxt,
          }: FeatureItem) => {
            return (
              <FeatureCards
                key={key}
                cardKey={key}
                featureName={featureName}
                featureIcon={featureIcon}
                free={free}
                standard={standard}
                business={business}
                enterprise={enterprise}
                toolTipTxt={toolTipTxt}
              />
            );
          },
        )}
      </div>
    </article>
  );
};
