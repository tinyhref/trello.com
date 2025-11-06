import classnames from 'classnames';
import type { FunctionComponent, ReactNode } from 'react';
import { useContext } from 'react';
import {
  FormattedMessage,
  FormattedNumber,
  useIntl,
  type IntlShape,
} from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import { Button } from '@trello/nachos/button';

import { PlanComparisonContext } from './PlanComparisonContext';

import * as styles from './PlanComparisonTotals.module.less';

export interface TotalsCellProps {
  monthlyPrice?: number;
  annualPrice?: number;
  isMonthly: boolean;
  intl: IntlShape;
  monthlyCollaborators?: number;
  annualCollaborators?: number;
  showRefreshedMessage?: boolean;
}

export const getTotalsText = ({
  isMonthly,
  annualPrice = 0,
  monthlyPrice = 0,
  intl,
}: TotalsCellProps) => {
  const monthlyRatePerYear = monthlyPrice ? monthlyPrice * 12 : 0;

  const formatUsdPrice = (amount: number) => {
    return intl.formatMessage(
      {
        id: 'templates.billing_page_one.amount-usd',
        defaultMessage: '${amount} USD',
        description: 'Format for displaying price in USD currency',
      },
      {
        amount: (
          <FormattedNumber
            value={amount}
            style="currency"
            currency="USD"
            minimumFractionDigits={0}
            maximumFractionDigits={0}
          />
        ).props.value.toString(),
      },
    );
  };

  return isMonthly ? (
    <p className={classnames(styles.text, styles.total)}>
      <FormattedMessage
        id="templates.billing_page_one.monthly-total-text"
        defaultMessage="{monthlyPrice} total per month, totaling {annualPrice} annually"
        description="Text showing monthly price and annual total when billed monthly"
        values={{
          monthlyPrice: (
            <span key={monthlyPrice}>
              <b className={styles.price}>{formatUsdPrice(monthlyPrice)}</b>
              <br />
            </span>
          ),
          annualPrice: formatUsdPrice(monthlyRatePerYear),
        }}
      />
    </p>
  ) : (
    <p className={classnames(styles.text, styles.total)}>
      <FormattedMessage
        id="templates.billing_page_one.annual-total-text"
        defaultMessage="{annualPrice} paid annually"
        description="Text showing total price when billed annually"
        values={{
          annualPrice: (
            <span key={annualPrice}>
              <b className={styles.price}>{formatUsdPrice(annualPrice)}</b>
              <br />
            </span>
          ),
        }}
      />
    </p>
  );
};

export const getTotalsTextRefreshed = ({
  isMonthly,
  annualPrice = 0,
  monthlyPrice = 0,
  intl,
}: TotalsCellProps) => {
  const monthlyRatePerYear = monthlyPrice ? monthlyPrice * 12 : 0;

  const formatUsdPrice = (amount: number) => {
    return (
      <FormattedNumber
        value={amount}
        style="currency"
        currency="USD"
        minimumFractionDigits={0}
        maximumFractionDigits={0}
      />
    );
  };

  return isMonthly ? (
    <p className={classnames(styles.text, styles.totalText)}>
      <FormattedMessage
        id="templates.billing_page_one.monthly-price-monetization-refresh"
        defaultMessage="{monthlyPrice} total per month"
        description="Text showing monthly price and annual total when billed monthly"
        values={{
          monthlyPrice: (
            <span key={monthlyPrice}>
              <b className={styles.price}>{formatUsdPrice(monthlyPrice)}</b>
            </span>
          ),
        }}
      />
      <br />
      <span>
        <FormattedMessage
          id="templates.billing_page_one.annual-total-monetization-refresh"
          defaultMessage="({annualPrice} annually)"
          description="Text showing annual price when billed annually"
          values={{
            annualPrice: formatUsdPrice(monthlyRatePerYear),
          }}
        />
      </span>
    </p>
  ) : (
    <p className={classnames(styles.text, styles.totalText)}>
      <FormattedMessage
        id="templates.billing_page_one.annual-total-text"
        defaultMessage="{annualPrice} paid annually"
        description="Text showing total price when billed annually"
        values={{
          annualPrice: (
            <span key={annualPrice}>
              <b className={styles.price}>{formatUsdPrice(annualPrice)}</b>
            </span>
          ),
        }}
      />
    </p>
  );
};

const TotalsCell: FunctionComponent<TotalsCellProps> = ({
  monthlyPrice,
  annualPrice,
  isMonthly,
  intl,
  showRefreshedMessage = false,
}) => {
  const totalsText = getTotalsText({
    monthlyPrice,
    annualPrice,
    isMonthly,
    intl,
  });
  const totalsTextRefreshed = getTotalsTextRefreshed({
    monthlyPrice,
    annualPrice,
    isMonthly,
    intl,
    showRefreshedMessage,
  });
  if (showRefreshedMessage) {
    return <td className={styles.cell}>{totalsTextRefreshed}</td>;
  }
  return <td className={styles.cell}>{totalsText}</td>;
};

interface OwnProps {
  teamName: ReactNode;
  isMonthly: boolean;
  numOfMembers?: number;
  teamId: string;
  showRefreshedMessage?: boolean;
}

export const PlanComparisonTotals: FunctionComponent<OwnProps> = ({
  teamName,
  isMonthly,
  numOfMembers = 1,
  teamId,
  showRefreshedMessage = false,
}) => {
  const intl = useIntl();

  const { billingQuote, variation } = useContext(PlanComparisonContext);

  const standardMonthly = billingQuote?.standardPrices?.monthly;
  const standardAnnual = billingQuote?.standardPrices?.annual;
  const businessMonthly = billingQuote?.businessPrices?.monthly;
  const businessAnnual = billingQuote?.businessPrices?.annual;

  const onClickContactUs = () => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'contactUsButton',
      source:
        variation === 'billing-page'
          ? 'planComparisonSection'
          : 'planComparisonModal',
      containers: {
        organization: {
          id: teamId,
        },
      },
    });
  };

  return (
    <tr>
      <td key="empty-cell" className={styles.noCell}>
        {}
      </td>
      <td
        key="header-cell"
        className={classnames(styles.cell, styles.cellHeader)}
      >
        <p
          className={classnames(
            styles.text,
            showRefreshedMessage && styles.headerText,
          )}
        >
          {showRefreshedMessage ? (
            <FormattedMessage
              id="templates.billing_page_one.plan-comparison-totals-row-header-monetization-refresh"
              defaultMessage="For each billable member of your workspace"
              description="Header text showing what the total cost would be for all team members"
            />
          ) : (
            <FormattedMessage
              id="templates.billing_page_one.plan-comparison-totals-row-header"
              defaultMessage="For all members and billable guests in {teamName}, you'd pay:"
              description="Header text showing what the total cost would be for all team members"
              values={{ teamName }}
            />
          )}
        </p>
      </td>
      <TotalsCell
        key="standard-totals"
        monthlyPrice={standardMonthly?.subTotal}
        annualPrice={standardAnnual?.subTotal}
        isMonthly={isMonthly}
        intl={intl}
        showRefreshedMessage={showRefreshedMessage}
      />
      <TotalsCell
        key="business-totals"
        monthlyPrice={businessMonthly?.subTotal}
        annualPrice={businessAnnual?.subTotal}
        isMonthly={isMonthly}
        intl={intl}
        showRefreshedMessage={showRefreshedMessage}
      />
      <td className={classnames(styles.cell, styles.contactBtn)}>
        <Button
          onClick={onClickContactUs}
          key="enterprise-contact-us"
          linkTarget="_blank"
          href={'/enterprise#contact'}
        >
          <FormattedMessage
            id="templates.billing_page_one.contact-sales-repackaging-gtm"
            defaultMessage="Contact sales"
            description="Button text for contacting sales team about Enterprise plan"
          />
        </Button>
      </td>
    </tr>
  );
};
