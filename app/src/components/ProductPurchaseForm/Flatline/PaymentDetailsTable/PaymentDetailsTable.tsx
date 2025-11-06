/* eslint-disable formatjs/enforce-description */
import type { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  dangerouslyConvertPrivacyString,
  EMPTY_PII_STRING,
  type PIIString,
} from '@trello/privacy';

import { getCountryName } from 'app/src/components/CreditCardForm/countries';
import {
  getStateTaxType,
  getTaxType,
} from 'app/src/components/CreditCardForm/taxes';

import * as styles from './PaymentDetailsTable.module.less';

interface PaymentDetailsTableProps {
  cardType: PIIString;
  cardLast4: PIIString;
  country: PIIString;
  zipCode?: PIIString | null;
  taxId?: string | null;
  stateTaxId?: string | null;
}

export const PaymentDetailsTable: FunctionComponent<
  PaymentDetailsTableProps
> = ({
  cardType,
  cardLast4,
  country,
  zipCode = EMPTY_PII_STRING,
  taxId = EMPTY_PII_STRING,
  stateTaxId = EMPTY_PII_STRING,
}) => {
  const countryCode = dangerouslyConvertPrivacyString(country);
  const billingAddress = [getCountryName(countryCode) ?? countryCode];
  if (zipCode) {
    billingAddress.push(dangerouslyConvertPrivacyString(zipCode).toUpperCase());
  }

  return (
    <table className={styles.table}>
      <tbody>
        <tr data-testid="card-details">
          <td className={styles.label}>
            <FormattedMessage
              id="templates.credit_card.card-details"
              defaultMessage="Card details"
            />
          </td>
          <td className={styles.value}>
            <FormattedMessage
              id="templates.credit_card.card-type-ending-in-last4"
              defaultMessage="{cardType} card ending in {last4}"
              values={{
                cardType: (
                  <span className={styles.capitalize} key="card-type">
                    {cardType}
                  </span>
                ),
                last4: <strong key="last4">{cardLast4}</strong>,
              }}
            />
          </td>
        </tr>
        <tr data-testid="country-details">
          <td className={styles.label}>
            <FormattedMessage
              id="templates.credit_card.billing-address"
              defaultMessage="Billing address"
            />
          </td>
          <td className={styles.value}>{billingAddress.join(', ')}</td>
        </tr>
        {taxId && (
          <tr data-testid="tax-details">
            <td className={styles.label}>
              <FormattedMessage
                id="templates.credit_card.tax-number"
                defaultMessage="Tax Number ({taxType})"
                values={{
                  taxType: getTaxType(country),
                }}
              />
            </td>
            <td className={styles.value}>{taxId}</td>
          </tr>
        )}
        {stateTaxId && (
          <tr data-testid="tax-details">
            <td className={styles.label}>
              <FormattedMessage
                id="templates.credit_card.tax-number"
                defaultMessage="Tax Number ({taxType})"
                values={{
                  taxType: getStateTaxType(
                    dangerouslyConvertPrivacyString(country),
                    dangerouslyConvertPrivacyString(zipCode as PIIString),
                  ),
                }}
              />
            </td>
            <td className={styles.value}>{stateTaxId}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
