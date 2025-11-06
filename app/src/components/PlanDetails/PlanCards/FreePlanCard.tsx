import { useCallback, useContext, type FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import { asMoney } from '@trello/legacy-i18n/formatters';
import { Button } from '@trello/nachos/button';

import { PlanComparisonContext } from '../PlanComparisonContext';

import * as styles from './FreePlanCard.module.less';

interface FreePlanCardProps {
  showRefreshedMessage?: boolean;
}

export const FreePlanCard: FunctionComponent<FreePlanCardProps> = ({
  showRefreshedMessage = false,
}) => {
  const { variation, onChooseFree } = useContext(PlanComparisonContext);

  const onChooseFreeWithAnalytics = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'chooseFreeButton',
      source: 'trelloPlanPricingModal',
      attributes: {
        viaEndOfTrial: true,
      },
    });
    onChooseFree?.();
  }, [onChooseFree]);

  if (variation !== 'end-of-trial-friction-overlay') {
    return null;
  }

  return (
    <section className={styles.planCard}>
      <article>
        <h3 className={styles.name}>
          <FormattedMessage
            id="templates.billing_page_one.free-name"
            defaultMessage="Free"
            description="Free"
          />
        </h3>
        {showRefreshedMessage && (
          <>
            <p className={styles.infoHeading}>
              <FormattedMessage
                id="templates.billing_page_one.free-description-monetization-refresh-heading"
                defaultMessage="<strong>Start simple. Stay on track.</strong>"
                description="Free plan description heading"
                values={{
                  strong: (chunks) => <strong>{chunks}</strong>,
                }}
              />
            </p>
            <p className={styles.infoBody}>
              <FormattedMessage
                id="templates.billing_page_one.free-description-monetization-refresh-body"
                defaultMessage="Organize your day and keep moving forward."
                description="Free plan description body"
              />
            </p>
          </>
        )}
        {!showRefreshedMessage && (
          <p className={styles.info}>
            <FormattedMessage
              id="templates.billing_page_one.free-description-personal-productivity"
              defaultMessage="Capture your to-dos, get organized, and get sh*t done."
              description="Capture your to-dos, get organized, and get sh*t done."
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
                amount: asMoney(0).replace(/\.00$/, ''),
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
            <FormattedMessage
              id="templates.billing_page_one.per-month"
              defaultMessage="per month"
              description="per month"
            />
          </span>
        </div>
        <div className={styles.ctaContainer}>
          <Button onClick={onChooseFreeWithAnalytics}>
            <FormattedMessage
              id="templates.billing_page_one.choose-free"
              defaultMessage="Choose free"
              description="Choose free"
            />
          </Button>
        </div>
      </article>
    </section>
  );
};
