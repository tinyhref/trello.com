import { CardCvcElement } from '@stripe/react-stripe-js';
import type { StripeCardCvcElementChangeEvent } from '@stripe/stripe-js';
import type { FunctionComponent } from 'react';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { intl } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import { HelpIcon } from '@trello/nachos/icons/help';
import { Popover, usePopover } from '@trello/nachos/popover';
import type { PIIString } from '@trello/privacy';
import {
  convertToPIIString,
  dangerouslyConvertPrivacyString,
} from '@trello/privacy';
import type { PurchaseFormIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { getDefaultIframeOptions } from './getDefaultIframeOptions';
import { Label } from './Label';
import { ValidationError } from './ValidationError';

import * as styles from './ADSCreditCardCvv.module.less';

// eslint-disable-next-line @trello/assets-alongside-implementation
import creditCardAmexPng from 'resources/images/credit-cards/credit-card-amex.png';
// eslint-disable-next-line @trello/assets-alongside-implementation
import creditCardPng from 'resources/images/credit-cards/credit-card.png';

export interface CreditCardCvvInputProps {
  isInvalid?: boolean;
  isDisabled?: boolean;
  onChange?: (event: StripeCardCvcElementChangeEvent) => void;
  errorMessage?: string | null;
  cardType: PIIString;
}

interface CVVTooltipProps {
  cardType: PIIString;
  niceCardType: PIIString;
}

// eslint-disable-next-line @trello/enforce-variable-case
const CVVTooltip: FunctionComponent<CVVTooltipProps> = ({
  cardType,
  niceCardType,
}) => {
  const niceCardTypeString = dangerouslyConvertPrivacyString(niceCardType);
  const cardTypeString = dangerouslyConvertPrivacyString(cardType);

  const Amex = (
    <div className={styles.cardExample}>
      <FormattedMessage
        id="templates.credit_card.amex_title"
        defaultMessage="American Express"
        description="A description of the CVV location for an American Express card"
        tagName="h4"
      />
      <FormattedMessage
        id="templates.credit_card.amex_info"
        defaultMessage="The 4-digit security code can be found on the front of your card."
        description="Information indicating the security code is on the front of an American Express card"
        tagName="p"
      />
      <img
        src={creditCardAmexPng}
        alt={niceCardTypeString}
        className={styles.preview}
      />
    </div>
  );

  const OtherCards = (
    <div className={styles.cardExample}>
      <FormattedMessage
        id="templates.credit_card.other_cards_title"
        defaultMessage="Visa, Mastercard, Discover"
        description="A description of the CVV location for Visa, Mastercard, or Discover cards"
        tagName="h4"
      />
      <FormattedMessage
        id="templates.credit_card.other_cards_info"
        defaultMessage="The 3-digit security code can be found on the back of your card."
        description="Information indicating the security code is on the back of Visa, Mastercard, or Discover cards"
        tagName="p"
      />
      <img
        src={creditCardPng}
        alt={niceCardTypeString}
        className={styles.preview}
      />
    </div>
  );

  switch (cardTypeString) {
    case 'amex':
      return Amex;
    case 'visa':
    case 'mastercard':
    case 'discover':
      return OtherCards;
    default:
      return (
        <>
          {Amex}
          {OtherCards}
        </>
      );
  }
};

export const ADSCreditCardCvv: FunctionComponent<CreditCardCvvInputProps> = ({
  isDisabled,
  isInvalid,
  onChange,
  errorMessage,
  cardType,
}) => {
  const { triggerRef, toggle, popoverProps } = usePopover<HTMLButtonElement>();
  const iframeOptions = useMemo(
    () => ({
      ...getDefaultIframeOptions({ isDisabled }),
      disabled: isDisabled,
      placeholder: intl.formatMessage(
        {
          id: 'templates.credit_card.cvv digits',
          defaultMessage: '{digits} digits',
          description: 'The placeholder text for the form to enter your CVV',
        },
        {
          digits: cardType === convertToPIIString('amex') ? '4' : '3',
        },
      ),
    }),
    [isDisabled, cardType],
  );

  return (
    <div
      data-testid={getTestId<PurchaseFormIds>('credit-card-cvv')}
      className={styles.container}
    >
      <Label
        isRequired
        iconAfter={
          <Button
            className={styles.help}
            ref={triggerRef}
            onClick={toggle}
            appearance="subtle"
            iconBefore={
              <HelpIcon
                label={intl.formatMessage({
                  id: 'templates.credit_card.open-cvv-tooltip',
                  defaultMessage: 'Open CVV tooltip',
                  description: 'Open the CVV tooltip',
                })}
                size="xsmall"
              />
            }
          />
        }
      >
        <FormattedMessage
          id="templates.credit_card.cvv"
          defaultMessage="CVV"
          description="CVV"
        />
      </Label>
      <CardCvcElement options={iframeOptions} onChange={onChange} />
      <Popover {...popoverProps} size="small">
        <CVVTooltip cardType={cardType} niceCardType={cardType} />
      </Popover>
      {isInvalid && errorMessage && (
        <ValidationError
          id={getTestId<PurchaseFormIds>('credit-card-cvv-validation-error')}
        >
          {errorMessage}
        </ValidationError>
      )}
    </div>
  );
};
