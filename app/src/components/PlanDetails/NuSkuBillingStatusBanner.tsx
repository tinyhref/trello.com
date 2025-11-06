import classNames from 'classnames';
import type { FunctionComponent } from 'react';
import { useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useMemberId } from '@trello/authentication';
import { longDateFormatter } from '@trello/dates/i18n';
import { BusinessClassIcon } from '@trello/nachos/icons/business-class';
import type { BillingIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { BillingHistory } from 'app/src/components/BillingDetails/BillingHistory/BillingHistory';
import { useSubscriptionExpirationStatus } from 'app/src/components/WorkspaceBillingView/useSubscriptionExpirationStatus';
import { usePlanDetailsViewQuery } from './PlanDetailsViewQuery.generated';

import * as styles from './NuSkuBillingStatusBanner.module.less';

interface NuSkuBillingStatusBannerProps {
  teamId: string;
  dtPricingAdjustmentExpiration: string | null | undefined;
}

export const NuSkuBillingStatusBanner: FunctionComponent<
  NuSkuBillingStatusBannerProps
> = ({ teamId, dtPricingAdjustmentExpiration }) => {
  const memberId = useMemberId();
  const intl = useIntl();
  const [showBillingHistory, setShowBillingHistory] = useState(false);
  const toggleShowBillingHistory = () =>
    setShowBillingHistory(!showBillingHistory);
  const { data } = usePlanDetailsViewQuery({
    variables: {
      orgId: teamId,
      memberId,
    },
    skip: !teamId,
    waitOn: ['MemberHeader'],
  });

  const {
    paidPlanExpired,
    paidPlanDisabled,
    planType,
    planExpirationDate,
    freeTrialExpired,
    freeTrialExpirationDate,
  } = useSubscriptionExpirationStatus({
    orgId: teamId,
    paidAccount: data?.organization?.paidAccount,
  });

  const paidPlanEnded = paidPlanExpired || paidPlanDisabled;
  const showBillingStatusBanner = paidPlanEnded || freeTrialExpired;

  const getProductName = useCallback(
    (isPremium: boolean) => {
      if (isPremium) {
        return intl.formatMessage({
          id: 'templates.billing_page_one.business-class-name',
          defaultMessage: 'Premium',
          description: 'Text displayed for Premium plan name',
        });
      }

      return intl.formatMessage({
        id: 'templates.billing_page_one.standard-name',
        defaultMessage: 'Standard',
        description: 'Text displayed for Standard plan name',
      });
    },
    [intl],
  );

  if (!showBillingStatusBanner) return null;

  const date = paidPlanEnded ? planExpirationDate : freeTrialExpirationDate;

  return (
    <div
      className={classNames(styles.banner)}
      data-testid={getTestId<BillingIds>('billing-status-banner')}
    >
      <div className={classNames(styles.summary)}>
        <BusinessClassIcon
          size="large"
          dangerous_className={styles.icon}
          block
        />
        <div className={styles.label}>
          <div className={styles.text}>
            {paidPlanEnded ? (
              <FormattedMessage
                id="templates.billing_page_one.billing-status-banner.workspace-has-ended"
                defaultMessage="Trello {productName} for this Workspace has ended."
                description="Message shown when workspace subscription has ended"
                values={{
                  productName: getProductName(planType === 'bc'),
                }}
              />
            ) : (
              <FormattedMessage
                id="templates.billing_page_one.billing-status-banner.your-free-trial-ended-on-date"
                defaultMessage="Your {productName} free trial ended on {date}."
                description="Message shown when free trial has ended"
                values={{
                  productName: getProductName(true), // Free trial always shows Premium
                  date: date ? longDateFormatter.format(new Date(date)) : '',
                }}
              />
            )}
          </div>
          <div
            onClick={toggleShowBillingHistory}
            role="button"
            className={classNames(styles.link)}
          >
            {showBillingHistory ? (
              <FormattedMessage
                id="templates.billing_page_one.billing-status-banner.hide-billing-history"
                defaultMessage="Hide billing history"
                description="Button text to hide billing history"
              />
            ) : (
              <FormattedMessage
                id="templates.billing_page_one.billing-status-banner.show-billing-history"
                defaultMessage="Show billing history"
                description="Button text to show billing history"
              />
            )}
          </div>
        </div>
      </div>
      {showBillingHistory && (
        <div className={classNames(styles.details)}>
          <BillingHistory type={planType} accountId={teamId} />
        </div>
      )}
    </div>
  );
};
