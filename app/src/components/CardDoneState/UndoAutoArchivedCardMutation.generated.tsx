import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const UndoAutoArchivedCardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UndoAutoArchivedCard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unarchiveCard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idCard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"dateClosed"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"UndoAutoArchivedCard","document":UndoAutoArchivedCardDocument}} as const;
export type UndoAutoArchivedCardMutationVariables = Types.Exact<{
  idCard: Types.Scalars['ID']['input'];
  traceId: Types.Scalars['String']['input'];
}>;


export type UndoAutoArchivedCardMutation = (
  { __typename: 'Mutation' }
  & { unarchiveCard?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'closed' | 'dateClosed'>
  )> }
);

export type UndoAutoArchivedCardMutationFn = Apollo.MutationFunction<
  UndoAutoArchivedCardMutation,
  UndoAutoArchivedCardMutationVariables
>;

/**
 * __useUndoAutoArchivedCardMutation__
 *
 * To run a mutation, you first call `useUndoAutoArchivedCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUndoAutoArchivedCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [undoAutoArchivedCardMutation, { data, loading, error }] = useUndoAutoArchivedCardMutation({
 *   variables: {
 *      idCard: // value for 'idCard'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useUndoAutoArchivedCardMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UndoAutoArchivedCardMutation,
    UndoAutoArchivedCardMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UndoAutoArchivedCardMutation,
    UndoAutoArchivedCardMutationVariables
  >(UndoAutoArchivedCardDocument, options);
}
export type UndoAutoArchivedCardMutationHookResult = ReturnType<
  typeof useUndoAutoArchivedCardMutation
>;
export type UndoAutoArchivedCardMutationResult =
  Apollo.MutationResult<UndoAutoArchivedCardMutation>;
export type UndoAutoArchivedCardMutationOptions = Apollo.BaseMutationOptions<
  UndoAutoArchivedCardMutation,
  UndoAutoArchivedCardMutationVariables
>;
