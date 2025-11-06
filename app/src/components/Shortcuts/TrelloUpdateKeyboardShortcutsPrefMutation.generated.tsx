import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const TrelloUpdateKeyboardShortcutsPrefDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TrelloUpdateKeyboardShortcutsPref"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberAri"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"value"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateKeyboardShortcutsPref"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberAri"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"value"}}}]}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloKeyboardShortcuts","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"TrelloUpdateKeyboardShortcutsPref","document":TrelloUpdateKeyboardShortcutsPrefDocument}} as const;
export type TrelloUpdateKeyboardShortcutsPrefMutationVariables = Types.Exact<{
  memberAri: Types.Scalars['ID']['input'];
  value: Types.Scalars['Boolean']['input'];
}>;


export type TrelloUpdateKeyboardShortcutsPrefMutation = (
  { __typename: 'Mutation' }
  & { trello: (
    { __typename: 'TrelloMutationApi' }
    & { updateKeyboardShortcutsPref?: Types.Maybe<(
      { __typename: 'TrelloUpdateKeyboardShortcutsPrefPayload' }
      & Pick<Types.TrelloUpdateKeyboardShortcutsPrefPayload, 'success'>
      & { errors?: Types.Maybe<Array<(
        { __typename: 'MutationError' }
        & Pick<Types.MutationError, 'message'>
      )>> }
    )> }
  ) }
);

export type TrelloUpdateKeyboardShortcutsPrefMutationFn =
  Apollo.MutationFunction<
    TrelloUpdateKeyboardShortcutsPrefMutation,
    TrelloUpdateKeyboardShortcutsPrefMutationVariables
  >;

/**
 * __useTrelloUpdateKeyboardShortcutsPrefMutation__
 *
 * To run a mutation, you first call `useTrelloUpdateKeyboardShortcutsPrefMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTrelloUpdateKeyboardShortcutsPrefMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [trelloUpdateKeyboardShortcutsPrefMutation, { data, loading, error }] = useTrelloUpdateKeyboardShortcutsPrefMutation({
 *   variables: {
 *      memberAri: // value for 'memberAri'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useTrelloUpdateKeyboardShortcutsPrefMutation(
  baseOptions?: Apollo.MutationHookOptions<
    TrelloUpdateKeyboardShortcutsPrefMutation,
    TrelloUpdateKeyboardShortcutsPrefMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    TrelloUpdateKeyboardShortcutsPrefMutation,
    TrelloUpdateKeyboardShortcutsPrefMutationVariables
  >(TrelloUpdateKeyboardShortcutsPrefDocument, options);
}
export type TrelloUpdateKeyboardShortcutsPrefMutationHookResult = ReturnType<
  typeof useTrelloUpdateKeyboardShortcutsPrefMutation
>;
export type TrelloUpdateKeyboardShortcutsPrefMutationResult =
  Apollo.MutationResult<TrelloUpdateKeyboardShortcutsPrefMutation>;
export type TrelloUpdateKeyboardShortcutsPrefMutationOptions =
  Apollo.BaseMutationOptions<
    TrelloUpdateKeyboardShortcutsPrefMutation,
    TrelloUpdateKeyboardShortcutsPrefMutationVariables
  >;
