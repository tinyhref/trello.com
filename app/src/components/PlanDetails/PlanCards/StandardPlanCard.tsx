import type { FunctionComponent, ReactNode } from 'react';
import { useCallback, useContext } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import { asMoney } from '@trello/legacy-i18n/formatters';
import { Button } from '@trello/nachos/button';
import type { BillingIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { PlanComparisonContext } from '../PlanComparisonContext';
import type { BillingQuote } from '../types';
import { PlanCardTotals } from './PlanCardTotals';
import { PlanCardTotalsRefreshed } from './PlanCardTotalsRefreshed';

import * as styles from './StandardPlanCard.module.less';

export interface StandardPlanCardProps {
  numOfMembers?: number;
  teamDisplayName: ReactNode;
  teamName: string;
  prices?: BillingQuote;
  isMonthly: boolean;
  onShowFreeTrialModal: (planName: string) => void;
  sendAnalytics: (name: string) => void;
  showRefreshedMessage?: boolean;
}

export const StandardPlanCard: FunctionComponent<StandardPlanCardProps> = ({
  isMonthly,
  prices,
  numOfMembers = 1,
  teamDisplayName,
  sendAnalytics,
  showRefreshedMessage = false,
}) => {
  const intl = useIntl();
  const pricePerUser = isMonthly
    ? prices?.monthly?.subTotalPerUser
    : prices?.annual?.subTotalPerUser;

  const productCode = isMonthly
    ? prices?.monthly?.productCode
    : prices?.annual?.productCode;

  const { variation, onChooseStandard } = useContext(PlanComparisonContext);

  const onClick = useCallback(() => {
    if (variation === 'billing-page') {
      sendAnalytics('standard');
    } else if (variation === 'end-of-trial-friction-overlay') {
      Analytics.sendClickedButtonEvent({
        buttonName: 'chooseStandardButton',
        source: 'trelloPlanPricingModal',
        attributes: {
          viaEndOfTrial: true,
        },
      });
    }
    onChooseStandard?.(productCode!);
  }, [variation, onChooseStandard, productCode, sendAnalytics]);

  return (
    <section className={styles.planCard}>
      <article>
        <h3 className={styles.name}>
          <FormattedMessage
            id="templates.billing_page_one.standard-name"
            defaultMessage="Standard"
            description="Standard"
          />
        </h3>
        {showRefreshedMessage && (
          <>
            <p className={styles.infoHeading}>
              <FormattedMessage
                id="templates.billing_page_one.standard-description-monetization-refresh-heading"
                defaultMessage="<strong>Add focus to your flow.</strong>"
                description="Standard plan description heading"
                values={{
                  strong: (chunks) => <strong>{chunks}</strong>,
                }}
              />
            </p>
            <p className={styles.infoBody}>
              <FormattedMessage
                id="templates.billing_page_one.standard-description-monetization-refresh-body"
                defaultMessage="Bring order to your to-dos and structure into your day."
                description="Standard plan description body"
              />
            </p>
          </>
        )}
        {!showRefreshedMessage && (
          <p className={styles.info}>
            <FormattedMessage
              id="templates.billing_page_one.standard-description-personal-productivity"
              defaultMessage="Get more done with advanced Planner, card mirroring, collapsible lists, list colors, and more."
              description="Stay organized and efficient with boards, Inbox, and Planner. Every to-do, idea, or responsibility—no matter how small—finds its place, keeping you at the top of your game."
            />
          </p>
        )}
        <div className={styles.priceContainer}>
          <span className={styles.price}>
            {intl.formatMessage(
              {
                id: 'templates.billing_page_one.amount-usd',
                defaultMessage: '${amount} USD',
                description: 'amount-usd',
              },
              {
                amount: asMoney(pricePerUser || 0).replace(/\.00$/, ''),
              },
            )}
          </span>
          <span className={styles.frequency}>
            <FormattedMessage
              id="templates.billing_page_one.per-user"
              defaultMessage="per user"
              description="per user"
            />
            <br />
            {isMonthly ? (
              <FormattedMessage
                id="templates.billing_page_one.per-month"
                defaultMessage="per month"
                description="per month"
              />
            ) : (
              <FormattedMessage
                id="templates.billing_page_one.per-year"
                defaultMessage="per year"
                description="per year"
              />
            )}
          </span>
        </div>
        <div className={styles.ctaContainer}>
          <Button
            onClick={onClick}
            testId={
              variation === 'billing-page'
                ? getTestId<BillingIds>('upgrade-team-button')
                : getTestId<BillingIds>('get-standard')
            }
          >
            {variation === 'billing-page' ||
            variation === 'reverse-trial-overlay' ? (
              <FormattedMessage
                id="templates.billing_page_one.upgrade-now"
                defaultMessage="Upgrade now"
                description="Upgrade now"
              />
            ) : (
              <FormattedMessage
                id="templates.billing_page_one.get-standard"
                defaultMessage="Get Standard"
                description="Get Standard"
              />
            )}
          </Button>
        </div>
      </article>
      {showRefreshedMessage ? (
        <PlanCardTotalsRefreshed
          isMonthly={isMonthly}
          numOfMembers={numOfMembers}
          teamName={teamDisplayName}
          prices={prices}
        />
      ) : (
        <PlanCardTotals
          isMonthly={isMonthly}
          numOfMembers={numOfMembers}
          teamName={teamDisplayName}
          prices={prices}
        />
      )}
    </section>
  );
};
