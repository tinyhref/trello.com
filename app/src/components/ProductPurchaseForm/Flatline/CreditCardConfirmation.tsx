/* eslint-disable formatjs/enforce-description */
import {
  useCallback,
  useEffect,
  useState,
  type BaseSyntheticEvent,
  type FunctionComponent,
} from 'react';
import { FormattedMessage } from 'react-intl';

import type { SourceType } from '@trello/analytics-types';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { getNetworkError } from '@trello/graphql-error-handling';
import { Button } from '@trello/nachos/button';
import { BackIcon } from '@trello/nachos/icons/back';
import { ProductFeatures } from '@trello/paid-account';
import type { PurchaseFormIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import {
  StripeErrorCodes,
  ThreeDSAuthorizationError,
} from 'app/src/components/CreditCardForm/ThreeDSAuthorizationError';
import { type TokenizedCardDetails } from 'app/src/components/CreditCardForm/useStripeCreditCardForm';
import { getQueryParamsFromBillingUrl } from 'app/src/components/PlanDetails/getQueryParamsFromBillingUrl';
import {
  SectionMessage,
  SectionMessageAction,
} from 'app/src/components/SectionMessage';
import { BillingSummarySection } from '../PlanSummary/BillingSummarySection';
import { TermsOfService } from '../TermsOfService/TermsOfService';
import { PaymentDetailsTable } from './PaymentDetailsTable/PaymentDetailsTable';
import { useConfirmationForm } from './useConfirmationForm';

import * as styles from './CreditCardConfirmation.module.less';

interface CreditCardConfirmationProps {
  cardDetails: TokenizedCardDetails;
  idOrganization: string;
  onClickBack: () => void;
  onPurchaseComplete?: (paidAccount: {
    standing: number;
    products: number[];
  }) => void;
  onSubmitStart?: () => void;
  onSubmitEnd?: () => void;
  onToggleBillingCadence: () => void;
  product: number;
  size?: 'large' | 'medium' | 'small' | 'xsmall';
  extendTrial?: boolean;
  source?: SourceType;
}

export const CreditCardConfirmation: FunctionComponent<
  CreditCardConfirmationProps
> = ({
  cardDetails,
  idOrganization,
  onClickBack,
  onPurchaseComplete,
  onSubmitStart,
  onSubmitEnd,
  onToggleBillingCadence,
  product,
  size,
  extendTrial,
  source = 'workspaceBillingScreen',
}) => {
  const [threeDSAuthorizationError, setThreeDSAuthorizationError] =
    useState<boolean>(false);
  useEffect(() => {
    Analytics.sendViewedComponentEvent({
      componentType: 'form',
      componentName: ProductFeatures.isStandardProduct(product)
        ? 'confirmStandardPurchaseForm'
        : 'confirmPremiumPurchaseForm',
      source,
      containers: formatContainers({ idOrganization }),
      attributes: { variation: 'flatline' },
    });
  }, [idOrganization, product, source]);

  const confirmationForm = useConfirmationForm();

  const onSubmit = useCallback(
    async (event: BaseSyntheticEvent) => {
      event.preventDefault();
      onSubmitStart?.();

      const traceId = Analytics.startTask({
        taskName: 'create-paid-account',
        source: 'workspaceBillingScreen',
        attributes: {
          product: ProductFeatures.isStandardProduct(product)
            ? 'standard'
            : 'premium',
          variation: 'flatline',
        },
      });

      Analytics.sendClickedButtonEvent({
        buttonName: ProductFeatures.isStandardProduct(product)
          ? 'purchaseStandardButton'
          : 'purchasePremiumButton',
        source,
        containers: formatContainers({ idOrganization }),
        attributes: {
          variation: 'flatline',
          ...getQueryParamsFromBillingUrl(),
        },
      });

      try {
        let paidAccount;

        if (!extendTrial) {
          const response = await confirmationForm.startSubscription({
            idOrganization,
            cardDetails,
            product,
            traceId,
          });

          paidAccount =
            response.data!.startWorkspacePaidSubscription!.paidAccount!;
        } else {
          const response = await confirmationForm.extendTrial({
            idOrganization,
            nonce: cardDetails.nonce,
            product,
            traceId,
          });

          paidAccount =
            response.data!.extendTrialPaidSubscription!.paidAccount!;
        }

        Analytics.sendTrackEvent({
          source: 'workspaceBillingScreen',
          action: 'purchased',
          actionSubject: ProductFeatures.isStandardProduct(product)
            ? 'standard'
            : 'premium',
          containers: formatContainers({ idOrganization }),
          attributes: {
            product,
            taskId: traceId,
            variation: 'flatline',
            ...getQueryParamsFromBillingUrl(),
          },
        });

        Analytics.taskSucceeded({
          taskName: 'create-paid-account',
          source: 'workspaceBillingScreen',
          traceId,
        });

        onPurchaseComplete?.(paidAccount);
      } catch (error) {
        const networkError = getNetworkError(error);
        Analytics.sendOperationalEvent({
          action: 'errored',
          actionSubject: 'purchase',
          source: 'workspaceBillingScreen',
          attributes: {
            product,
            errorMessage: networkError?.message ?? (error as Error).message,
            errorCode: networkError?.code,
            taskId: traceId,
            variation: 'flatline',
          },
        });

        Analytics.taskFailed({
          taskName: 'create-paid-account',
          source: 'workspaceBillingScreen',
          traceId,
          error: networkError ?? error,
        });

        if (
          error instanceof ThreeDSAuthorizationError &&
          error.stripeError.code ===
            StripeErrorCodes.PAYMENT_INTENT_AUTHENTICATION_FAILURE
        ) {
          setThreeDSAuthorizationError(true);
        }
      } finally {
        onSubmitEnd?.();
      }
    },
    [
      onSubmitStart,
      product,
      source,
      idOrganization,
      extendTrial,
      onPurchaseComplete,
      confirmationForm,
      cardDetails,
      onSubmitEnd,
    ],
  );

  return (
    <form data-testid={getTestId<PurchaseFormIds>('credit-card-confirmation')}>
      <header className={styles.header}>
        <Button
          appearance="subtle-link"
          className={styles.backButton}
          onClick={onClickBack}
          iconBefore={<BackIcon />}
          isDisabled={confirmationForm.isSubmitting}
        >
          <FormattedMessage
            id="templates.credit_card.change-payment-information"
            defaultMessage="Change payment information"
          />
        </Button>
        <h2>
          <FormattedMessage
            id="templates.credit_card.confirm-payment-information-header"
            defaultMessage="Confirm payment information"
          />
        </h2>
        <h5 className={styles.step}>
          <FormattedMessage
            id="templates.credit_card.step-2"
            defaultMessage="Step 2 of 2"
          />
        </h5>
      </header>
      <section>
        <PaymentDetailsTable {...cardDetails} />
      </section>
      <section
        data-testid={getTestId<PurchaseFormIds>('purchase-form-summary')}
        className={styles.summarySection}
      >
        <BillingSummarySection
          workspaceId={idOrganization}
          product={product}
          country={cardDetails.country}
          zipCode={cardDetails.zipCode ?? undefined}
          taxId={cardDetails.taxId}
          stateTaxId={cardDetails.stateTaxId}
          isVatRegistered={cardDetails.isVatRegistered ?? false}
          isDisabled={confirmationForm.isSubmitting}
          onToggleBillingCadence={onToggleBillingCadence}
          source={source}
        />
      </section>
      <section className={styles.tosSection}>
        <TermsOfService {...confirmationForm.acceptTOSProps} />
      </section>
      {confirmationForm.submitError && (
        <div className={styles.submitError}>
          <SectionMessage
            appearance="error"
            testId={getTestId<PurchaseFormIds>('purchase-form-submit-error')}
          >
            {confirmationForm.submitError}
          </SectionMessage>
        </div>
      )}
      {threeDSAuthorizationError && (
        <div className={styles.submitError}>
          <SectionMessage
            appearance="error"
            actions={[
              <SectionMessageAction
                key={0}
                onClick={onClickBack}
                testId={getTestId<PurchaseFormIds>(
                  'purchase-form-submit-authorization-error',
                )}
              >
                <FormattedMessage
                  id="templates.credit_card.submit-authorization-error-button"
                  defaultMessage="Please try again."
                />
              </SectionMessageAction>,
            ]}
          >
            <FormattedMessage
              id="templates.credit_card.submit-authorization-error"
              defaultMessage="Failed to authorize payment."
            />
          </SectionMessage>
        </div>
      )}
      <section>
        <Button
          appearance="primary"
          className={styles.submit}
          onClick={onSubmit}
          isDisabled={confirmationForm.isSubmitting}
          testId={getTestId<PurchaseFormIds>('purchase-form-submit-button')}
          shouldFitContainer={['xsmall', 'small'].includes(size as string)}
          type="submit"
        >
          <FormattedMessage
            id="templates.credit_card.start-subscription"
            defaultMessage="Start subscription"
          />
        </Button>
      </section>
    </form>
  );
};
