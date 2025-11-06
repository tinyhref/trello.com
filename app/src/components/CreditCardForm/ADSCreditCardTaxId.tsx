import {
  useCallback,
  useMemo,
  type ChangeEvent,
  type FocusEvent,
  type FunctionComponent,
} from 'react';
import { FormattedMessage } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';

import { localizeErrorCode } from '@trello/legacy-i18n';
import { Textfield } from '@trello/nachos/textfield';
import {
  dangerouslyConvertPrivacyString,
  type PIIString,
} from '@trello/privacy';
import type { PurchaseFormIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { Label } from './Label';
import { getStateTaxType, getTaxType } from './taxes';
import { ValidationError } from './ValidationError';

import * as styles from './ADSCreditCardTaxId.module.less';

interface CreditCardTaxIdProps {
  country: PIIString;
  hidden?: boolean;
  zipCode?: PIIString;
  defaultValue?: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
  stateTax?: boolean;
  onChange?: (taxId: string) => void;
  onBlur?: (taxId: string) => void;
}

export const ADSCreditCardTaxId: FunctionComponent<CreditCardTaxIdProps> = ({
  country,
  defaultValue,
  hidden,
  isInvalid,
  isDisabled,
  stateTax,
  onBlur,
  onChange,
  zipCode,
}) => {
  const inputId = useMemo(() => `tax-id-${uuidv4()}`, []);
  const testId = stateTax
    ? getTestId<PurchaseFormIds>('credit-card-state-tax-id')
    : getTestId<PurchaseFormIds>('credit-card-tax-id');
  const errorId = stateTax
    ? getTestId<PurchaseFormIds>('credit-card-state-tax-id-validation-error')
    : getTestId<PurchaseFormIds>('credit-card-tax-id-validation-error');
  const taxType = stateTax
    ? getStateTaxType(
        dangerouslyConvertPrivacyString(country),
        dangerouslyConvertPrivacyString(zipCode),
      )
    : getTaxType(country);
  const onTaxIdBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      onBlur?.(event.target.value);
    },
    [onBlur],
  );
  const onTaxIdChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      onChange?.(event.target.value);
    },
    [onChange],
  );

  if (hidden) {
    return null;
  }

  return (
    <div className={stateTax ? styles.stateTaxId : styles.taxId}>
      <Label
        htmlFor={inputId}
        id={getTestId<PurchaseFormIds>('credit-card-tax-id-label')}
      >
        <FormattedMessage
          id="templates.credit_card.tax-number"
          defaultMessage="Tax Number ({taxType})"
          description="The tax type for this transaction"
          values={{ taxType }}
        />
      </Label>
      <Textfield
        aria-errormessage={isInvalid ? errorId : ''}
        defaultValue={defaultValue}
        className={styles.input}
        id={inputId}
        isInvalid={isInvalid}
        isDisabled={isDisabled}
        onBlur={onTaxIdBlur}
        onChange={onTaxIdChange}
        testId={testId}
        type="text"
      />
      {isInvalid && (
        <ValidationError id={errorId}>
          {localizeErrorCode(
            'paidAccount',
            stateTax
              ? 'BILLING_INVALID_STATE_TAX_ID'
              : 'BILLING_INVALID_TAX_ID',
          )}
        </ValidationError>
      )}
    </div>
  );
};
