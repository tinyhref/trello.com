import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const UpdateBoardNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateBoardName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"board"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBoardArgs"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBoard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"board"},"value":{"kind":"Variable","name":{"kind":"Name","value":"board"}}},{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"UpdateBoardName","document":UpdateBoardNameDocument}} as const;
export type UpdateBoardNameMutationVariables = Types.Exact<{
  board: Types.UpdateBoardArgs;
  boardId: Types.Scalars['ID']['input'];
  traceId: Types.Scalars['String']['input'];
}>;


export type UpdateBoardNameMutation = (
  { __typename: 'Mutation' }
  & { updateBoard?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id' | 'name'>
  )> }
);

export type UpdateBoardNameMutationFn = Apollo.MutationFunction<
  UpdateBoardNameMutation,
  UpdateBoardNameMutationVariables
>;

/**
 * __useUpdateBoardNameMutation__
 *
 * To run a mutation, you first call `useUpdateBoardNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBoardNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBoardNameMutation, { data, loading, error }] = useUpdateBoardNameMutation({
 *   variables: {
 *      board: // value for 'board'
 *      boardId: // value for 'boardId'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useUpdateBoardNameMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateBoardNameMutation,
    UpdateBoardNameMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateBoardNameMutation,
    UpdateBoardNameMutationVariables
  >(UpdateBoardNameDocument, options);
}
export type UpdateBoardNameMutationHookResult = ReturnType<
  typeof useUpdateBoardNameMutation
>;
export type UpdateBoardNameMutationResult =
  Apollo.MutationResult<UpdateBoardNameMutation>;
export type UpdateBoardNameMutationOptions = Apollo.BaseMutationOptions<
  UpdateBoardNameMutation,
  UpdateBoardNameMutationVariables
>;
