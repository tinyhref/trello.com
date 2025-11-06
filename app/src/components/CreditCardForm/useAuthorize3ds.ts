import type { ApolloError } from '@apollo/client';
import { useElements, useStripe } from '@stripe/react-stripe-js';
import type { PaymentIntentResult, SetupIntentResult } from '@stripe/stripe-js';
import { useCallback } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import {
  getNetworkError,
  type NetworkError,
} from '@trello/graphql-error-handling';

import {
  StripeErrorCodes,
  ThreeDSAuthorizationError,
} from './ThreeDSAuthorizationError';

type IntentType = 'paymentIntent' | 'setupIntent';

type RequiresActionNetworkError<T extends IntentType = IntentType> =
  NetworkError &
    (T extends 'setupIntent'
      ? { setupIntentSecret: string; paymentIntentSecret?: never }
      : T extends 'paymentIntent'
        ? { paymentIntentSecret: string; setupIntentSecret?: never }
        : never);

type IntentResultType<T extends IntentType> = T extends 'paymentIntent'
  ? PaymentIntentResult
  : T extends 'setupIntent'
    ? SetupIntentResult
    : never;

type CardProcessingError = NetworkError & {
  dtProcessingCompletes: string; // ISO 8601 date string
};

export const isCardProcessingError = (
  networkError: NetworkError | null,
): networkError is CardProcessingError => {
  return (
    networkError?.code === 'BILLING_CARD_CURRENTLY_PROCESSING' &&
    'dtProcessingCompletes' in networkError
  );
};

export const isRequires3DSError = <T extends IntentType = IntentType>(
  networkError: NetworkError | null,
  type?: T,
): networkError is RequiresActionNetworkError<T> => {
  if (networkError?.code === 'BILLING_REQUIRES_ACTION') {
    if (type === 'setupIntent' && 'setupIntentSecret' in networkError) {
      return true;
    }
    if (type === 'paymentIntent' && 'paymentIntentSecret' in networkError) {
      return true;
    }
    return type === undefined;
  }
  return false;
};

const isIntentSuccessful = <T extends IntentType>(
  result: IntentResultType<T>,
  type: T,
): boolean => {
  if (type === 'setupIntent') {
    return (result as SetupIntentResult).setupIntent?.status === 'succeeded';
  }
  return (result as PaymentIntentResult).paymentIntent?.status === 'succeeded';
};

export const useAuthorize3ds = () => {
  const stripe = useStripe();
  const elements = useElements();

  const get3dsRedirect = useCallback(
    async <T extends IntentType>(
      secret: string,
      type: T,
    ): Promise<IntentResultType<T>> => {
      if (!stripe || !elements) {
        throw new Error('Stripe is not yet initialized');
      }

      if (type === 'setupIntent') {
        const result = await stripe.confirmCardSetup(secret);
        return result as IntentResultType<T>;
      }

      const result = await stripe.confirmCardPayment(secret);
      return result as IntentResultType<T>;
    },
    [elements, stripe],
  );

  /**
   * Handle 3DS credit cards. Prompts the 3DS authorization window
   * and on successful authorization, will re-submit the credit card.
   * If 3DS auth fails or is cancelled, will re-throw the requires-
   * authorization error
   */
  const authorize3DSCreditCard = useCallback(
    async ({
      error,
      secret,
      type,
      traceId,
    }: {
      error: unknown;
      secret: string;
      type: IntentType;
      traceId?: string;
    }): Promise<void> => {
      const networkError = getNetworkError(error);
      Analytics.sendTrackEvent({
        action: 'triggered',
        actionSubject: 'authorize',
        source: 'workspaceBillingScreen',
        attributes: {
          errorMessage: networkError?.message ?? (error as Error).message,
          errorCode: networkError?.code,
          taskId: traceId,
        },
      });
      const intentResult = await get3dsRedirect(secret, type);
      if (!isIntentSuccessful(intentResult, type)) {
        Analytics.sendTrackEvent({
          action: 'failed',
          actionSubject: 'authorize',
          source: 'workspaceBillingScreen',
          attributes: {
            taskId: traceId,
          },
        });
        if (
          intentResult.error?.code ===
          StripeErrorCodes.PAYMENT_INTENT_AUTHENTICATION_FAILURE
        ) {
          throw new ThreeDSAuthorizationError(
            'Payment intent authentication failure',
            intentResult.error,
            error as ApolloError,
          );
        }

        throw error;
      }

      Analytics.sendTrackEvent({
        action: 'completed',
        actionSubject: 'authorize',
        source: 'workspaceBillingScreen',
        attributes: {
          setupIntent:
            type === 'setupIntent'
              ? (intentResult as SetupIntentResult).setupIntent?.id
              : undefined,
          paymentIntent:
            type === 'paymentIntent'
              ? (intentResult as PaymentIntentResult).paymentIntent?.id
              : undefined,
          taskId: traceId,
        },
      });
    },
    [get3dsRedirect],
  );

  return { authorize3DSCreditCard, get3dsRedirect };
};
