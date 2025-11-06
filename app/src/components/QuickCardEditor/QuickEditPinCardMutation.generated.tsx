import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const QuickEditPinCardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"QuickEditPinCard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pinned"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setPinCard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idCard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}}},{"kind":"Argument","name":{"kind":"Name","value":"pinned"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pinned"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pinned"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"QuickEditPinCard","document":QuickEditPinCardDocument}} as const;
export type QuickEditPinCardMutationVariables = Types.Exact<{
  idCard: Types.Scalars['ID']['input'];
  pinned: Types.Scalars['Boolean']['input'];
  traceId: Types.Scalars['String']['input'];
}>;


export type QuickEditPinCardMutation = (
  { __typename: 'Mutation' }
  & { setPinCard?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'pinned'>
  )> }
);

export type QuickEditPinCardMutationFn = Apollo.MutationFunction<
  QuickEditPinCardMutation,
  QuickEditPinCardMutationVariables
>;

/**
 * __useQuickEditPinCardMutation__
 *
 * To run a mutation, you first call `useQuickEditPinCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useQuickEditPinCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [quickEditPinCardMutation, { data, loading, error }] = useQuickEditPinCardMutation({
 *   variables: {
 *      idCard: // value for 'idCard'
 *      pinned: // value for 'pinned'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useQuickEditPinCardMutation(
  baseOptions?: Apollo.MutationHookOptions<
    QuickEditPinCardMutation,
    QuickEditPinCardMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    QuickEditPinCardMutation,
    QuickEditPinCardMutationVariables
  >(QuickEditPinCardDocument, options);
}
export type QuickEditPinCardMutationHookResult = ReturnType<
  typeof useQuickEditPinCardMutation
>;
export type QuickEditPinCardMutationResult =
  Apollo.MutationResult<QuickEditPinCardMutation>;
export type QuickEditPinCardMutationOptions = Apollo.BaseMutationOptions<
  QuickEditPinCardMutation,
  QuickEditPinCardMutationVariables
>;
