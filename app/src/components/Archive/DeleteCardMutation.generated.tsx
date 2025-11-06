import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const DeleteCardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idCard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"DeleteCard","document":DeleteCardDocument}} as const;
export type DeleteCardMutationVariables = Types.Exact<{
  idCard: Types.Scalars['ID']['input'];
  traceId: Types.Scalars['String']['input'];
}>;


export type DeleteCardMutation = (
  { __typename: 'Mutation' }
  & { deleteCard?: Types.Maybe<(
    { __typename: 'Card_DeleteResponse' }
    & Pick<Types.Card_DeleteResponse, 'success'>
  )> }
);

export type DeleteCardMutationFn = Apollo.MutationFunction<
  DeleteCardMutation,
  DeleteCardMutationVariables
>;

/**
 * __useDeleteCardMutation__
 *
 * To run a mutation, you first call `useDeleteCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCardMutation, { data, loading, error }] = useDeleteCardMutation({
 *   variables: {
 *      idCard: // value for 'idCard'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useDeleteCardMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteCardMutation,
    DeleteCardMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteCardMutation, DeleteCardMutationVariables>(
    DeleteCardDocument,
    options,
  );
}
export type DeleteCardMutationHookResult = ReturnType<
  typeof useDeleteCardMutation
>;
export type DeleteCardMutationResult =
  Apollo.MutationResult<DeleteCardMutation>;
export type DeleteCardMutationOptions = Apollo.BaseMutationOptions<
  DeleteCardMutation,
  DeleteCardMutationVariables
>;
