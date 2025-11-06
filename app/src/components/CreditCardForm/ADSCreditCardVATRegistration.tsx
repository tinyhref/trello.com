import React, { useCallback, useEffect, useState } from 'react';
import type { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import type { NetworkError } from '@trello/graphql-error-handling';
import { Checkbox } from '@trello/nachos/checkbox';
import type { PIIString } from '@trello/privacy';
import { dangerouslyConvertPrivacyString } from '@trello/privacy';

import { Label } from './Label';
import { acceptsVATRegistrationStatus } from './taxes';

import * as styles from './ADSCreditCardVATRegistration.module.less';

export interface ADSCreditCardVATRegistrationProps {
  hidden?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  errorCode?: NetworkError['code'];
  country: PIIString;
  isChecked?: boolean;
  onChange: (value: boolean) => void;
}

export const ADSCreditCardVATRegistration: FunctionComponent<
  ADSCreditCardVATRegistrationProps
> = ({ hidden, country, isChecked = false, onChange, isDisabled = false }) => {
  const [checked, setChecked] = useState<boolean | undefined>(isChecked);

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.checked;
      setChecked(newValue);
      onChange(newValue);
    },
    [onChange],
  );

  if (
    hidden ||
    !acceptsVATRegistrationStatus(dangerouslyConvertPrivacyString(country))
  ) {
    return null;
  }

  return (
    <div className={styles.isVatRegistered}>
      <Label>
        <FormattedMessage
          id="templates.credit_card.vat-registration"
          description="VAT Registration"
          defaultMessage="VAT Registration"
        />
      </Label>
      <div className={styles.vatCheckboxContainer}>
        <Checkbox
          isChecked={checked}
          className={styles.vatCheckbox}
          onChange={handleChange}
          name="isVatRegistered"
          label={
            <FormattedMessage
              id="templates.credit_card.vat-registration-description"
              description="VAT Registration Description"
              defaultMessage="Is the customer engaged in business?"
            />
          }
          isDisabled={isDisabled}
        />
      </div>
    </div>
  );
};
