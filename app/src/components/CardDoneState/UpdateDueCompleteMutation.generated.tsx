import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const UpdateDueCompleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDueComplete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dueComplete"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCardDueComplete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"dueComplete"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dueComplete"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"badges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dueComplete"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dueComplete"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"UpdateDueComplete","document":UpdateDueCompleteDocument}} as const;
export type UpdateDueCompleteMutationVariables = Types.Exact<{
  cardId: Types.Scalars['ID']['input'];
  dueComplete: Types.Scalars['Boolean']['input'];
  traceId: Types.Scalars['String']['input'];
}>;


export type UpdateDueCompleteMutation = (
  { __typename: 'Mutation' }
  & { updateCardDueComplete?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'dueComplete'>
    & { badges: (
      { __typename: 'Card_Badges' }
      & Pick<Types.Card_Badges, 'dueComplete'>
    ) }
  )> }
);

export type UpdateDueCompleteMutationFn = Apollo.MutationFunction<
  UpdateDueCompleteMutation,
  UpdateDueCompleteMutationVariables
>;

/**
 * __useUpdateDueCompleteMutation__
 *
 * To run a mutation, you first call `useUpdateDueCompleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDueCompleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDueCompleteMutation, { data, loading, error }] = useUpdateDueCompleteMutation({
 *   variables: {
 *      cardId: // value for 'cardId'
 *      dueComplete: // value for 'dueComplete'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useUpdateDueCompleteMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateDueCompleteMutation,
    UpdateDueCompleteMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateDueCompleteMutation,
    UpdateDueCompleteMutationVariables
  >(UpdateDueCompleteDocument, options);
}
export type UpdateDueCompleteMutationHookResult = ReturnType<
  typeof useUpdateDueCompleteMutation
>;
export type UpdateDueCompleteMutationResult =
  Apollo.MutationResult<UpdateDueCompleteMutation>;
export type UpdateDueCompleteMutationOptions = Apollo.BaseMutationOptions<
  UpdateDueCompleteMutation,
  UpdateDueCompleteMutationVariables
>;
