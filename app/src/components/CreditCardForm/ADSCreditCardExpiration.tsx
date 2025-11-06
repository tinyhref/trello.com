import { CardExpiryElement } from '@stripe/react-stripe-js';
import type { StripeCardExpiryElementChangeEvent } from '@stripe/stripe-js';
import type { FunctionComponent } from 'react';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { intl } from '@trello/i18n';
import type { PurchaseFormIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { getDefaultIframeOptions } from './getDefaultIframeOptions';
import { Label } from './Label';
import { ValidationError } from './ValidationError';

import * as styles from './ADSCreditCardExpiration.module.less';

export interface CreditCardExpirationInputProps {
  isInvalid?: boolean;
  isDisabled?: boolean;
  onChange?: (event: StripeCardExpiryElementChangeEvent) => void;
  errorMessage?: string | null;
}

export const ADSCreditCardExpiration: FunctionComponent<
  CreditCardExpirationInputProps
> = ({ isDisabled, isInvalid, onChange, errorMessage }) => {
  const iframeOptions = useMemo(
    () => ({
      ...getDefaultIframeOptions({ isDisabled }),
      disabled: isDisabled,
      placeholder: intl.formatMessage({
        id: 'templates.credit_card.month/year abbreviation',
        defaultMessage: 'MM/YY',
        description:
          'The month year abbreviation for the expiration date, MM/YY',
      }),
    }),
    [isDisabled],
  );

  return (
    <div
      data-testid={getTestId<PurchaseFormIds>('credit-card-expiration')}
      className={styles.container}
    >
      <Label isRequired>
        <FormattedMessage
          id="templates.credit_card.expiration-date"
          defaultMessage="Expiration Date"
          description="A label for the expiration date for your card"
        />
      </Label>
      <CardExpiryElement options={iframeOptions} onChange={onChange} />
      {isInvalid && errorMessage && (
        <ValidationError
          id={getTestId<PurchaseFormIds>(
            'credit-card-expiration-validation-error',
          )}
        >
          {errorMessage}
        </ValidationError>
      )}
    </div>
  );
};
