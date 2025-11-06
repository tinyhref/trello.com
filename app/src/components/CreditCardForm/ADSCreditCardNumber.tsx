import { CardNumberElement } from '@stripe/react-stripe-js';
import type { StripeCardNumberElementChangeEvent } from '@stripe/stripe-js';
import type { FunctionComponent } from 'react';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import type { PurchaseFormIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { getDefaultIframeOptions } from './getDefaultIframeOptions';
import { Label } from './Label';
import { ValidationError } from './ValidationError';

import * as styles from './ADSCreditCardNumber.module.less';

interface CreditCardNumberInputProps {
  isInvalid?: boolean;
  isDisabled?: boolean;
  onChange?: (event: StripeCardNumberElementChangeEvent) => void;
  errorMessage?: string | null;
}

export const ADSCreditCardNumber: FunctionComponent<
  CreditCardNumberInputProps
> = ({ errorMessage, isDisabled, isInvalid, onChange }) => {
  const iframeOptions = useMemo(
    () => ({
      ...getDefaultIframeOptions({ isDisabled }),
      disabled: isDisabled,
      placeholder: '4111 1111 1111 1111',
      showIcon: true,
    }),
    [isDisabled],
  );

  return (
    <div
      className={styles.container}
      data-testid={getTestId<PurchaseFormIds>('credit-card-number')}
    >
      <Label isRequired>
        <FormattedMessage
          id="templates.credit_card.credit-card"
          defaultMessage="Card Number"
          description="The title of the button for credit card information"
        />
      </Label>
      <CardNumberElement options={iframeOptions} onChange={onChange} />
      {isInvalid && errorMessage && (
        <ValidationError
          id={getTestId<PurchaseFormIds>('credit-card-number-validation-error')}
        >
          {errorMessage}
        </ValidationError>
      )}
    </div>
  );
};
