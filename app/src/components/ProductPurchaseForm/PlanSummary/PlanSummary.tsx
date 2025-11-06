import cx from 'classnames';
import type { FunctionComponent } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  formatOrdinalDay,
  longDateWithoutYearFormatter,
  numericDateFormatter,
} from '@trello/dates/i18n';
import { localizeCount } from '@trello/legacy-i18n';
import { asMoney, asPercentage } from '@trello/legacy-i18n/formatters';
import type { PIIString } from '@trello/privacy';
import { EMPTY_PII_STRING } from '@trello/privacy';
import type { PurchaseFormIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { taxRegionLabel } from 'app/src/components/CreditCardForm/taxes';
import { SectionMessage } from 'app/src/components/SectionMessage';

import * as styles from './PlanSummary.module.less';

interface LicenseDescriptionObject {
  numberOfLicenses: string;
  pricePerLicense: string;
}

interface BasePlanSummaryProps {
  country?: PIIString;
  zipCode?: PIIString;
  userCount?: number;
  billableCollaboratorCount?: number;
  licenseDescription?: string;
  licenseDescriptionObj?: LicenseDescriptionObject;
  tax?: number | null;
  taxRegion?: string | null;
  subtotal: number;
  subtotalPerUser: number;
  total?: number | null;
  pendingInvitations?: number;
  calculationError?: boolean;
  isAnnual?: boolean;
  isDowngrade?: boolean;
  nextBillDate?: string;
}

interface PlanSummaryWithDiscountProps extends BasePlanSummaryProps {
  priceAdjustment: number;
  adjustedSubtotal: number;
  adjustedSubtotalPerUser: number;
}

export type PlanSummaryProps =
  | BasePlanSummaryProps
  | PlanSummaryWithDiscountProps;

export const PlanSummary: FunctionComponent<PlanSummaryProps> = ({
  country = '',
  zipCode = EMPTY_PII_STRING,
  userCount,
  billableCollaboratorCount = 0,
  licenseDescription,
  licenseDescriptionObj,
  tax = 0,
  taxRegion = '',
  subtotal,
  subtotalPerUser,
  total,
  pendingInvitations = 0,
  calculationError,
  isAnnual,
  isDowngrade,
  nextBillDate,
  ...props
}) => {
  const intl = useIntl();
  const {
    priceAdjustment = 1,
    adjustedSubtotal = subtotal,
    adjustedSubtotalPerUser = subtotalPerUser,
  } = props as PlanSummaryWithDiscountProps;
  const isDiscounted = priceAdjustment < 1;
  const showSavings = !isAnnual && !isDowngrade;
  const showNextBillDate = isDowngrade && Boolean(nextBillDate);

  const taxLabel = taxRegionLabel(tax, country, zipCode, taxRegion);

  const parsedNextBillDate = nextBillDate ? new Date(nextBillDate) : null;

  const styledAmount = (
    <span
      className={styles.pendingInvitationPrice}
      key="pending-invitation-price"
    >
      {isDiscounted ? (
        <>
          <span className={styles.strikeThrough}>
            ${asMoney(subtotalPerUser)}
          </span>{' '}
          <FormattedMessage
            id="templates.credit_card.amount-usd"
            defaultMessage="${amount} USD"
            description="Format for showing a dollar amount in USD"
            values={{
              amount: asMoney(adjustedSubtotalPerUser),
            }}
          />
        </>
      ) : (
        <FormattedMessage
          id="templates.credit_card.amount-usd"
          defaultMessage="${amount} USD"
          description="Format for showing a dollar amount in USD"
          values={{
            amount: asMoney(adjustedSubtotalPerUser),
          }}
        />
      )}
    </span>
  );

  let pendingInvitationsDescription;
  if (typeof tax !== 'number') {
    pendingInvitationsDescription = (
      <FormattedMessage
        id="templates.credit_card.pending-invitation-plus-tax-if-applicable-billing-description"
        defaultMessage="You'll be billed {amount} plus tax (if applicable) immediately for each Workspace member that accepts your invitation."
        description="Text describing how pending invitations will be billed"
        values={{
          amount: styledAmount,
        }}
      />
    );
  } else if (tax > 0) {
    pendingInvitationsDescription = (
      <FormattedMessage
        id="templates.credit_card.pending-invitation-plus-tax-billing-description"
        defaultMessage="You'll be billed {amount} plus tax immediately for each Workspace member that accepts your invitation."
        description="Text describing how pending invitations will be billed"
        values={{
          amount: styledAmount,
        }}
      />
    );
  } else {
    pendingInvitationsDescription = (
      <FormattedMessage
        id="templates.credit_card.pending-invitation-billing-description"
        defaultMessage="You'll be billed {amount} immediately for each Workspace member that accepts your invitation."
        description="Text describing how pending invitations will be billed"
        values={{
          amount: styledAmount,
        }}
      />
    );
  }

  return (
    <>
      <table
        className={cx(styles.summary, styles.nuskuSummaryTable)}
        role="presentation"
      >
        <tbody>
          <tr>
            <td
              data-testid={getTestId<PurchaseFormIds>(
                'purchase-form-summary-license',
              )}
            >
              <div>
                <span className={styles.nuskuLicenseDescription}>
                  {licenseDescriptionObj?.numberOfLicenses ||
                    licenseDescription}
                </span>
                <br />
                {licenseDescriptionObj?.pricePerLicense}
              </div>
              {billableCollaboratorCount <= 0 ? null : (
                <div className={styles.multiBoardGuestLineItem}>
                  <FormattedMessage
                    id="templates.billing_page_one.includes"
                    defaultMessage="Includes:"
                    description="Text indicating what is included in a plan"
                  />
                  <ul>
                    <li>{localizeCount('team-members', userCount)}</li>
                    <li>
                      {localizeCount(
                        'multi-board-guests',
                        billableCollaboratorCount,
                      )}
                    </li>
                  </ul>
                </div>
              )}
            </td>
            <td>
              <div>
                <strong
                  className={cx({
                    [styles.strikeThrough]: isDiscounted,
                  })}
                  data-testid={getTestId<PurchaseFormIds>(
                    'purchase-form-summary-subtotal',
                  )}
                >
                  <FormattedMessage
                    id="templates.credit_card.amount-usd"
                    defaultMessage="${amount} USD"
                    description="Format for showing a dollar amount in USD"
                    values={{
                      amount: asMoney(subtotal),
                    }}
                  />
                </strong>
                {isDiscounted && (
                  <div
                    className={styles.discountedPrice}
                    data-testid={getTestId<PurchaseFormIds>(
                      'purchase-form-summary-discount',
                    )}
                  >
                    <strong
                      data-testid={getTestId<PurchaseFormIds>(
                        'purchase-form-summary-discount-value',
                      )}
                    >
                      <FormattedMessage
                        id="templates.credit_card.amount-usd"
                        defaultMessage="${amount} USD"
                        description="Format for showing a dollar amount in USD"
                        values={{
                          amount: asMoney(adjustedSubtotal),
                        }}
                      />
                    </strong>
                    <br />
                    <span className={styles.discountApplied}>
                      <FormattedMessage
                        id="templates.credit_card.percent-discount-applied"
                        defaultMessage="{discountPercent} discount applied"
                        description="Message showing the discount percentage that was applied"
                        values={{
                          discountPercent: asPercentage(1 - priceAdjustment),
                        }}
                      />
                    </span>
                  </div>
                )}
                {showSavings && (
                  <>
                    <br />
                    <span className={styles.nuskuSavePercentage}>
                      <FormattedMessage
                        id="templates.billing_page_one.save-with-annual"
                        defaultMessage="Save {percentage}% with annual billing"
                        description="Message showing percentage savings with annual billing"
                        values={{
                          percentage: 20,
                        }}
                      />
                    </span>
                  </>
                )}
              </div>
            </td>
          </tr>
          <tr>
            {calculationError ? (
              <td
                colSpan={2}
                data-testid={getTestId<PurchaseFormIds>(
                  'purchase-form-summary-tax-error',
                )}
              >
                <div className={styles.errorMessage}>
                  <FormattedMessage
                    id="templates.credit_card.could-not-calculate-sales-tax"
                    defaultMessage="Could not calculate sales tax"
                    description="Error message when sales tax calculation fails"
                  />
                </div>
              </td>
            ) : (
              <>
                <td
                  data-testid={getTestId<PurchaseFormIds>(
                    'purchase-form-summary-tax-region',
                  )}
                  className={styles.salesTax}
                >
                  {taxLabel}
                </td>
                <td
                  data-testid={getTestId<PurchaseFormIds>(
                    'purchase-form-summary-tax-amount',
                  )}
                  className={styles.salesTax}
                >
                  {typeof tax === 'number' ? (
                    <FormattedMessage
                      id="templates.credit_card.amount-usd"
                      defaultMessage="${amount} USD"
                      description="Format for showing a dollar amount in USD"
                      values={{
                        amount: asMoney(tax),
                      }}
                    />
                  ) : (
                    <FormattedMessage
                      id="templates.credit_card.tax-if-applicable"
                      defaultMessage="(if applicable)"
                      description="Text shown when tax may or may not apply"
                    />
                  )}
                </td>
              </>
            )}
          </tr>
        </tbody>
        {typeof total === 'number' && (
          <tfoot>
            <tr>
              <td>
                <FormattedMessage
                  id="templates.credit_card.total-label"
                  defaultMessage="Total"
                  description="Label for the total amount"
                />
              </td>
              <td
                data-testid={getTestId<PurchaseFormIds>(
                  'purchase-form-summary-total',
                )}
              >
                <FormattedMessage
                  id="templates.credit_card.amount-usd"
                  defaultMessage="${amount} USD"
                  description="Format for showing a dollar amount in USD"
                  values={{
                    amount: asMoney(total),
                  }}
                />
              </td>
            </tr>
          </tfoot>
        )}
      </table>
      {showNextBillDate && parsedNextBillDate && (
        <div className={styles.nextBillDate}>
          <span
            data-testid={getTestId<PurchaseFormIds>(
              'purchase-form-summary-bill-date',
            )}
          >
            {isAnnual ? (
              <FormattedMessage
                id="templates.billing_page_one.billing-next-bill-annual"
                defaultMessage="billed annually on {dayOfYear}, next bill on {nextBillDate}"
                description="Text showing when the next annual bill will occur"
                values={{
                  dayOfYear:
                    longDateWithoutYearFormatter.format(parsedNextBillDate),
                  nextBillDate: numericDateFormatter.format(parsedNextBillDate),
                }}
              />
            ) : (
              <FormattedMessage
                id="templates.billing_page_one.billing-next-bill-monthly"
                defaultMessage="billed monthly on the {dayOfMonth}, next bill on {nextBillDate}"
                description="Text showing when the next monthly bill will occur"
                values={{
                  dayOfMonth: formatOrdinalDay(parsedNextBillDate.getDate()),
                  nextBillDate: numericDateFormatter.format(parsedNextBillDate),
                }}
              />
            )}
          </span>
        </div>
      )}
      {pendingInvitations > 0 && (
        <div>
          <SectionMessage
            testId={getTestId<PurchaseFormIds>(
              'purchase-form-summary-pending-invitations',
            )}
          >
            {isDowngrade
              ? localizeCount(
                  'pending-invitations-downgrade',
                  pendingInvitations,
                  {
                    price: intl.formatMessage(
                      {
                        id: 'templates.credit_card.amount-usd',
                        defaultMessage: '${amount} USD',
                        description:
                          'Format for showing a dollar amount in USD',
                      },
                      {
                        amount: asMoney(adjustedSubtotalPerUser),
                      },
                    ),
                  },
                )
              : localizeCount(
                  'pending-invitations-on-team',
                  pendingInvitations,
                )}{' '}
            {!isDowngrade && pendingInvitationsDescription}
          </SectionMessage>
        </div>
      )}
    </>
  );
};
