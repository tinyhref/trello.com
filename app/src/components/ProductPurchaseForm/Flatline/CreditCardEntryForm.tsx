/* eslint-disable formatjs/enforce-description */
import type { BaseSyntheticEvent, FunctionComponent } from 'react';
import { useCallback, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import type { SourceType } from '@trello/analytics-types';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { getNetworkError } from '@trello/graphql-error-handling';
import { Button } from '@trello/nachos/button';
import { ProductFeatures } from '@trello/paid-account';
import { convertToPIIString, EMPTY_PII_STRING } from '@trello/privacy';
import type { PurchaseFormIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { ADSCreditCardCountry } from 'app/src/components/CreditCardForm/ADSCreditCardCountry';
import { ADSCreditCardCvv } from 'app/src/components/CreditCardForm/ADSCreditCardCvv';
import { ADSCreditCardExpiration } from 'app/src/components/CreditCardForm/ADSCreditCardExpiration';
import { ADSCreditCardGrid } from 'app/src/components/CreditCardForm/ADSCreditCardGrid';
import { ADSCreditCardNumber } from 'app/src/components/CreditCardForm/ADSCreditCardNumber';
import { ADSCreditCardTaxId } from 'app/src/components/CreditCardForm/ADSCreditCardTaxId';
import { ADSCreditCardVATRegistration } from 'app/src/components/CreditCardForm/ADSCreditCardVATRegistration';
import { ADSCreditCardZipCode } from 'app/src/components/CreditCardForm/ADSCreditCardZipCode';
import {
  useStripeCreditCardForm as useCreditCardForm,
  type TokenizedCardDetails,
} from 'app/src/components/CreditCardForm/useStripeCreditCardForm';
import { getQueryParamsFromBillingUrl } from 'app/src/components/PlanDetails/getQueryParamsFromBillingUrl';
import { SectionMessage } from 'app/src/components/SectionMessage';
import { BillingSummarySection } from '../PlanSummary/BillingSummarySection';

import * as styles from './CreditCardEntryForm.module.less';

interface CreditCardEntryFormProps {
  idOrganization: string;
  cardDetails: TokenizedCardDetails | null;
  onToggleBillingCadence: () => void;
  onSubmitStart?: () => void;
  onSubmitEnd?: () => void;
  onSuccess: (paidAccount: TokenizedCardDetails) => void;
  product: number;
  size?: 'large' | 'medium' | 'small' | 'xsmall';
  extendTrial?: boolean;
  source?: SourceType;
}

export const CreditCardEntryForm: FunctionComponent<
  CreditCardEntryFormProps
> = ({
  cardDetails,
  idOrganization,
  onSuccess,
  onSubmitStart,
  onSubmitEnd,
  onToggleBillingCadence,
  product,
  size,
  extendTrial,
  source = 'workspaceBillingScreen',
}) => {
  useEffect(() => {
    Analytics.sendViewedComponentEvent({
      componentType: 'form',
      componentName: ProductFeatures.isStandardProduct(product)
        ? 'standardSignupForm'
        : 'premiumSignupForm',
      source,
      containers: formatContainers({ idOrganization }),
      attributes: { variation: 'flatline' },
    });
  }, [idOrganization, product, source]);

  const creditCardForm = useCreditCardForm({
    defaultValues: {
      country: cardDetails?.country ?? convertToPIIString('US'),
      zipCode: cardDetails?.zipCode ?? EMPTY_PII_STRING,
      taxId: cardDetails?.taxId ?? '',
      stateTaxId: cardDetails?.stateTaxId ?? '',
      isVatRegistered: cardDetails?.isVatRegistered ?? false,
    },
  });

  /**
   * Submit handler. Will attempt to preAuthorize the credit card
   * and country details
   */
  const onSubmit = useCallback(
    async (event: BaseSyntheticEvent) => {
      event.preventDefault();
      onSubmitStart?.();

      const traceId = Analytics.startTask({
        taskName: 'edit-paid-account/preauthorize-cc',
        source: 'workspaceBillingScreen',
        attributes: {
          product,
          type: 'purchase',
        },
      });

      Analytics.sendClickedButtonEvent({
        buttonName: ProductFeatures.isStandardProduct(product)
          ? 'confirmStandardPaymentButton'
          : 'confirmPremiumPaymentButton',
        source,
        containers: formatContainers({ idOrganization }),
        attributes: {
          variation: 'flatline',
          ...getQueryParamsFromBillingUrl(),
        },
      });

      try {
        const tokenizedCardDetails = await creditCardForm.preAuthorizeCard({
          idOrganization,
          product,
          traceId,
          extendTrial,
        });

        Analytics.sendTrackEvent({
          source: 'workspaceBillingScreen',
          action: 'confirmed',
          actionSubject: 'payment',
          containers: formatContainers({ idOrganization }),
          attributes: {
            product,
            type: 'purchase',
            variation: 'flatline',
          },
        });

        Analytics.taskSucceeded({
          taskName: 'edit-paid-account/preauthorize-cc',
          source: 'workspaceBillingScreen',
          traceId,
        });

        onSuccess?.(tokenizedCardDetails);
      } catch (error) {
        const networkError = getNetworkError(error);

        Analytics.sendOperationalEvent({
          action: 'errored',
          actionSubject: 'paymentConfirmation',
          source: 'workspaceBillingScreen',
          attributes: {
            product,
            errorMessage: networkError?.message ?? (error as Error).message,
            errorCode: networkError?.code,
            variation: 'flatline',
          },
        });

        Analytics.taskFailed({
          taskName: 'edit-paid-account/preauthorize-cc',
          source: 'workspaceBillingScreen',
          traceId,
          error: networkError ?? error,
        });
      } finally {
        onSubmitEnd?.();
      }
    },
    [
      onSubmitStart,
      product,
      source,
      idOrganization,
      creditCardForm,
      extendTrial,
      onSuccess,
      onSubmitEnd,
    ],
  );

  return (
    <form
      onSubmit={onSubmit}
      data-testid={getTestId<PurchaseFormIds>('credit-card-form')}
    >
      <header>
        <h2>
          <FormattedMessage
            id="templates.credit_card.payment-information-header"
            defaultMessage="Payment information"
          />
        </h2>
        <h5 className={styles.step}>
          <FormattedMessage
            id="templates.credit_card.step-1"
            defaultMessage="Step 1 of 2"
          />
        </h5>
      </header>
      <section>
        <ADSCreditCardGrid size={size}>
          <ADSCreditCardNumber {...creditCardForm.cardNumberProps} />
          <ADSCreditCardExpiration {...creditCardForm.expirationProps} />
          <ADSCreditCardCvv {...creditCardForm.cvvProps} />
          <ADSCreditCardCountry {...creditCardForm.countryProps} />
          <ADSCreditCardZipCode {...creditCardForm.zipCodeProps} />
          <ADSCreditCardTaxId {...creditCardForm.taxIdProps} />
          <ADSCreditCardTaxId {...creditCardForm.stateTaxIdProps} stateTax />
          <ADSCreditCardVATRegistration
            {...creditCardForm.isVatRegisteredProps}
          />
        </ADSCreditCardGrid>
      </section>
      <section
        data-testid={getTestId<PurchaseFormIds>('purchase-form-summary')}
        className={styles.summarySection}
      >
        <BillingSummarySection
          workspaceId={idOrganization}
          product={product}
          country={creditCardForm.country}
          zipCode={creditCardForm.zipCode}
          taxId={creditCardForm.taxId}
          stateTaxId={creditCardForm.stateTaxId}
          isVatRegistered={creditCardForm.isVatRegistered}
          isDisabled={creditCardForm.isDisabled}
          onError={creditCardForm.handleCreditCardFieldValidationErrors}
          onToggleBillingCadence={onToggleBillingCadence}
          source={source}
        />
      </section>
      {creditCardForm.submitError && (
        <div className={styles.submitError}>
          <SectionMessage
            appearance="error"
            testId={getTestId<PurchaseFormIds>('purchase-form-submit-error')}
          >
            {creditCardForm.submitError}
          </SectionMessage>
        </div>
      )}
      <section>
        <Button
          appearance="primary"
          className={styles.submit}
          onClick={onSubmit}
          type="submit"
          isLoading={creditCardForm.isSubmitting}
          isDisabled={creditCardForm.isDisabled}
          testId={getTestId<PurchaseFormIds>('purchase-form-confirm-payment')}
          shouldFitContainer={['xsmall', 'small'].includes(size as string)}
        >
          <FormattedMessage
            id="templates.credit_card.next-confirm-payment"
            defaultMessage="Next: Confirm payment"
          />
        </Button>
      </section>
    </form>
  );
};
