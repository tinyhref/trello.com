import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const AddFreeTrialCreditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddFreeTrialCredit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"count"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"via"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addFreeTrial"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"count"},"value":{"kind":"Variable","name":{"kind":"Name","value":"count"}}},{"kind":"Argument","name":{"kind":"Name","value":"orgId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"via"},"value":{"kind":"Variable","name":{"kind":"Name","value":"via"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"offering"}},{"kind":"Field","name":{"kind":"Name","value":"paidAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateFirstSubscription"}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"standing"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"AddFreeTrialCredit","document":AddFreeTrialCreditDocument}} as const;
export type AddFreeTrialCreditMutationVariables = Types.Exact<{
  count?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  orgId: Types.Scalars['ID']['input'];
  traceId: Types.Scalars['String']['input'];
  via?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type AddFreeTrialCreditMutation = (
  { __typename: 'Mutation' }
  & { addFreeTrial?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id' | 'offering'>
    & { paidAccount?: Types.Maybe<(
      { __typename: 'PaidAccount' }
      & Pick<Types.PaidAccount, 'dateFirstSubscription' | 'products' | 'standing'>
    )> }
  )> }
);

export type AddFreeTrialCreditMutationFn = Apollo.MutationFunction<
  AddFreeTrialCreditMutation,
  AddFreeTrialCreditMutationVariables
>;

/**
 * __useAddFreeTrialCreditMutation__
 *
 * To run a mutation, you first call `useAddFreeTrialCreditMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddFreeTrialCreditMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addFreeTrialCreditMutation, { data, loading, error }] = useAddFreeTrialCreditMutation({
 *   variables: {
 *      count: // value for 'count'
 *      orgId: // value for 'orgId'
 *      traceId: // value for 'traceId'
 *      via: // value for 'via'
 *   },
 * });
 */
export function useAddFreeTrialCreditMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AddFreeTrialCreditMutation,
    AddFreeTrialCreditMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AddFreeTrialCreditMutation,
    AddFreeTrialCreditMutationVariables
  >(AddFreeTrialCreditDocument, options);
}
export type AddFreeTrialCreditMutationHookResult = ReturnType<
  typeof useAddFreeTrialCreditMutation
>;
export type AddFreeTrialCreditMutationResult =
  Apollo.MutationResult<AddFreeTrialCreditMutation>;
export type AddFreeTrialCreditMutationOptions = Apollo.BaseMutationOptions<
  AddFreeTrialCreditMutation,
  AddFreeTrialCreditMutationVariables
>;
