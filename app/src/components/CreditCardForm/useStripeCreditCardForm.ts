import { useElements, useStripe } from '@stripe/react-stripe-js';
import type {
  StripeCardCvcElementChangeEvent,
  StripeCardExpiryElementChangeEvent,
  StripeCardNumberElementChangeEvent,
  StripeError,
} from '@stripe/stripe-js';
import type { Reducer } from 'react';
import { useCallback, useEffect, useReducer } from 'react';

import type { NetworkError } from '@trello/graphql-error-handling';
import { getNetworkError } from '@trello/graphql-error-handling';
import { intl } from '@trello/i18n';
import { localizeErrorCode } from '@trello/legacy-i18n';
import type { PIIString, SecureString } from '@trello/privacy';
import {
  convertToPIIString,
  dangerouslyConvertPrivacyString,
  EMPTY_PII_STRING,
} from '@trello/privacy';

import { RenewalPriceQuotesDocument } from 'app/src/components/BillingDetails/RenewalPriceQuotesQuery.generated';
import { sanctionedCountries } from './countries';
import { usePreAuthorizeWorkspaceCreditCardMutation } from './PreAuthorizeWorkspaceCreditCardMutation.generated';
import {
  acceptsStateTaxId,
  acceptsTaxId,
  acceptsVATRegistrationStatus,
  isValidTaxId,
  isValidZipCode,
  requiresZipCode,
} from './taxes';
import { ThreeDSAuthorizationError } from './ThreeDSAuthorizationError';
import { useUpdateCreditCardMutation } from './UpdateCreditCardMutation.generated';
import {
  isCardProcessingError,
  isRequires3DSError,
  useAuthorize3ds,
} from './useAuthorize3ds';

export interface StripeErrorExtension {
  stripeError: StripeError;
}

interface TokenizeResult {
  nonce: SecureString;
  cardType: PIIString;
  cardLast4: PIIString;
  country: PIIString;
  zipCode: PIIString;
  taxId: string;
  stateTaxId: string;
  promoCode?: string;
  isVatRegistered?: boolean;
}

export interface TokenizedCardDetails {
  nonce: SecureString;
  cardType: PIIString;
  cardLast4: PIIString;
  country: PIIString;
  zipCode: PIIString | null;
  taxId: string | null;
  stateTaxId: string | null;
  isVatRegistered?: boolean | null;
}

export class StripeTracedError extends Error {
  message: string;
  name: string;
  // @ts-expect-error
  stripeError: StripeError;

  constructor(message: string, { stripeError }: StripeErrorExtension) {
    super(message);
    this.message = message;
    this.name = stripeError.code ?? stripeError.type;
    Object.assign(this, stripeError);
  }
}

export type FormFields =
  | 'country'
  | 'cvv'
  | 'expirationDate'
  | 'isVatRegistered'
  | 'number'
  | 'promoCode'
  | 'stateTaxId'
  | 'taxId'
  | 'zipCode';

export interface FormField<T> {
  value: T;
  invalid: boolean;
  hidden?: boolean;
  errorMessage?: string;
  errorCode?: NetworkError['code'];
}

export interface CreditCardFormState {
  disabled: boolean;
  submitting: boolean;
  submitError: string | null;
  cardType: PIIString;
  number: FormField<undefined>;
  expirationDate: FormField<undefined>;
  cvv: FormField<undefined>;
  country: FormField<PIIString>;
  zipCode: FormField<PIIString>;
  taxId: FormField<string>;
  stateTaxId: FormField<string>;
  promoCode: FormField<string>;
  isVatRegistered: FormField<boolean>;
}

export const updateField = (
  field: FormFields,
  value: boolean | number | string,
) => ({
  type: 'update-field' as const,
  payload: {
    field,
    value,
  },
});

export const updateCardField = (
  field: FormFields,
  brand: string | null,
  validity: boolean,
  error?: string,
) => ({
  type: 'update-card-field' as const,
  payload: {
    field,
    brand,
    validity,
    error,
  },
});

export const updateFieldValidity = (
  field: FormFields,
  validity: boolean,
  errorCode?: NetworkError['code'],
) => ({
  type: 'set-field-validity' as const,
  payload: {
    field,
    validity,
    errorCode,
  },
});

export const updateFieldVisibility = (field: FormFields, value: boolean) => ({
  type: 'update-field-visibility' as const,
  payload: {
    field,
    value,
  },
});

export const setDisabled = (isDisabled: boolean) => ({
  type: 'set-disabled' as const,
  payload: isDisabled,
});

export const setSubmitState = (submitting: boolean, errorMessage?: string) => ({
  type: 'set-submitting' as const,
  payload: {
    submitting,
    errorMessage: errorMessage ?? null,
  },
});

export type CreditCardFormAction =
  | ReturnType<typeof setDisabled>
  | ReturnType<typeof setSubmitState>
  | ReturnType<typeof updateCardField>
  | ReturnType<typeof updateField>
  | ReturnType<typeof updateFieldValidity>
  | ReturnType<typeof updateFieldVisibility>;

interface DefaultValues {
  country: PIIString;
  zipCode?: PIIString;
  taxId?: string;
  threeDSecureRedirect?: string;
  stateTaxId?: string;
  promoCode?: string;
  isVatRegistered?: boolean;
}

export const creditCardInitialState = (
  defaults?: DefaultValues,
): CreditCardFormState => ({
  disabled: true,
  submitting: false,
  submitError: null,
  cardType: convertToPIIString('unknown'),
  number: {
    value: undefined, // controlled by Stripe
    invalid: false,
  },
  expirationDate: {
    value: undefined, // controlled by Stripe
    invalid: false,
  },
  cvv: {
    value: undefined, // controlled by Stripe
    invalid: false,
  },
  country: {
    value: defaults?.country ?? EMPTY_PII_STRING,
    invalid: false,
  },
  zipCode: {
    value: defaults?.zipCode ?? EMPTY_PII_STRING,
    invalid: false,
    hidden: false,
  },
  taxId: {
    value: defaults?.taxId ?? '',
    invalid: false,
    hidden: defaults?.taxId
      ? false
      : !acceptsTaxId(dangerouslyConvertPrivacyString(defaults?.country) ?? ''),
  },
  stateTaxId: {
    value: defaults?.stateTaxId ?? '',
    invalid: false,
    hidden: defaults?.stateTaxId
      ? false
      : !acceptsStateTaxId(
          dangerouslyConvertPrivacyString(defaults?.country) ?? '',
          dangerouslyConvertPrivacyString(defaults?.zipCode) ?? '',
        ),
  },
  promoCode: {
    value: defaults?.promoCode ?? '',
    invalid: false,
  },
  isVatRegistered: {
    value: defaults?.isVatRegistered ?? false,
    invalid: false,
    hidden: !acceptsVATRegistrationStatus(
      dangerouslyConvertPrivacyString(defaults?.country) ?? '',
    ),
  },
});

export const creditCardReducer: Reducer<
  CreditCardFormState,
  CreditCardFormAction
> = (state, action) => {
  switch (action.type) {
    case 'update-field':
      return {
        ...state,
        [action.payload.field]: {
          ...state[action.payload.field],
          value: action.payload.value,
          invalid: false,
          errorCode: undefined,
        },
        invalid: false,
      };

    case 'update-card-field':
      return {
        ...state,
        cardType: action.payload.brand
          ? convertToPIIString(action.payload.brand)
          : state.cardType,
        [action.payload.field]: {
          ...state[action.payload.field],
          invalid: action.payload.validity,
          errorMessage: action.payload.error,
        },
      };

    case 'set-field-validity':
      return {
        ...state,
        [action.payload.field]: {
          ...state[action.payload.field],
          invalid: !action.payload.validity,
          errorCode: action.payload.errorCode,
        },
        invalid: action.payload.validity,
      };

    case 'update-field-visibility':
      return {
        ...state,
        [action.payload.field]: {
          ...state[action.payload.field],
          hidden: !action.payload.value,
        },
      };

    case 'set-disabled':
      return {
        ...state,
        disabled: action.payload,
      };

    case 'set-submitting':
      return {
        ...state,
        submitting: action.payload.submitting,
        disabled: action.payload.submitting,
        submitError: action.payload.submitting
          ? null
          : action.payload.errorMessage,
      };

    default:
      return state;
  }
};

export interface UseCreditCardFormProps {
  defaultValues?: DefaultValues;
}

export const useStripeCreditCardForm = (
  configuration?: UseCreditCardFormProps,
) => {
  const stripe = useStripe();
  const elements = useElements();
  const { authorize3DSCreditCard } = useAuthorize3ds();
  const [state, dispatch] = useReducer(
    creditCardReducer,
    creditCardInitialState(configuration?.defaultValues),
  );
  const [preAuthorizeCardMutation] =
    usePreAuthorizeWorkspaceCreditCardMutation();
  const [updateCreditCardMutation] = useUpdateCreditCardMutation();
  const onCardNumberChange = useCallback(
    (event: StripeCardNumberElementChangeEvent) =>
      dispatch(
        updateCardField(
          'number',
          event.brand,
          !!event.error,
          event.error?.message,
        ),
      ),
    [dispatch],
  );

  const onCardExpirationChange = useCallback(
    (event: StripeCardExpiryElementChangeEvent) =>
      dispatch(
        updateCardField(
          'expirationDate',
          null,
          !!event.error,
          event.error?.message,
        ),
      ),
    [dispatch],
  );

  const onCardCvvChange = useCallback(
    (event: StripeCardCvcElementChangeEvent) =>
      dispatch(
        updateCardField('cvv', null, !!event.error, event.error?.message),
      ),
    [dispatch],
  );

  const onCountryChange = useCallback(
    (countryCode: string) => {
      dispatch(updateField('country', countryCode));

      dispatch(
        updateFieldValidity(
          'zipCode',
          isValidZipCode(
            convertToPIIString(
              dangerouslyConvertPrivacyString(state.zipCode.value),
            ),
            convertToPIIString(countryCode),
          ),
        ),
      );

      const showTaxId = acceptsTaxId(countryCode);
      dispatch(updateFieldVisibility('taxId', showTaxId));
      if (!showTaxId) {
        dispatch(updateField('taxId', ''));
        dispatch(updateFieldValidity('taxId', true));
      }

      const showStateTaxId = acceptsStateTaxId(
        countryCode,
        dangerouslyConvertPrivacyString(state.zipCode.value),
      );
      dispatch(updateFieldVisibility('stateTaxId', showStateTaxId));
      if (!showStateTaxId) {
        dispatch(updateField('stateTaxId', ''));
        dispatch(updateFieldValidity('stateTaxId', true));
      }

      const showIsVatRegistered = acceptsVATRegistrationStatus(countryCode);
      dispatch(updateFieldVisibility('isVatRegistered', showIsVatRegistered));
      dispatch(updateField('isVatRegistered', showIsVatRegistered));
    },
    [dispatch, state.zipCode.value],
  );

  const onZipCodeChange = useCallback(
    (value: string) => {
      dispatch(updateField('zipCode', value));

      const countryCode = dangerouslyConvertPrivacyString(state.country.value);
      const showTaxId = acceptsTaxId(countryCode);
      dispatch(updateFieldVisibility('taxId', showTaxId));
      if (!showTaxId) {
        dispatch(updateField('taxId', ''));
        dispatch(updateFieldValidity('taxId', true));
      }

      const showStateTaxId = acceptsStateTaxId(
        dangerouslyConvertPrivacyString(state.country.value),
        value,
      );
      dispatch(updateFieldVisibility('stateTaxId', showStateTaxId));
      if (!showStateTaxId) {
        dispatch(updateField('stateTaxId', ''));
        dispatch(updateFieldValidity('stateTaxId', true));
      }
    },
    [dispatch, state.country.value],
  );

  const onZipCodeBlur = useCallback(
    (value: string) =>
      dispatch(
        updateFieldValidity(
          'zipCode',
          isValidZipCode(convertToPIIString(value), state.country.value),
        ),
      ),
    [dispatch, state.country.value],
  );

  const onTaxIdChange = useCallback(
    (value: string) => dispatch(updateField('taxId', value)),
    [dispatch],
  );

  const onTaxIdBlur = useCallback(
    (value: string) =>
      dispatch(
        updateFieldValidity('taxId', isValidTaxId(value, state.country.value)),
      ),
    [dispatch, state.country.value],
  );

  const onStateTaxIdChange = useCallback(
    (value: string) => dispatch(updateField('stateTaxId', value)),
    [dispatch],
  );

  const onStateTaxIdBlur = useCallback(
    (value: string) =>
      dispatch(
        updateFieldValidity(
          'stateTaxId',
          isValidTaxId(value, state.country.value),
        ),
      ),
    [dispatch, state.country.value],
  );

  const onPromoCodeChange = useCallback(
    (value: string) => dispatch(updateField('promoCode', value)),
    [dispatch],
  );

  const onIsVatRegisteredChange = useCallback(
    (value: boolean) => dispatch(updateField('isVatRegistered', value)),
    [dispatch],
  );

  const disable = useCallback(() => dispatch(setDisabled(true)), [dispatch]);

  const enable = useCallback(() => {
    const isSanctionedCountry =
      state?.country?.value &&
      sanctionedCountries.includes(
        dangerouslyConvertPrivacyString(state.country.value),
      );
    if (!isSanctionedCountry) {
      return dispatch(setDisabled(false));
    }
  }, [dispatch, state.country.value]);

  const clearValidationError = useCallback(
    (field: FormFields) => dispatch(updateFieldValidity(field, true)),
    [dispatch],
  );

  const getInvalidFields = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error: any) => {
      const invalidFields: {
        field: FormFields;
        errorCode?: NetworkError['code'];
      }[] = [];

      if (requiresZipCode(state.country.value) && !state.zipCode.value) {
        invalidFields.push({ field: 'zipCode' });
      }

      const errorCode = getNetworkError(error)?.code;
      switch (errorCode) {
        case 'BILLING_INVALID_COUNTRY':
        case 'BILLING_BLOCKED_COUNTRY':
          invalidFields.push({ field: 'country', errorCode });
          break;
        case 'BILLING_INVALID_ZIP_CODE':
          invalidFields.push({ field: 'zipCode', errorCode });
          break;
        case 'BILLING_INVALID_TAX_ID':
          invalidFields.push({ field: 'taxId', errorCode });
          break;
        case 'BILLING_INVALID_STATE_TAX_ID':
          invalidFields.push({ field: 'stateTaxId', errorCode });
          break;
        case 'PROMO_CODE_EXPIRED':
        case 'PROMO_CODE_ALREADY_REDEEMED':
        case 'PROMO_CODE_INVALID_BILLING_PERIOD':
        case 'PROMO_CODE_INVALID':
        case 'PROMO_CODE_NOT_ELIGIBLE':
        case 'PROMO_CODE_NOT_FOUND':
        case 'BILLING_INVALID_DISCOUNT':
          invalidFields.push({ field: 'promoCode', errorCode });
          break;
        default:
      }

      return invalidFields;
    },
    [state.country.value, state.zipCode.value],
  );

  const tokenize = useCallback(async (): Promise<TokenizeResult> => {
    if (!stripe || !elements) {
      throw new Error('Stripe is not yet initialized');
    }
    const cardNumberElement = elements.getElement('cardNumber');
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardNumberElement!,
      billing_details: {
        address: {
          country:
            state.country.value === convertToPIIString('IC')
              ? 'ES'
              : dangerouslyConvertPrivacyString(state.country.value), // Stripe doesn't recognize IC as a valid country code
          postal_code: dangerouslyConvertPrivacyString(state.zipCode.value),
        },
      },
    });
    if (error) {
      throw error;
    }

    return {
      nonce: paymentMethod!.id as unknown as SecureString,
      cardType: convertToPIIString(paymentMethod!.card?.brand ?? ''),
      cardLast4: convertToPIIString(paymentMethod!.card?.last4 ?? ''),
      country: state.country.value,
      zipCode: state.zipCode.value,
      taxId: state.taxId.value,
      stateTaxId: state.stateTaxId.value,
      promoCode: state.promoCode.value,
      isVatRegistered: state.isVatRegistered.value,
    };
  }, [
    stripe,
    elements,
    state.country.value,
    state.taxId.value,
    state.stateTaxId.value,
    state.zipCode.value,
    state.promoCode.value,
    state.isVatRegistered.value,
  ]);

  useEffect(() => {
    if (stripe && elements) {
      enable();
    }
  }, [stripe, elements, enable]);

  const isCreditCardFieldValidationError = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error: any) =>
      error?.type === 'validation_error' || getInvalidFields(error).length > 0,
    [getInvalidFields],
  );

  const handleCreditCardFieldValidationErrors = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error: any) => {
      getInvalidFields(error).forEach((invalid) =>
        dispatch(updateFieldValidity(invalid.field, false, invalid.errorCode)),
      );
    },
    [getInvalidFields, dispatch],
  );

  /**
   * Submit credit card to preAuthorize API. If it fails due to the card
   * requiring 3DS authorization, will defer to the 3DS method above.
   * If it fails for any other reason, re-throw the error
   */
  const preAuthorizeCreditCardSubmit = useCallback(
    async ({
      idOrganization,
      freeTrial,
      product,
      payload,
      traceId,
      extendTrial,
    }: {
      idOrganization: string;
      freeTrial: boolean;
      product: number;
      payload: TokenizeResult;
      traceId?: string;
      extendTrial?: boolean;
    }): Promise<TokenizedCardDetails> => {
      const performPreauthMutation = async () => {
        await preAuthorizeCardMutation({
          variables: {
            country: payload.country,
            idOrganization,
            freeTrial,
            nonce: payload.nonce,
            product,
            stateTaxId: payload.stateTaxId,
            taxId: payload.taxId,
            traceId,
            zipCode: payload.zipCode,
            extendTrial,
            isVatRegistered: payload.isVatRegistered,
          },
        });

        return {
          cardLast4: payload.cardLast4,
          cardType: payload.cardType,
          country: payload.country,
          nonce: payload.nonce,
          stateTaxId: payload.stateTaxId ?? null,
          taxId: payload.taxId ?? null,
          zipCode: payload.zipCode ?? null,
          isVatRegistered: payload.isVatRegistered ?? null,
        };
      };

      try {
        return await performPreauthMutation();
      } catch (error) {
        const networkError = getNetworkError(error);
        const intentType = 'setupIntent';
        if (isRequires3DSError(networkError, intentType)) {
          await authorize3DSCreditCard({
            traceId,
            secret: networkError.setupIntentSecret,
            type: intentType,
            error,
          });

          return performPreauthMutation();
        }

        throw error;
      }
    },
    [authorize3DSCreditCard, preAuthorizeCardMutation],
  );

  /**
   * Submit credit card to changeCreditCard API. If it fails due to
   * the card requiring 3DS authorization, will defer to the 3DS method
   * above. If it fails for any other reason, re-throw the error
   */
  const updateCreditCardSubmit = useCallback(
    async ({
      idOrganization,
      payload,
      traceId,
    }: {
      idOrganization: string;
      payload: TokenizeResult;
      traceId?: string;
    }): Promise<TokenizedCardDetails> => {
      const performUpdateMutation = async () => {
        const result = await updateCreditCardMutation({
          variables: {
            country: payload.country,
            accountId: idOrganization,
            isVatRegistered: payload.isVatRegistered,
            nonce: payload.nonce,
            stateTaxId: payload.stateTaxId,
            taxId: payload.taxId,
            traceId,
            zipCode: payload.zipCode,
          },
          refetchQueries: [
            {
              query: RenewalPriceQuotesDocument,
              variables: { accountId: idOrganization },
              context: {
                operationName: 'RenewalPriceQuotes',
                document: RenewalPriceQuotesDocument,
              },
            },
          ],
        });

        const paidAccount =
          result.data!.updateOrganizationCreditCard!.paidAccount!;

        return {
          cardLast4: paidAccount.cardLast4 ?? payload.cardLast4,
          cardType: paidAccount.cardType,
          country: paidAccount.country!,
          isVatRegistered: paidAccount.isVatRegistered ?? false,
          nonce: payload.nonce,
          stateTaxId: paidAccount.stateTaxId ?? null,
          taxId: paidAccount.taxId ?? null,
          zipCode: paidAccount.zip ?? null,
        };
      };

      try {
        return await performUpdateMutation();
      } catch (error) {
        const networkError = getNetworkError(error);
        if (isRequires3DSError(networkError, 'setupIntent')) {
          await authorize3DSCreditCard({
            traceId,
            secret: networkError.setupIntentSecret,
            type: 'setupIntent',
            error,
          });
          return performUpdateMutation();
        } else if (isRequires3DSError(networkError, 'paymentIntent')) {
          await authorize3DSCreditCard({
            traceId,
            secret: networkError.paymentIntentSecret,
            type: 'paymentIntent',
            error,
          });
          return performUpdateMutation();
        }

        throw error;
      }
    },
    [authorize3DSCreditCard, updateCreditCardMutation],
  );

  /**
   * Update the credit card on file for a subscriber. Encapsulates
   * regular and 3DS cards. Handles form state throughout submission
   * and when errors occur, invalidates fields a necessary
   */
  const updateCreditCard = useCallback(
    async ({
      idOrganization,
      traceId,
    }: {
      idOrganization: string;
      traceId?: string;
    }): Promise<TokenizedCardDetails> => {
      dispatch(setSubmitState(true));
      try {
        const payload = await tokenize();
        const result = await updateCreditCardSubmit({
          idOrganization,
          payload,
          traceId,
        });

        dispatch(setSubmitState(false));

        return result;
      } catch (error) {
        if (isCreditCardFieldValidationError(error)) {
          handleCreditCardFieldValidationErrors(error);
          dispatch(setSubmitState(false));
        } else {
          let networkError: NetworkError | null = null;
          if (error instanceof ThreeDSAuthorizationError) {
            networkError = getNetworkError(error.apolloError);
          } else {
            networkError = getNetworkError(error);
          }
          if (isCardProcessingError(networkError)) {
            const dtProcessingCompletes = intl.formatDate(
              networkError.dtProcessingCompletes,
              {
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                dayPeriod: 'short',
              },
            );
            dispatch(
              setSubmitState(
                false,
                intl.formatMessage(
                  {
                    id: 'templates.credit_card.card-currently-processing',
                    defaultMessage:
                      'This workspace currently has a payment already being processed. Please wait to update your credit card until after the payment is complete {dtProcessingCompletes}.',
                    description:
                      'Explains that you cannot update your credit card until the pending payment is complete',
                  },
                  { dtProcessingCompletes },
                ),
              ),
            );
          } else {
            dispatch(
              setSubmitState(
                false,
                localizeErrorCode(
                  'paidAccount',
                  networkError?.code ?? 'BILLING_SERVICE_UNAVAILABLE',
                ),
              ),
            );
          }
        }

        throw error;
      }
    },
    [
      handleCreditCardFieldValidationErrors,
      isCreditCardFieldValidationError,
      tokenize,
      updateCreditCardSubmit,
    ],
  );

  /**
   * Pre-authorize a credit card. Encapsulates regular and 3DS cards.
   * Handles form state throughout submission and when errors occur,
   * invalidating fields as necessary
   */
  const preAuthorizeCard = useCallback(
    async ({
      idOrganization,
      freeTrial = false,
      product,
      traceId,
      extendTrial,
    }: {
      idOrganization: string;
      freeTrial?: boolean;
      product: number;
      traceId?: string;
      extendTrial?: boolean;
    }): Promise<TokenizedCardDetails> => {
      dispatch(setSubmitState(true));
      try {
        const payload = await tokenize();
        const result = await preAuthorizeCreditCardSubmit({
          idOrganization,
          freeTrial,
          product,
          payload,
          traceId,
          extendTrial,
        });

        dispatch(setSubmitState(false));

        return result;
      } catch (error) {
        if (isCreditCardFieldValidationError(error)) {
          handleCreditCardFieldValidationErrors(error);
          dispatch(setSubmitState(false));
        } else {
          const networkError = getNetworkError(error);
          dispatch(
            setSubmitState(
              false,
              localizeErrorCode(
                'paidAccount',
                networkError?.code ?? 'BILLING_SERVICE_UNAVAILABLE',
              ),
            ),
          );
        }

        throw error;
      }
    },
    [
      isCreditCardFieldValidationError,
      handleCreditCardFieldValidationErrors,
      preAuthorizeCreditCardSubmit,
      tokenize,
    ],
  );

  return {
    country: state.country.value,
    zipCode: state.zipCode.value,
    taxId: state.taxId.value,
    stateTaxId: state.stateTaxId.value,
    promoCode: state.promoCode.value,
    isVatRegistered: state.isVatRegistered.value,
    isDisabled: state.disabled,
    isUnavailable: !stripe || !elements,
    isSubmitting: state.submitting,
    submitError: state.submitError,
    tokenize,
    enable,
    disable,
    clearValidationError,
    isCreditCardFieldValidationError,
    handleCreditCardFieldValidationErrors,
    preAuthorizeCard,
    updateCreditCard,
    cardNumberProps: {
      type: 'stripe' as const,
      isInvalid: state.number.invalid,
      errorMessage: state.number.errorMessage,
      isDisabled: state.disabled,
      onChange: onCardNumberChange,
    },
    expirationProps: {
      type: 'stripe' as const,
      isInvalid: state.expirationDate.invalid,
      errorMessage: state.expirationDate.errorMessage,
      isDisabled: state.disabled,
      onChange: onCardExpirationChange,
    },
    cvvProps: {
      type: 'stripe' as const,
      cardType: state.cardType,
      isInvalid: state.cvv.invalid,
      errorMessage: state.cvv.errorMessage,
      isDisabled: state.disabled,
      onChange: onCardCvvChange,
    },
    countryProps: {
      defaultValue: state.country.value,
      isInvalid: state.country.invalid,
      isDisabled: state.disabled,
      errorCode: state.country.errorCode,
      onChange: onCountryChange,
    },
    zipCodeProps: {
      defaultValue: state.zipCode.value,
      hidden: state.zipCode.hidden,
      country: state.country.value,
      isInvalid: state.zipCode.invalid,
      isDisabled: state.disabled,
      errorCode: state.zipCode.errorCode,
      onChange: onZipCodeChange,
      onBlur: onZipCodeBlur,
    },
    taxIdProps: {
      defaultValue: state.taxId.value,
      hidden: state.taxId.hidden,
      country: state.country.value,
      zipCode: state.zipCode.value,
      isInvalid: state.taxId.invalid,
      isDisabled: state.disabled,
      errorCode: state.taxId.errorCode,
      onChange: onTaxIdChange,
      onBlur: onTaxIdBlur,
    },
    stateTaxIdProps: {
      defaultValue: state.stateTaxId.value,
      hidden: state.stateTaxId.hidden,
      country: state.country.value,
      zipCode: state.zipCode.value,
      isInvalid: state.stateTaxId.invalid,
      isDisabled: state.disabled,
      errorCode: state.stateTaxId.errorCode,
      onChange: onStateTaxIdChange,
      onBlur: onStateTaxIdBlur,
    },
    promoCodeProps: {
      defaultValue: state.promoCode.value,
      isInvalid: state.promoCode.invalid,
      isDisabled: state.disabled,
      errorCode: state.promoCode.errorCode,
      onChange: onPromoCodeChange,
    },
    isVatRegisteredProps: {
      isChecked: state.isVatRegistered.value,
      hidden: state.isVatRegistered.hidden,
      country: state.country.value,
      isInvalid: state.isVatRegistered.invalid,
      isDisabled: state.disabled,
      errorCode: state.isVatRegistered.errorCode,
      onChange: onIsVatRegisteredChange,
    },
  };
};
