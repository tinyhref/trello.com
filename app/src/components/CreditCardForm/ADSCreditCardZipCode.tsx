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
  convertToPIIString,
  dangerouslyConvertPrivacyString,
  type PIIString,
} from '@trello/privacy';
import type { PurchaseFormIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { usTerritories } from './countries';
import { Label } from './Label';
import { requiresZipCode } from './taxes';
import { ValidationError } from './ValidationError';

import * as styles from './ADSCreditCardZipCode.module.less';

interface CreditCardZipCodeProps {
  country: PIIString;
  hidden?: boolean;
  defaultValue?: PIIString;
  isDisabled?: boolean;
  isInvalid?: boolean;
  onChange?: (zipCode: string) => void;
  onBlur?: (zipCode: string) => void;
}

export const ADSCreditCardZipCode: FunctionComponent<
  CreditCardZipCodeProps
> = ({
  country,
  defaultValue,
  hidden,
  isInvalid,
  isDisabled,
  onBlur,
  onChange,
}) => {
  const inputId = useMemo(() => `zipcode-${uuidv4()}`, []);
  const isUSOrUSTerritory =
    country === convertToPIIString('US') ||
    usTerritories.includes(dangerouslyConvertPrivacyString(country));
  let placeholder = '';
  if (isUSOrUSTerritory) {
    placeholder = '90210';
  } else if (country === convertToPIIString('CA')) {
    placeholder = 'M4B 1G5';
  }

  const onZipChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      onChange?.(event.target.value);
    },
    [onChange],
  );

  const onZipBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      onBlur?.(event.target.value);
    },
    [onBlur],
  );

  if (hidden) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Label htmlFor={inputId} isRequired={requiresZipCode(country)}>
        <FormattedMessage
          id="templates.credit_card.postal-code"
          defaultMessage="ZIP/Postal Code"
          description="The title of the button for postal code"
        />
      </Label>
      <Textfield
        aria-errormessage={
          isInvalid
            ? getTestId<PurchaseFormIds>(
                'credit-card-zip-code-validation-error',
              )
            : ''
        }
        autoComplete="postal-code"
        className={styles.input}
        defaultValue={dangerouslyConvertPrivacyString(defaultValue)}
        id={inputId}
        isDisabled={isDisabled}
        isInvalid={isInvalid}
        maxLength={11}
        onBlur={onZipBlur}
        onChange={onZipChange}
        placeholder={placeholder}
        testId={getTestId<PurchaseFormIds>('credit-card-zip-code')}
        type="text"
      />
      {isInvalid && (
        <ValidationError
          id={getTestId<PurchaseFormIds>(
            'credit-card-zip-code-validation-error',
          )}
        >
          {isUSOrUSTerritory ? (
            <FormattedMessage
              id="templates.credit_card.us-addresses-require-5-digit-zip-code"
              defaultMessage="U.S. addresses require a valid 5 digit zip code."
              description="A description that is specific to the key 'us-addresses-require-5-digit-zip-code' and relates to where it is being used"
            />
          ) : (
            localizeErrorCode('paidAccount', 'BILLING_INVALID_ZIP_CODE')
          )}
        </ValidationError>
      )}
    </div>
  );
};
