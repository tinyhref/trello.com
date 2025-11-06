import { useCallback, type FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { localizeErrorCode } from '@trello/legacy-i18n';
import { Select } from '@trello/nachos/select';
import {
  dangerouslyConvertPrivacyString,
  type PIIString,
} from '@trello/privacy';
import type { PurchaseFormIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { countries, sanctionedCountries } from './countries';
import { Label } from './Label';
import { ValidationError } from './ValidationError';

import * as styles from './ADSCreditCardCountry.module.less';

interface CreditCardCountryProps {
  isDisabled?: boolean;
  isInvalid?: boolean;
  defaultValue?: PIIString;
  onChange?: (countryCode: string) => void;
  errorCode?: string;
}

export const ADSCreditCardCountry: FunctionComponent<
  CreditCardCountryProps
> = ({ defaultValue, isInvalid, isDisabled, onChange, errorCode }) => {
  const inputId = `${getTestId<PurchaseFormIds>('credit-card-country')}-input`;
  const disabledDueToSanctions =
    isDisabled &&
    sanctionedCountries.some(
      (country) => country === dangerouslyConvertPrivacyString(defaultValue),
    );

  const options = countries.unloved
    .concat(disabledDueToSanctions ? countries.sanctioned : [])
    .map((country) => ({
      value: country[0],
      label: country[1],
    }));

  const defaultOption = options.find(
    (option) => option.value === dangerouslyConvertPrivacyString(defaultValue),
  );

  const onCountryChange = useCallback(
    (selection: (typeof options)[number] | null) => {
      onChange?.(selection?.value ?? '');
    },
    [onChange],
  );

  return (
    <div className={styles.container}>
      <Label
        id={getTestId<PurchaseFormIds>('credit-card-country-label')}
        isRequired
      >
        <FormattedMessage
          id="templates.credit_card.country"
          defaultMessage="Country"
          description="A "
        />
      </Label>
      <Select
        aria-errormessage={
          isInvalid
            ? getTestId<PurchaseFormIds>('credit-card-country-validation-error')
            : ''
        }
        aria-invalid={isInvalid}
        aria-labelledby={getTestId<PurchaseFormIds>(
          'credit-card-country-label',
        )}
        classNamePrefix={getTestId<PurchaseFormIds>('credit-card-country')}
        defaultValue={defaultOption}
        inputId={inputId}
        isDisabled={isDisabled}
        isSearchable
        onChange={onCountryChange}
        options={options}
        required
        testId={getTestId<PurchaseFormIds>('credit-card-country')}
      />
      {isInvalid && errorCode && (
        <ValidationError
          id={getTestId<PurchaseFormIds>(
            'credit-card-country-validation-error',
          )}
        >
          {localizeErrorCode('paidAccount', errorCode)}
        </ValidationError>
      )}
    </div>
  );
};
