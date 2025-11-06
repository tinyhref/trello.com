import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const UpdateBoardVisibilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateBoardVisibility"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visibility"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Board_Prefs_PermissionLevel"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBoardVisibility"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"visibility"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visibility"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"updateBoardVisibility","document":UpdateBoardVisibilityDocument}} as const;
export type UpdateBoardVisibilityMutationVariables = Types.Exact<{
  boardId: Types.Scalars['ID']['input'];
  visibility: Types.Board_Prefs_PermissionLevel;
}>;


export type UpdateBoardVisibilityMutation = (
  { __typename: 'Mutation' }
  & { updateBoardVisibility?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
    & { prefs?: Types.Maybe<(
      { __typename: 'Board_Prefs' }
      & Pick<Types.Board_Prefs, 'permissionLevel'>
    )> }
  )> }
);

export type UpdateBoardVisibilityMutationFn = Apollo.MutationFunction<
  UpdateBoardVisibilityMutation,
  UpdateBoardVisibilityMutationVariables
>;

/**
 * __useUpdateBoardVisibilityMutation__
 *
 * To run a mutation, you first call `useUpdateBoardVisibilityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBoardVisibilityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBoardVisibilityMutation, { data, loading, error }] = useUpdateBoardVisibilityMutation({
 *   variables: {
 *      boardId: // value for 'boardId'
 *      visibility: // value for 'visibility'
 *   },
 * });
 */
export function useUpdateBoardVisibilityMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateBoardVisibilityMutation,
    UpdateBoardVisibilityMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateBoardVisibilityMutation,
    UpdateBoardVisibilityMutationVariables
  >(UpdateBoardVisibilityDocument, options);
}
export type UpdateBoardVisibilityMutationHookResult = ReturnType<
  typeof useUpdateBoardVisibilityMutation
>;
export type UpdateBoardVisibilityMutationResult =
  Apollo.MutationResult<UpdateBoardVisibilityMutation>;
export type UpdateBoardVisibilityMutationOptions = Apollo.BaseMutationOptions<
  UpdateBoardVisibilityMutation,
  UpdateBoardVisibilityMutationVariables
>;
