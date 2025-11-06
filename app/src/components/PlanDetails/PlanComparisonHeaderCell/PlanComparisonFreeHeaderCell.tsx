/* eslint-disable formatjs/enforce-description */
import { useCallback, useContext, type FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import { intl } from '@trello/i18n';
import { asMoney } from '@trello/legacy-i18n/formatters';
import { Button } from '@trello/nachos/button';
import type { BillingIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { PlanComparisonContext } from '../PlanComparisonContext';

import * as styles from './PlanComparisonFreeHeaderCell.module.less';

interface PlanComparisonFreeHeaderCellProps {
  showRefreshedMessage?: boolean;
}
export const PlanComparisonFreeHeaderCell: FunctionComponent<
  PlanComparisonFreeHeaderCellProps
> = ({ showRefreshedMessage }) => {
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

  return (
    <th
      className={styles.planCell}
      data-value={intl.formatMessage({
        id: 'templates.billing_page_one.best-value',
        defaultMessage: 'BEST VALUE',
      })}
      data-testid={getTestId<BillingIds>('plan-comparison-cell-free')}
    >
      <h3 className={styles.name}>
        <FormattedMessage
          id="templates.billing_page_one.free-name"
          defaultMessage="Free"
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
          />
        </p>
      )}
      <span className={styles.price}>
        {intl
          .formatMessage(
            {
              id: 'templates.billing_page_one.amount-usd',
              defaultMessage: '${amount} USD',
            },
            {
              amount: asMoney(0).replace(/\.00$/, ''),
            },
          )
          .replace(/\s/g, ' ')}
      </span>
      <p className={styles.frequency}>
        <FormattedMessage
          id="templates.billing_page_one.free-forever"
          defaultMessage="Free forever"
        />
      </p>
      {variation === 'end-of-trial-friction-overlay' && (
        <Button onClick={onChooseFreeWithAnalytics}>
          <FormattedMessage
            id="templates.billing_page_one.choose-free"
            defaultMessage="Choose free"
          />
        </Button>
      )}
    </th>
  );
};
