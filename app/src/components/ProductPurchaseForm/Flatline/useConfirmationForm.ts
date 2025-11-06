import { useCallback, useState } from 'react';

import { getNetworkError } from '@trello/graphql-error-handling';
import { localizeErrorCode } from '@trello/legacy-i18n';
import type { SecureString } from '@trello/privacy';

import {
  isRequires3DSError,
  useAuthorize3ds,
} from 'app/src/components/CreditCardForm/useAuthorize3ds';
import type { TokenizedCardDetails } from 'app/src/components/CreditCardForm/useStripeCreditCardForm';
import { useExtendTrialPaidSubscriptionMutation } from './ExtendTrialPaidSubscriptionMutation.generated';
import { useStartWorkspacePaidSubscriptionMutation } from './StartWorkspacePaidSubscriptionMutation.generated';

export const useConfirmationForm = () => {
  const [acceptTOS, setAcceptTOS] = useState<boolean>(false);
  const [acceptTOSInvalid, setAcceptTOSInvalid] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isAuthorizing, setIsAuthorizing] = useState<boolean>(false);
  const { authorize3DSCreditCard } = useAuthorize3ds();
  const [
    startSubscriptionMutation,
    { loading: isSubmittingStartSubscription },
  ] = useStartWorkspacePaidSubscriptionMutation();
  const [extendTrialMutation, { loading: isSubmittingExtendTrial }] =
    useExtendTrialPaidSubscriptionMutation();

  const onClickTermsOfService = useCallback(
    (checked: boolean) => {
      setAcceptTOS(checked);
      if (checked) {
        setAcceptTOSInvalid(false);
      }
    },
    [setAcceptTOS, setAcceptTOSInvalid],
  );

  const startSubscription = useCallback(
    async ({
      idOrganization,
      cardDetails,
      product,
      traceId,
      freeTrial,
    }: {
      idOrganization: string;
      cardDetails: TokenizedCardDetails;
      product: number;
      traceId?: string;
      freeTrial?: boolean;
    }) => {
      try {
        setSubmitError(null);

        return await startSubscriptionMutation({
          variables: {
            acceptTOS,
            idOrganization,
            nonce: cardDetails.nonce,
            product,
            traceId,
            freeTrial,
            country: cardDetails.country,
            zipCode: cardDetails.zipCode,
            taxId: cardDetails.taxId,
            stateTaxId: cardDetails.stateTaxId,
          },
        });
      } catch (error) {
        const networkError = getNetworkError(error);
        const intentType = 'paymentIntent';
        if (isRequires3DSError(networkError, intentType)) {
          setIsAuthorizing(true);
          await authorize3DSCreditCard({
            traceId,
            secret: networkError.paymentIntentSecret,
            type: intentType,
            error,
          });
          setIsAuthorizing(false);
          return await startSubscriptionMutation({
            variables: {
              acceptTOS,
              idOrganization,
              nonce: cardDetails.nonce,
              product,
              traceId,
              freeTrial,
              country: cardDetails.country,
              zipCode: cardDetails.zipCode,
              taxId: cardDetails.taxId,
              stateTaxId: cardDetails.stateTaxId,
            },
          });
        } else if (networkError?.code === 'BILLING_INVALID_TOS') {
          setAcceptTOSInvalid(true);
        } else {
          setSubmitError(
            localizeErrorCode(
              'paidAccount',
              networkError?.code ?? 'BILLING_SERVICE_UNAVAILABLE',
            ),
          );
        }
        throw error;
      }
    },
    [
      acceptTOS,
      setAcceptTOSInvalid,
      setSubmitError,
      startSubscriptionMutation,
      authorize3DSCreditCard,
    ],
  );

  const extendTrial = useCallback(
    async ({
      idOrganization,
      nonce,
      product,
      traceId,
    }: {
      idOrganization: string;
      nonce: SecureString;
      product: number;
      traceId?: string;
    }) => {
      try {
        setSubmitError(null);

        return await extendTrialMutation({
          variables: { acceptTOS, idOrganization, nonce, product, traceId },
        });
      } catch (error) {
        const networkError = getNetworkError(error);
        if (networkError?.code === 'BILLING_INVALID_TOS') {
          setAcceptTOSInvalid(true);
        } else {
          setSubmitError(
            localizeErrorCode(
              'paidAccount',
              networkError?.code ?? 'BILLING_SERVICE_UNAVAILABLE',
            ),
          );
        }
        throw error;
      }
    },
    [acceptTOS, setAcceptTOSInvalid, setSubmitError, extendTrialMutation],
  );

  return {
    acceptTOS,
    acceptTOSProps: {
      isChecked: acceptTOS,
      isDisabled:
        isSubmittingStartSubscription ||
        isSubmittingExtendTrial ||
        isAuthorizing,
      isInvalid: acceptTOSInvalid,
      onChange: onClickTermsOfService,
    },
    startSubscription,
    extendTrial,
    isSubmitting:
      isSubmittingStartSubscription || isSubmittingExtendTrial || isAuthorizing,
    submitError,
  };
};
