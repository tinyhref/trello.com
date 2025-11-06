import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const PreAuthorizeWorkspaceCreditCardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PreAuthorizeWorkspaceCreditCard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"country"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PIIString"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"extendTrial"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"freeTrial"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idOrganization"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isVatRegistered"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nonce"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SecureString"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"product"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stateTaxId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taxId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"zipCode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PIIString"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"preAuthorizeWorkspaceCreditCard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"country"},"value":{"kind":"Variable","name":{"kind":"Name","value":"country"}}},{"kind":"Argument","name":{"kind":"Name","value":"extendTrial"},"value":{"kind":"Variable","name":{"kind":"Name","value":"extendTrial"}}},{"kind":"Argument","name":{"kind":"Name","value":"freeTrial"},"value":{"kind":"Variable","name":{"kind":"Name","value":"freeTrial"}}},{"kind":"Argument","name":{"kind":"Name","value":"idOrganization"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idOrganization"}}},{"kind":"Argument","name":{"kind":"Name","value":"isVatRegistered"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isVatRegistered"}}},{"kind":"Argument","name":{"kind":"Name","value":"nonce"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nonce"}}},{"kind":"Argument","name":{"kind":"Name","value":"product"},"value":{"kind":"Variable","name":{"kind":"Name","value":"product"}}},{"kind":"Argument","name":{"kind":"Name","value":"stateTaxId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stateTaxId"}}},{"kind":"Argument","name":{"kind":"Name","value":"taxId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taxId"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"zipCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"zipCode"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paidAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cardLast4"}},{"kind":"Field","name":{"kind":"Name","value":"cardType"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"contactFullName"}},{"kind":"Field","name":{"kind":"Name","value":"contactLocale"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"isVatRegistered"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriber"}},{"kind":"Field","name":{"kind":"Name","value":"stateTaxId"}},{"kind":"Field","name":{"kind":"Name","value":"taxId"}},{"kind":"Field","name":{"kind":"Name","value":"zip"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"PreAuthorizeWorkspaceCreditCard","document":PreAuthorizeWorkspaceCreditCardDocument}} as const;
export type PreAuthorizeWorkspaceCreditCardMutationVariables = Types.Exact<{
  country: Types.Scalars['PIIString']['input'];
  extendTrial?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  freeTrial?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  idOrganization: Types.Scalars['ID']['input'];
  isVatRegistered?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  nonce: Types.Scalars['SecureString']['input'];
  product: Types.Scalars['Int']['input'];
  stateTaxId?: Types.InputMaybe<Types.Scalars['String']['input']>;
  taxId?: Types.InputMaybe<Types.Scalars['String']['input']>;
  traceId?: Types.InputMaybe<Types.Scalars['String']['input']>;
  zipCode?: Types.InputMaybe<Types.Scalars['PIIString']['input']>;
}>;


export type PreAuthorizeWorkspaceCreditCardMutation = (
  { __typename: 'Mutation' }
  & { preAuthorizeWorkspaceCreditCard?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id'>
    & { paidAccount?: Types.Maybe<(
      { __typename: 'PaidAccount' }
      & Pick<
        Types.PaidAccount,
        | 'cardLast4'
        | 'cardType'
        | 'contactEmail'
        | 'contactFullName'
        | 'contactLocale'
        | 'country'
        | 'isVatRegistered'
        | 'ixSubscriber'
        | 'stateTaxId'
        | 'taxId'
        | 'zip'
      >
    )> }
  )> }
);

export type PreAuthorizeWorkspaceCreditCardMutationFn = Apollo.MutationFunction<
  PreAuthorizeWorkspaceCreditCardMutation,
  PreAuthorizeWorkspaceCreditCardMutationVariables
>;

/**
 * __usePreAuthorizeWorkspaceCreditCardMutation__
 *
 * To run a mutation, you first call `usePreAuthorizeWorkspaceCreditCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePreAuthorizeWorkspaceCreditCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [preAuthorizeWorkspaceCreditCardMutation, { data, loading, error }] = usePreAuthorizeWorkspaceCreditCardMutation({
 *   variables: {
 *      country: // value for 'country'
 *      extendTrial: // value for 'extendTrial'
 *      freeTrial: // value for 'freeTrial'
 *      idOrganization: // value for 'idOrganization'
 *      isVatRegistered: // value for 'isVatRegistered'
 *      nonce: // value for 'nonce'
 *      product: // value for 'product'
 *      stateTaxId: // value for 'stateTaxId'
 *      taxId: // value for 'taxId'
 *      traceId: // value for 'traceId'
 *      zipCode: // value for 'zipCode'
 *   },
 * });
 */
export function usePreAuthorizeWorkspaceCreditCardMutation(
  baseOptions?: Apollo.MutationHookOptions<
    PreAuthorizeWorkspaceCreditCardMutation,
    PreAuthorizeWorkspaceCreditCardMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    PreAuthorizeWorkspaceCreditCardMutation,
    PreAuthorizeWorkspaceCreditCardMutationVariables
  >(PreAuthorizeWorkspaceCreditCardDocument, options);
}
export type PreAuthorizeWorkspaceCreditCardMutationHookResult = ReturnType<
  typeof usePreAuthorizeWorkspaceCreditCardMutation
>;
export type PreAuthorizeWorkspaceCreditCardMutationResult =
  Apollo.MutationResult<PreAuthorizeWorkspaceCreditCardMutation>;
export type PreAuthorizeWorkspaceCreditCardMutationOptions =
  Apollo.BaseMutationOptions<
    PreAuthorizeWorkspaceCreditCardMutation,
    PreAuthorizeWorkspaceCreditCardMutationVariables
  >;
