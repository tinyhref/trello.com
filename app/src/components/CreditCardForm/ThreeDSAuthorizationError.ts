import type { ApolloError } from '@apollo/client';
import type { StripeError } from '@stripe/stripe-js';

export class ThreeDSAuthorizationError extends Error {
  stripeError: StripeError;
  apolloError: ApolloError;
  constructor(message: string, stripeError: StripeError, error: ApolloError) {
    super(message);
    this.stripeError = stripeError;
    this.apolloError = error;
  }
}

export const StripeErrorCodes = {
  PAYMENT_INTENT_AUTHENTICATION_FAILURE:
    'payment_intent_authentication_failure',
} as const;
