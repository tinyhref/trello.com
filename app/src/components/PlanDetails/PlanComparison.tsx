import type { FunctionComponent, ReactNode } from 'react';

import type { FeatureItem } from './getFeatures';
import { getPersonalProductivityFeatures } from './getPersonalProductivityFeatures';
import { PlanComparisonHeader as Headers } from './PlanComparisonHeader';
import { PlanComparisonRow as Rows } from './PlanComparisonRow';
import { PlanComparisonTotals } from './PlanComparisonTotals';
import { useMonetizationMessagingRefreshFeatures } from './useMonetizationMessagingRefreshFeatures';

import * as styles from './PlanComparison.module.less';

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
export const PlanComparison: FunctionComponent<OwnProps> = ({
  isEligibleForTrial,
  isMonthly,
  numOfMembers,
  teamId,
  teamDisplayName,
  teamName,
  onShowFreeTrialModal,
  showRefreshedMessage = false,
}) => {
  const personalProductivityFeatures = getPersonalProductivityFeatures();
  const monetizationMessagingRefreshFeatures =
    useMonetizationMessagingRefreshFeatures();

  const featuresToDisplay = showRefreshedMessage
    ? monetizationMessagingRefreshFeatures
    : personalProductivityFeatures;

  return (
    <section className={styles.container}>
      <table>
        <Headers
          isEligibleForTrial={isEligibleForTrial}
          teamId={teamId}
          teamName={teamName}
          isMonthly={isMonthly}
          onShowFreeTrialModal={onShowFreeTrialModal}
          showRefreshedMessage={showRefreshedMessage}
        />
        <tbody>
          {featuresToDisplay.map((featureItem: FeatureItem) => (
            <Rows featureItem={featureItem} key={featureItem.key} />
          ))}
        </tbody>
        <tfoot>
          <PlanComparisonTotals
            teamId={teamId}
            numOfMembers={numOfMembers}
            teamName={teamDisplayName}
            isMonthly={isMonthly}
            showRefreshedMessage={showRefreshedMessage}
          />
        </tfoot>
      </table>
    </section>
  );
};
