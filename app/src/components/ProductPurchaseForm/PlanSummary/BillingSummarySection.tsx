/* eslint-disable formatjs/enforce-description */
import type { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import type { SourceType } from '@trello/analytics-types';
import { intl } from '@trello/i18n';
import { ProductFeatures } from '@trello/paid-account';

import { BillingCycleToggle } from 'app/src/components/PlanDetails/BillingCycleToggle';
import { PlanSummaryConnected } from './PlanSummaryConnected';
import type { PlanSummaryCalculationProps } from './usePlanSummaryCalculation';

import * as styles from './BillingSummarySection.module.less';

interface PlanSummaryConnectedProps extends PlanSummaryCalculationProps {
  isDisabled: boolean;
  onToggleBillingCadence: () => void;
  source?: SourceType;
}

export const BillingSummarySection: FunctionComponent<
  PlanSummaryConnectedProps
> = ({
  isDisabled = false,
  onToggleBillingCadence,
  source = 'workspaceBillingScreen',
  ...props
}) => (
  <>
    <h3 className={styles.title}>
      <span>
        <FormattedMessage
          id="templates.credit_card.billing-summary-header"
          defaultMessage="Billing summary"
        />
      </span>
      <span className={styles.toggle}>
        <BillingCycleToggle
          teamId={props.workspaceId}
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
          isMonthly={ProductFeatures.isMonthly(props.product)}
          isDisabled={isDisabled}
          hasDiscount={false}
          toggleLabel={onToggleBillingCadence}
          source={source}
        />
      </span>
    </h3>
    <PlanSummaryConnected {...props} />
  </>
);
