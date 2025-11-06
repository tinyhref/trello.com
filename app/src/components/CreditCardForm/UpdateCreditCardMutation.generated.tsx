import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const UpdateCreditCardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCreditCard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"country"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PIIString"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isVatRegistered"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nonce"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SecureString"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stateTaxId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taxId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"zipCode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PIIString"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOrganizationCreditCard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accountId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}}},{"kind":"Argument","name":{"kind":"Name","value":"country"},"value":{"kind":"Variable","name":{"kind":"Name","value":"country"}}},{"kind":"Argument","name":{"kind":"Name","value":"isVatRegistered"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isVatRegistered"}}},{"kind":"Argument","name":{"kind":"Name","value":"nonce"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nonce"}}},{"kind":"Argument","name":{"kind":"Name","value":"stateTaxId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stateTaxId"}}},{"kind":"Argument","name":{"kind":"Name","value":"taxId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taxId"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"zipCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"zipCode"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paidAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cardLast4"}},{"kind":"Field","name":{"kind":"Name","value":"cardType"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"isVatRegistered"}},{"kind":"Field","name":{"kind":"Name","value":"standing"}},{"kind":"Field","name":{"kind":"Name","value":"stateTaxId"}},{"kind":"Field","name":{"kind":"Name","value":"taxId"}},{"kind":"Field","name":{"kind":"Name","value":"zip"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"UpdateCreditCard","document":UpdateCreditCardDocument}} as const;
export type UpdateCreditCardMutationVariables = Types.Exact<{
  accountId: Types.Scalars['ID']['input'];
  country: Types.Scalars['PIIString']['input'];
  isVatRegistered?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  nonce: Types.Scalars['SecureString']['input'];
  stateTaxId?: Types.InputMaybe<Types.Scalars['String']['input']>;
  taxId?: Types.InputMaybe<Types.Scalars['String']['input']>;
  traceId?: Types.InputMaybe<Types.Scalars['String']['input']>;
  zipCode?: Types.InputMaybe<Types.Scalars['PIIString']['input']>;
}>;


export type UpdateCreditCardMutation = (
  { __typename: 'Mutation' }
  & { updateOrganizationCreditCard: (
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id'>
    & { paidAccount?: Types.Maybe<(
      { __typename: 'PaidAccount' }
      & Pick<
        Types.PaidAccount,
        | 'cardLast4'
        | 'cardType'
        | 'country'
        | 'isVatRegistered'
        | 'standing'
        | 'stateTaxId'
        | 'taxId'
        | 'zip'
      >
    )> }
  ) }
);

export type UpdateCreditCardMutationFn = Apollo.MutationFunction<
  UpdateCreditCardMutation,
  UpdateCreditCardMutationVariables
>;

/**
 * __useUpdateCreditCardMutation__
 *
 * To run a mutation, you first call `useUpdateCreditCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCreditCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCreditCardMutation, { data, loading, error }] = useUpdateCreditCardMutation({
 *   variables: {
 *      accountId: // value for 'accountId'
 *      country: // value for 'country'
 *      isVatRegistered: // value for 'isVatRegistered'
 *      nonce: // value for 'nonce'
 *      stateTaxId: // value for 'stateTaxId'
 *      taxId: // value for 'taxId'
 *      traceId: // value for 'traceId'
 *      zipCode: // value for 'zipCode'
 *   },
 * });
 */
export function useUpdateCreditCardMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateCreditCardMutation,
    UpdateCreditCardMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateCreditCardMutation,
    UpdateCreditCardMutationVariables
  >(UpdateCreditCardDocument, options);
}
export type UpdateCreditCardMutationHookResult = ReturnType<
  typeof useUpdateCreditCardMutation
>;
export type UpdateCreditCardMutationResult =
  Apollo.MutationResult<UpdateCreditCardMutation>;
export type UpdateCreditCardMutationOptions = Apollo.BaseMutationOptions<
  UpdateCreditCardMutation,
  UpdateCreditCardMutationVariables
>;
