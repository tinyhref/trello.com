import type { FunctionComponent, ReactNode } from 'react';
import { useCallback, useContext } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import { localizeCount } from '@trello/legacy-i18n';
import { asMoney } from '@trello/legacy-i18n/formatters';
import { Button } from '@trello/nachos/button';
import type { BillingIds, FreeTrialTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { WithEnterpriseManagedOverride } from 'app/src/components/UpgradePrompts';
import { PlanComparisonContext } from '../PlanComparisonContext';
import type { BillingQuote } from '../types';
import { PlanCardTotals } from './PlanCardTotals';
import { PlanCardTotalsRefreshed } from './PlanCardTotalsRefreshed';

import * as styles from './PremiumPlanCard.module.less';

export interface PremiumPlanCardProps {
  numOfMembers?: number;
  teamDisplayName: ReactNode;
  teamName: string;
  prices?: BillingQuote;
  isEligibleForTrial?: boolean;
  isMonthly: boolean;
  onShowFreeTrialModal: (planName: string) => void;
  sendAnalytics: (name: string) => void;
  showRefreshedMessage?: boolean;
}

export const PremiumPlanCard: FunctionComponent<PremiumPlanCardProps> = ({
  isEligibleForTrial,
  isMonthly,
  prices,
  numOfMembers = 1,
  teamDisplayName,
  onShowFreeTrialModal,
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

  const onClickFreeTrialButton = () => onShowFreeTrialModal('business class');
  const { onChoosePremium, variation } = useContext(PlanComparisonContext);

  const onClickUpgradeButton = useCallback(() => {
    sendAnalytics('business class');
    onChoosePremium?.(productCode!);
  }, [onChoosePremium, productCode, sendAnalytics]);

  const onKeepPremiumWithAnalytics = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'choosePremiumButton',
      source: 'trelloPlanPricingModal',
      attributes: {
        viaEndOfTrial: true,
      },
    });
    onChoosePremium?.(productCode!);
  }, [onChoosePremium, productCode]);

  let actionPrompt = null;
  switch (variation) {
    case 'reverse-trial-overlay':
      actionPrompt = (
        <Button onClick={onClickUpgradeButton} appearance="primary">
          <FormattedMessage
            id="templates.billing_page_one.upgrade-now"
            defaultMessage="Upgrade now"
            description="Upgrade now"
          />
        </Button>
      );
      break;
    case 'end-of-trial-friction-overlay':
      actionPrompt = (
        <Button onClick={onKeepPremiumWithAnalytics} appearance="primary">
          <FormattedMessage
            id="templates.billing.keep-premium"
            defaultMessage="Keep Premium"
            description="Keep Premium"
          />
        </Button>
      );
      break;
    case 'downgrade-plan-overlay':
      actionPrompt = (
        <section className={styles.currentPlan}>
          <div>
            <FormattedMessage
              id="templates.billing_page_one.current-plan"
              defaultMessage="Current plan"
              description="Current plan"
            />
          </div>
          <div>
            {isMonthly ? (
              <FormattedMessage
                id="templates.billing_page_one.paid-monthly"
                defaultMessage="paid monthly"
                description="paid monthly"
              />
            ) : (
              <FormattedMessage
                id="templates.billing_page_one.paid-yearly"
                defaultMessage="paid yearly"
                description="paid yearly"
              />
            )}
          </div>
        </section>
      );
      break;
    case 'billing-page':
    default:
      actionPrompt = isEligibleForTrial ? (
        <>
          <Button
            onClick={onClickFreeTrialButton}
            appearance="primary"
            testId={getTestId<FreeTrialTestIds>('active-free-trial-banner')}
          >
            <WithEnterpriseManagedOverride>
              {localizeCount('try free', 14)}
            </WithEnterpriseManagedOverride>
          </Button>
          <p>
            <FormattedMessage
              id="templates.billing_page_one.or"
              defaultMessage="or {purchaseNow}"
              description="or"
              values={{
                purchaseNow: (
                  <Button
                    key={`upgrade-${intl.formatMessage({
                      id: 'templates.billing_page_one.business-class-name',
                      defaultMessage: 'Premium',
                      description: 'Premium',
                    })}`}
                    testId={getTestId<BillingIds>('upgrade-team-bc-button')}
                    appearance="link"
                    onClick={onClickUpgradeButton}
                  >
                    <FormattedMessage
                      id="templates.billing_page_one.upgrade-now-lower-case"
                      defaultMessage="upgrade now"
                      description="upgrade now"
                    />
                  </Button>
                ),
              }}
            />
          </p>
        </>
      ) : (
        <Button
          onClick={onClickUpgradeButton}
          appearance="primary"
          testId={getTestId<BillingIds>('upgrade-team-button')}
        >
          <FormattedMessage
            id="templates.billing_page_one.upgrade-now"
            defaultMessage="Upgrade now"
            description="Upgrade now"
          />
        </Button>
      );
  }

  return (
    <section className={styles.planCard}>
      <article>
        <h3 className={styles.name}>
          <FormattedMessage
            id="templates.billing_page_one.business-class-name"
            defaultMessage="Premium"
            description="Premium"
          />
        </h3>
        {showRefreshedMessage && (
          <>
            <p className={styles.infoHeading}>
              <FormattedMessage
                id="templates.billing_page_one.premium-description-monetization-refresh-heading"
                defaultMessage="<strong>Unlock your full potential.</strong>"
                description="Premium plan description heading"
                values={{
                  strong: (chunks) => <strong>{chunks}</strong>,
                }}
              />
            </p>
            <p className={styles.infoBody}>
              <FormattedMessage
                id="templates.billing_page_one.premium-description-monetization-refresh-body"
                defaultMessage="Optimize how you work with smarter and unlimited features."
                description="Premium plan description body"
              />
            </p>
          </>
        )}
        {!showRefreshedMessage && (
          <p className={styles.info}>
            <FormattedMessage
              id="templates.billing_page_one.premium-description-personal-productivity"
              defaultMessage="Add AI to your boards and advanced admin options like domain verification, account capture, and 24/5 support."
              description="Add AI to your boards and advanced admin options like domain verification, account capture, and 24/5 support."
            />
          </p>
        )}
        <div className={styles.priceContainer}>
          <span className={styles.price}>
            <FormattedMessage
              id="templates.billing_page_one.amount-usd"
              defaultMessage="${amount} USD"
              description="amount-usd"
              values={{
                amount: asMoney(pricePerUser || 0).replace(/\.00$/, ''),
              }}
            />
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
        <div className={styles.ctaContainer}>{actionPrompt}</div>
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
