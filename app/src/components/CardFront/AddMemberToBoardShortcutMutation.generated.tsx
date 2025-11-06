import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const AddMemberToBoardShortcutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddMemberToBoardShortcut"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"member"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MemberOrEmail"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMemberToBoard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"member"},"value":{"kind":"Variable","name":{"kind":"Name","value":"member"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"AddMemberToBoardShortcut","document":AddMemberToBoardShortcutDocument}} as const;
export type AddMemberToBoardShortcutMutationVariables = Types.Exact<{
  boardId: Types.Scalars['ID']['input'];
  member: Types.MemberOrEmail;
}>;


export type AddMemberToBoardShortcutMutation = (
  { __typename: 'Mutation' }
  & { addMemberToBoard?: Types.Maybe<(
    { __typename: 'InviteMember_Response' }
    & Pick<Types.InviteMember_Response, 'success'>
  )> }
);

export type AddMemberToBoardShortcutMutationFn = Apollo.MutationFunction<
  AddMemberToBoardShortcutMutation,
  AddMemberToBoardShortcutMutationVariables
>;

/**
 * __useAddMemberToBoardShortcutMutation__
 *
 * To run a mutation, you first call `useAddMemberToBoardShortcutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddMemberToBoardShortcutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addMemberToBoardShortcutMutation, { data, loading, error }] = useAddMemberToBoardShortcutMutation({
 *   variables: {
 *      boardId: // value for 'boardId'
 *      member: // value for 'member'
 *   },
 * });
 */
export function useAddMemberToBoardShortcutMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AddMemberToBoardShortcutMutation,
    AddMemberToBoardShortcutMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AddMemberToBoardShortcutMutation,
    AddMemberToBoardShortcutMutationVariables
  >(AddMemberToBoardShortcutDocument, options);
}
export type AddMemberToBoardShortcutMutationHookResult = ReturnType<
  typeof useAddMemberToBoardShortcutMutation
>;
export type AddMemberToBoardShortcutMutationResult =
  Apollo.MutationResult<AddMemberToBoardShortcutMutation>;
export type AddMemberToBoardShortcutMutationOptions =
  Apollo.BaseMutationOptions<
    AddMemberToBoardShortcutMutation,
    AddMemberToBoardShortcutMutationVariables
  >;
