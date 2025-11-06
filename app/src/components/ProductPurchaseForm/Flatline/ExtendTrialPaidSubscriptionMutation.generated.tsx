import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const ExtendTrialPaidSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ExtendTrialPaidSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"acceptTOS"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idOrganization"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nonce"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SecureString"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"product"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"extendTrialPaidSubscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"acceptTOS"},"value":{"kind":"Variable","name":{"kind":"Name","value":"acceptTOS"}}},{"kind":"Argument","name":{"kind":"Name","value":"idOrganization"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idOrganization"}}},{"kind":"Argument","name":{"kind":"Name","value":"nonce"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nonce"}}},{"kind":"Argument","name":{"kind":"Name","value":"product"},"value":{"kind":"Variable","name":{"kind":"Name","value":"product"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"offering"}},{"kind":"Field","name":{"kind":"Name","value":"paidAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"billingDates"}},{"kind":"Field","name":{"kind":"Name","value":"canRenew"}},{"kind":"Field","name":{"kind":"Name","value":"cardLast4"}},{"kind":"Field","name":{"kind":"Name","value":"cardType"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"contactFullName"}},{"kind":"Field","name":{"kind":"Name","value":"contactLocale"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"dateFirstSubscription"}},{"kind":"Field","name":{"kind":"Name","value":"datePendingDisabled"}},{"kind":"Field","name":{"kind":"Name","value":"expirationDates"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceDetails"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriber"}},{"kind":"Field","name":{"kind":"Name","value":"needsCreditCardUpdate"}},{"kind":"Field","name":{"kind":"Name","value":"paidProduct"}},{"kind":"Field","name":{"kind":"Name","value":"previousSubscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dtCancelled"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriptionProductId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productOverride"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"autoUpgrade"}},{"kind":"Field","name":{"kind":"Name","value":"dateEnd"}},{"kind":"Field","name":{"kind":"Name","value":"dateStart"}},{"kind":"Field","name":{"kind":"Name","value":"product"}}]}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledChange"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ixSubscriptionProduct"}},{"kind":"Field","name":{"kind":"Name","value":"nextChangeTimestamp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"standing"}},{"kind":"Field","name":{"kind":"Name","value":"stateTaxId"}},{"kind":"Field","name":{"kind":"Name","value":"taxId"}},{"kind":"Field","name":{"kind":"Name","value":"trialExpiration"}},{"kind":"Field","name":{"kind":"Name","value":"trialType"}},{"kind":"Field","name":{"kind":"Name","value":"zip"}}]}},{"kind":"Field","name":{"kind":"Name","value":"products"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"ExtendTrialPaidSubscription","document":ExtendTrialPaidSubscriptionDocument}} as const;
export type ExtendTrialPaidSubscriptionMutationVariables = Types.Exact<{
  acceptTOS: Types.Scalars['Boolean']['input'];
  idOrganization: Types.Scalars['ID']['input'];
  nonce: Types.Scalars['SecureString']['input'];
  product: Types.Scalars['Int']['input'];
  traceId?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type ExtendTrialPaidSubscriptionMutation = (
  { __typename: 'Mutation' }
  & { extendTrialPaidSubscription?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id' | 'offering' | 'products'>
    & { paidAccount?: Types.Maybe<(
      { __typename: 'PaidAccount' }
      & Pick<
        Types.PaidAccount,
        | 'billingDates'
        | 'canRenew'
        | 'cardLast4'
        | 'cardType'
        | 'contactEmail'
        | 'contactFullName'
        | 'contactLocale'
        | 'country'
        | 'dateFirstSubscription'
        | 'datePendingDisabled'
        | 'expirationDates'
        | 'invoiceDetails'
        | 'ixSubscriber'
        | 'needsCreditCardUpdate'
        | 'paidProduct'
        | 'products'
        | 'standing'
        | 'stateTaxId'
        | 'taxId'
        | 'trialExpiration'
        | 'trialType'
        | 'zip'
      >
      & {
        previousSubscription?: Types.Maybe<(
          { __typename: 'PreviousSubscription' }
          & Pick<Types.PreviousSubscription, 'dtCancelled' | 'ixSubscriptionProductId'>
        )>,
        productOverride?: Types.Maybe<(
          { __typename: 'ProductOverride' }
          & Pick<
            Types.ProductOverride,
            | 'autoUpgrade'
            | 'dateEnd'
            | 'dateStart'
            | 'product'
          >
        )>,
        scheduledChange?: Types.Maybe<(
          { __typename: 'ScheduledChange' }
          & Pick<Types.ScheduledChange, 'ixSubscriptionProduct' | 'nextChangeTimestamp'>
        )>,
      }
    )> }
  )> }
);

export type ExtendTrialPaidSubscriptionMutationFn = Apollo.MutationFunction<
  ExtendTrialPaidSubscriptionMutation,
  ExtendTrialPaidSubscriptionMutationVariables
>;

/**
 * __useExtendTrialPaidSubscriptionMutation__
 *
 * To run a mutation, you first call `useExtendTrialPaidSubscriptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useExtendTrialPaidSubscriptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [extendTrialPaidSubscriptionMutation, { data, loading, error }] = useExtendTrialPaidSubscriptionMutation({
 *   variables: {
 *      acceptTOS: // value for 'acceptTOS'
 *      idOrganization: // value for 'idOrganization'
 *      nonce: // value for 'nonce'
 *      product: // value for 'product'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useExtendTrialPaidSubscriptionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ExtendTrialPaidSubscriptionMutation,
    ExtendTrialPaidSubscriptionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ExtendTrialPaidSubscriptionMutation,
    ExtendTrialPaidSubscriptionMutationVariables
  >(ExtendTrialPaidSubscriptionDocument, options);
}
export type ExtendTrialPaidSubscriptionMutationHookResult = ReturnType<
  typeof useExtendTrialPaidSubscriptionMutation
>;
export type ExtendTrialPaidSubscriptionMutationResult =
  Apollo.MutationResult<ExtendTrialPaidSubscriptionMutation>;
export type ExtendTrialPaidSubscriptionMutationOptions =
  Apollo.BaseMutationOptions<
    ExtendTrialPaidSubscriptionMutation,
    ExtendTrialPaidSubscriptionMutationVariables
  >;
