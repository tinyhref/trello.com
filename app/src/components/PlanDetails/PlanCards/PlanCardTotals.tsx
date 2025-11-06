/* eslint-disable formatjs/enforce-description */
import type { FunctionComponent, ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';

import { localizeCount } from '@trello/legacy-i18n';
import { asMoney } from '@trello/legacy-i18n/formatters';

import type { BillingQuote } from '../types';

import * as styles from './PlanCardTotals.module.less';

export interface PlanCardTotalsProps {
  isMonthly: boolean;
  numOfMembers: number;
  teamName: ReactNode;
  prices?: BillingQuote;
}

export const PlanCardTotals: FunctionComponent<PlanCardTotalsProps> = ({
  isMonthly,
  numOfMembers,
  teamName,
  prices,
}) => {
  const monthlyPrice = prices?.monthly?.subTotal || 0;
  const monthlyRatePerYear = monthlyPrice ? monthlyPrice * 12 : 0;
  const annualPrice = prices?.annual?.subTotal || 0;

  return (
    <article className={styles.totals}>
      {isMonthly ? (
        <p key={monthlyPrice}>
          {localizeCount('monthly-total-text-card', numOfMembers, {
            teamName,
            monthlyPrice: (
              <b key="monthly-price-container">
                <FormattedMessage
                  id="templates.billing_page_one.amount-usd"
                  defaultMessage="${amount} USD"
                  values={{
                    amount: (
                      <b key="monthly-price">
                        {asMoney(monthlyPrice).replace(/\.00$/, '')}
                      </b>
                    ),
                  }}
                />
              </b>
            ),
            annualPrice: (
              <b key={monthlyRatePerYear}>
                <FormattedMessage
                  id="templates.billing_page_one.amount-usd"
                  defaultMessage="${amount} USD"
                  values={{
                    amount: (
                      <b key="monthly-rate-per-year">
                        {asMoney(monthlyRatePerYear).replace(/\.00$/, '')}
                      </b>
                    ),
                  }}
                />
              </b>
            ),
          })}
        </p>
      ) : (
        <p>
          {localizeCount('annual-total-text-card', numOfMembers, {
            teamName,
            annualPrice: (
              <b key={annualPrice}>
                <FormattedMessage
                  id="templates.billing_page_one.amount-usd"
                  defaultMessage="${amount} USD"
                  values={{
                    amount: (
                      <b key="annual-price">
                        {asMoney(annualPrice).replace(/\.00$/, '')}
                      </b>
                    ),
                  }}
                />
              </b>
            ),
          })}
        </p>
      )}
    </article>
  );
};
