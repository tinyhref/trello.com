import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const UnblockMemberProfileSyncDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnblockMemberProfileSync"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unblockMemberProfileSync"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"memberId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"aaBlockSyncUntil"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}},{"kind":"Field","name":{"kind":"Name","value":"requiresAaOnboarding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"template"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"UnblockMemberProfileSync","document":UnblockMemberProfileSyncDocument}} as const;
export type UnblockMemberProfileSyncMutationVariables = Types.Exact<{
  memberId: Types.Scalars['ID']['input'];
}>;


export type UnblockMemberProfileSyncMutation = (
  { __typename: 'Mutation' }
  & { unblockMemberProfileSync?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'aaBlockSyncUntil' | 'oneTimeMessagesDismissed'>
    & { requiresAaOnboarding?: Types.Maybe<(
      { __typename: 'RequiresAaOnboarding' }
      & Pick<Types.RequiresAaOnboarding, 'template'>
    )> }
  )> }
);

export type UnblockMemberProfileSyncMutationFn = Apollo.MutationFunction<
  UnblockMemberProfileSyncMutation,
  UnblockMemberProfileSyncMutationVariables
>;

/**
 * __useUnblockMemberProfileSyncMutation__
 *
 * To run a mutation, you first call `useUnblockMemberProfileSyncMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnblockMemberProfileSyncMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unblockMemberProfileSyncMutation, { data, loading, error }] = useUnblockMemberProfileSyncMutation({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useUnblockMemberProfileSyncMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UnblockMemberProfileSyncMutation,
    UnblockMemberProfileSyncMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UnblockMemberProfileSyncMutation,
    UnblockMemberProfileSyncMutationVariables
  >(UnblockMemberProfileSyncDocument, options);
}
export type UnblockMemberProfileSyncMutationHookResult = ReturnType<
  typeof useUnblockMemberProfileSyncMutation
>;
export type UnblockMemberProfileSyncMutationResult =
  Apollo.MutationResult<UnblockMemberProfileSyncMutation>;
export type UnblockMemberProfileSyncMutationOptions =
  Apollo.BaseMutationOptions<
    UnblockMemberProfileSyncMutation,
    UnblockMemberProfileSyncMutationVariables
  >;
