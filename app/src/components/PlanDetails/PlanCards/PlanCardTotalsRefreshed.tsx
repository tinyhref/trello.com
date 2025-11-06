import type { FunctionComponent, ReactNode } from 'react';
import { FormattedNumber } from 'react-intl';

import { localizeCount } from '@trello/legacy-i18n';

import type { BillingQuote } from '../types';

import * as styles from './PlanCardTotalsRefreshed.module.less';

export interface PlanCardTotalsRefreshedProps {
  isMonthly: boolean;
  numOfMembers: number;
  teamName: ReactNode;
  prices?: BillingQuote;
}

export const PlanCardTotalsRefreshed: FunctionComponent<
  PlanCardTotalsRefreshedProps
> = ({ isMonthly, numOfMembers, teamName, prices }) => {
  const monthlyPrice = prices?.monthly?.subTotal || 0;
  const monthlyRatePerYear = monthlyPrice ? monthlyPrice * 12 : 0;
  const annualPrice = prices?.annual?.subTotal || 0;

  return (
    <article className={styles.totals}>
      {isMonthly ? (
        <p key={monthlyPrice}>
          {localizeCount(
            'monthly-total-text-card-monetization-refresh',
            numOfMembers,
            {
              teamName,
              monthlyPrice: (
                <b key="monthly-price-container">
                  <FormattedNumber
                    value={monthlyPrice}
                    style="currency"
                    currency="USD"
                    minimumFractionDigits={0}
                    maximumFractionDigits={0}
                  />
                </b>
              ),
              annualPrice: (
                <b key={monthlyRatePerYear}>
                  <FormattedNumber
                    value={monthlyRatePerYear}
                    style="currency"
                    currency="USD"
                    minimumFractionDigits={0}
                    maximumFractionDigits={0}
                  />
                </b>
              ),
            },
          )}
        </p>
      ) : (
        <p>
          {localizeCount('annual-total-text-card', numOfMembers, {
            teamName,
            annualPrice: (
              <b key={annualPrice}>
                <FormattedNumber
                  value={annualPrice}
                  style="currency"
                  currency="USD"
                  minimumFractionDigits={0}
                  maximumFractionDigits={0}
                />
              </b>
            ),
          })}
        </p>
      )}
    </article>
  );
};
