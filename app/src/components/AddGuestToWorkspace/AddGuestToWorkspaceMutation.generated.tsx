import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const AddGuestToWorkspaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddGuestToWorkspace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MemberOrEmail"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMemberToOrg"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"invitationMessage"},"value":{"kind":"StringValue","value":"","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"orgId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"user"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"AddGuestToWorkspace","document":AddGuestToWorkspaceDocument}} as const;
export type AddGuestToWorkspaceMutationVariables = Types.Exact<{
  traceId: Types.Scalars['String']['input'];
  user: Types.MemberOrEmail;
  workspaceId: Types.Scalars['ID']['input'];
}>;


export type AddGuestToWorkspaceMutation = (
  { __typename: 'Mutation' }
  & { addMemberToOrg?: Types.Maybe<(
    { __typename: 'InviteMember_Response' }
    & Pick<Types.InviteMember_Response, 'success'>
  )> }
);

export type AddGuestToWorkspaceMutationFn = Apollo.MutationFunction<
  AddGuestToWorkspaceMutation,
  AddGuestToWorkspaceMutationVariables
>;

/**
 * __useAddGuestToWorkspaceMutation__
 *
 * To run a mutation, you first call `useAddGuestToWorkspaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddGuestToWorkspaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addGuestToWorkspaceMutation, { data, loading, error }] = useAddGuestToWorkspaceMutation({
 *   variables: {
 *      traceId: // value for 'traceId'
 *      user: // value for 'user'
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useAddGuestToWorkspaceMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AddGuestToWorkspaceMutation,
    AddGuestToWorkspaceMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AddGuestToWorkspaceMutation,
    AddGuestToWorkspaceMutationVariables
  >(AddGuestToWorkspaceDocument, options);
}
export type AddGuestToWorkspaceMutationHookResult = ReturnType<
  typeof useAddGuestToWorkspaceMutation
>;
export type AddGuestToWorkspaceMutationResult =
  Apollo.MutationResult<AddGuestToWorkspaceMutation>;
export type AddGuestToWorkspaceMutationOptions = Apollo.BaseMutationOptions<
  AddGuestToWorkspaceMutation,
  AddGuestToWorkspaceMutationVariables
>;
