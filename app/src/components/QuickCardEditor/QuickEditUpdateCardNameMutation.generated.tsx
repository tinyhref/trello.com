import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const QuickEditUpdateCardNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"QuickEditUpdateCardName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCardName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idCard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cardRole"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"QuickEditUpdateCardName","document":QuickEditUpdateCardNameDocument}} as const;
export type QuickEditUpdateCardNameMutationVariables = Types.Exact<{
  cardId: Types.Scalars['ID']['input'];
  name: Types.Scalars['String']['input'];
  traceId: Types.Scalars['String']['input'];
}>;


export type QuickEditUpdateCardNameMutation = (
  { __typename: 'Mutation' }
  & { updateCardName?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'cardRole' | 'name'>
  )> }
);

export type QuickEditUpdateCardNameMutationFn = Apollo.MutationFunction<
  QuickEditUpdateCardNameMutation,
  QuickEditUpdateCardNameMutationVariables
>;

/**
 * __useQuickEditUpdateCardNameMutation__
 *
 * To run a mutation, you first call `useQuickEditUpdateCardNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useQuickEditUpdateCardNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [quickEditUpdateCardNameMutation, { data, loading, error }] = useQuickEditUpdateCardNameMutation({
 *   variables: {
 *      cardId: // value for 'cardId'
 *      name: // value for 'name'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useQuickEditUpdateCardNameMutation(
  baseOptions?: Apollo.MutationHookOptions<
    QuickEditUpdateCardNameMutation,
    QuickEditUpdateCardNameMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    QuickEditUpdateCardNameMutation,
    QuickEditUpdateCardNameMutationVariables
  >(QuickEditUpdateCardNameDocument, options);
}
export type QuickEditUpdateCardNameMutationHookResult = ReturnType<
  typeof useQuickEditUpdateCardNameMutation
>;
export type QuickEditUpdateCardNameMutationResult =
  Apollo.MutationResult<QuickEditUpdateCardNameMutation>;
export type QuickEditUpdateCardNameMutationOptions = Apollo.BaseMutationOptions<
  QuickEditUpdateCardNameMutation,
  QuickEditUpdateCardNameMutationVariables
>;
