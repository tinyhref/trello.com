import { useCallback, useContext, type FunctionComponent } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import { asMoney } from '@trello/legacy-i18n/formatters';
import { Button } from '@trello/nachos/button';
import type { BillingIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { getQueryParamsFromBillingUrl } from '../getQueryParamsFromBillingUrl';
import { PlanComparisonContext } from '../PlanComparisonContext';
import type { BillingQuotes } from '../types';

import * as styles from './PlanComparisonStandardHeaderCell.module.less';

export interface PlanComparisonStandardHeaderCellProps {
  teamId: string;
  teamName: string;
  isMonthly: boolean;
  prices?: BillingQuotes['standardPrices'];
  showRefreshedMessage?: boolean;
}

export const PlanComparisonStandardHeaderCell: FunctionComponent<
  PlanComparisonStandardHeaderCellProps
> = ({ teamId, isMonthly, prices, showRefreshedMessage }) => {
  const intl = useIntl();
  const { variation, onChooseStandard } = useContext(PlanComparisonContext);
  const queryParams = getQueryParamsFromBillingUrl();

  const productCode = isMonthly
    ? prices?.monthly.productCode
    : prices?.annual.productCode;
  const pricePerUser = isMonthly
    ? prices?.monthly.subTotalPerUser
    : prices?.annual.subTotalPerUser;
  const frequency = isMonthly ? (
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
  );

  const onClick = useCallback(() => {
    if (variation === 'end-of-trial-friction-overlay') {
      Analytics.sendClickedButtonEvent({
        buttonName: 'chooseStandardButton',
        source: 'trelloPlanPricingModal',
        attributes: {
          viaEndOfTrial: true,
        },
      });
    }

    if (variation === 'billing-page' || variation === 'reverse-trial-overlay') {
      Analytics.sendClickedButtonEvent({
        buttonName: 'upgradeToStandardButton',
        source: 'planComparisonSection',
        containers: {
          organization: {
            id: teamId,
          },
        },
        attributes: queryParams,
      });
    }
    onChooseStandard?.(productCode!);
  }, [productCode, onChooseStandard, teamId, variation, queryParams]);

  return (
    <th
      className={styles.planCell}
      data-value={intl.formatMessage({
        id: 'templates.billing_page_one.best-value',
        defaultMessage: 'BEST VALUE',
        description: 'BEST VALUE',
      })}
      data-testid={getTestId<BillingIds>('plan-comparison-cell-standard')}
    >
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
            description="Get more done with advanced Planner, card mirroring, collapsible lists, list colors, and more."
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
        {frequency}
      </p>
      <Button
        key={
          variation === 'billing-page' ? `upgrade-standard` : `modal-standard`
        }
        onClick={onClick}
        testId={
          variation === 'billing-page'
            ? getTestId<BillingIds>('upgrade-team-standard-button')
            : getTestId<BillingIds>('get-standard')
        }
      >
        {variation === 'reverse-trial-overlay' ||
        variation === 'billing-page' ? (
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
    </th>
  );
};
