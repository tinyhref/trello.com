import type { FunctionComponent } from 'react';
import { useCallback, useContext } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import { localizeCount } from '@trello/legacy-i18n';
import { asMoney } from '@trello/legacy-i18n/formatters';
import { Button } from '@trello/nachos/button';
import type { BillingIds, FreeTrialTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { WithEnterpriseManagedOverride } from 'app/src/components/UpgradePrompts';
import { getQueryParamsFromBillingUrl } from '../getQueryParamsFromBillingUrl';
import { PlanComparisonContext } from '../PlanComparisonContext';
import type { BillingQuotes } from '../types';

import * as styles from './PlanComparisonPremiumHeaderCell.module.less';

export interface PlanComparisonPremiumHeaderCellProps {
  teamId: string;
  teamName: string;
  isMonthly: boolean;
  // Business class is a legacy name for the premium plan!
  prices?: BillingQuotes['businessPrices'];
  onShowFreeTrialModal: (planName: string) => void;
  isEligibleForTrial?: boolean;
  showRefreshedMessage?: boolean;
}

export const PlanComparisonPremiumHeaderCell: FunctionComponent<
  PlanComparisonPremiumHeaderCellProps
> = ({
  teamId,
  isMonthly,
  prices,
  onShowFreeTrialModal,
  isEligibleForTrial,
  showRefreshedMessage,
}) => {
  const intl = useIntl();
  const { variation, onChoosePremium } = useContext(PlanComparisonContext);
  const queryParams = getQueryParamsFromBillingUrl();

  const productCode = isMonthly
    ? prices?.monthly.productCode
    : prices?.annual.productCode;
  const pricePerUser = isMonthly
    ? prices?.monthly.subTotalPerUser
    : prices?.annual.subTotalPerUser;

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

  const onClickFreeTrialButton = () => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'startBCFreeTrialButton',
      source: 'planComparisonSection',
      containers: {
        organization: {
          id: teamId,
        },
      },
      attributes: {
        eligibleForFreeTrial: isEligibleForTrial,
      },
    });
    onShowFreeTrialModal('business class');
  };

  const onClickUpgradeButton = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'upgradeToBCButton',
      source: 'planComparisonSection',
      containers: {
        organization: {
          id: teamId,
        },
      },
      attributes: queryParams,
    });
    onChoosePremium?.(productCode!);
  }, [onChoosePremium, productCode, queryParams, teamId]);

  let actionPrompt = null;
  switch (variation) {
    case 'reverse-trial-overlay':
      actionPrompt = (
        <Button appearance="primary" onClick={onClickUpgradeButton}>
          {
            <FormattedMessage
              id="templates.billing_page_one.upgrade-now"
              defaultMessage="Upgrade now"
              description="Upgrade now"
            />
          }
        </Button>
      );
      break;
    case 'end-of-trial-friction-overlay':
      actionPrompt = (
        <Button appearance="primary" onClick={onKeepPremiumWithAnalytics}>
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
            key="free-trial-business-class"
            onClick={onClickFreeTrialButton}
            appearance="primary"
            testId={getTestId<FreeTrialTestIds>('active-free-trial-banner')}
          >
            <WithEnterpriseManagedOverride>
              {localizeCount('try free', 14)}
            </WithEnterpriseManagedOverride>
          </Button>
          <p className={styles.purchase}>
            <FormattedMessage
              id="templates.billing_page_one.or"
              defaultMessage="or {purchaseNow}"
              description="or {purchaseNow}"
              values={{
                purchaseNow: (
                  <Button
                    key={`upgrade-business-class`}
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
          key="upgrade-business-class"
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
    <th
      className={styles.planCell}
      data-value={intl.formatMessage({
        id: 'templates.billing_page_one.best-value',
        defaultMessage: 'BEST VALUE',
        description: 'BEST VALUE',
      })}
      data-testid={getTestId<BillingIds>('plan-comparison-cell-premium')}
    >
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
      <span className={styles.price}>
        {intl
          .formatMessage(
            {
              id: 'templates.billing_page_one.amount-usd',
              defaultMessage: '${amount} USD',
              description: 'amount-usd',
            },
            {
              amount: asMoney(pricePerUser || 0).replace(/\.00$/, ''),
            },
          )
          .replace(/\s/g, ' ')}
      </span>
      <p className={styles.frequency}>
        <FormattedMessage
          id="templates.billing_page_one.per-user"
          defaultMessage="per user"
          description="per user"
        />
        {showRefreshedMessage && <>&nbsp;</>}
        {!showRefreshedMessage && <br />}
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
      </p>
      {actionPrompt}
    </th>
  );
};
