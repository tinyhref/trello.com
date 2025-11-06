import type { FunctionComponent } from 'react';
import { useContext } from 'react';

import { PlanComparisonEnterpriseHeaderCell } from './PlanComparisonHeaderCell/PlanComparisonEnterpriseHeaderCell';
import { PlanComparisonFreeHeaderCell } from './PlanComparisonHeaderCell/PlanComparisonFreeHeaderCell';
import { PlanComparisonPremiumHeaderCell } from './PlanComparisonHeaderCell/PlanComparisonPremiumHeaderCell';
import { PlanComparisonStandardHeaderCell } from './PlanComparisonHeaderCell/PlanComparisonStandardHeaderCell';
import { PlanComparisonContext } from './PlanComparisonContext';

import * as styles from './PlanComparisonHeader.module.less';

export interface OwnProps {
  isEligibleForTrial?: boolean;
  isMonthly: boolean;
  teamId: string;
  teamName: string;
  onShowFreeTrialModal: (planName: string) => void;
  showRefreshedMessage?: boolean;
}

export const PlanComparisonHeader: FunctionComponent<OwnProps> = ({
  isEligibleForTrial = false,
  isMonthly,
  teamId,
  teamName,
  onShowFreeTrialModal,
  showRefreshedMessage,
}) => {
  const { billingQuote } = useContext(PlanComparisonContext);

  return (
    <thead>
      <tr className={styles.headerRow}>
        <th aria-hidden={true} />
        <PlanComparisonFreeHeaderCell
          showRefreshedMessage={showRefreshedMessage}
        />
        <PlanComparisonStandardHeaderCell
          teamId={teamId}
          teamName={teamName}
          isMonthly={isMonthly}
          prices={billingQuote?.standardPrices}
          showRefreshedMessage={showRefreshedMessage}
        />
        <PlanComparisonPremiumHeaderCell
          teamId={teamId}
          teamName={teamName}
          isMonthly={isMonthly}
          prices={billingQuote?.businessPrices}
          onShowFreeTrialModal={onShowFreeTrialModal}
          isEligibleForTrial={isEligibleForTrial}
          showRefreshedMessage={showRefreshedMessage}
        />
        <PlanComparisonEnterpriseHeaderCell
          teamId={teamId}
          showRefreshedMessage={showRefreshedMessage}
        />
      </tr>
    </thead>
  );
};
