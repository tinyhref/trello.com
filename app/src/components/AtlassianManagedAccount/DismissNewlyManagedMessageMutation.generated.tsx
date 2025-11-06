import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const DismissNewlyManagedMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DismissNewlyManagedMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addOneTimeMessagesDismissed"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"memberId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}},{"kind":"Argument","name":{"kind":"Name","value":"messageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}},{"kind":"Field","name":{"kind":"Name","value":"requiresAaOnboarding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"template"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"DismissNewlyManagedMessage","document":DismissNewlyManagedMessageDocument}} as const;
export type DismissNewlyManagedMessageMutationVariables = Types.Exact<{
  memberId: Types.Scalars['ID']['input'];
  messageId: Types.Scalars['ID']['input'];
}>;


export type DismissNewlyManagedMessageMutation = (
  { __typename: 'Mutation' }
  & { addOneTimeMessagesDismissed?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed'>
    & { requiresAaOnboarding?: Types.Maybe<(
      { __typename: 'RequiresAaOnboarding' }
      & Pick<Types.RequiresAaOnboarding, 'template'>
    )> }
  )> }
);

export type DismissNewlyManagedMessageMutationFn = Apollo.MutationFunction<
  DismissNewlyManagedMessageMutation,
  DismissNewlyManagedMessageMutationVariables
>;

/**
 * __useDismissNewlyManagedMessageMutation__
 *
 * To run a mutation, you first call `useDismissNewlyManagedMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDismissNewlyManagedMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [dismissNewlyManagedMessageMutation, { data, loading, error }] = useDismissNewlyManagedMessageMutation({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      messageId: // value for 'messageId'
 *   },
 * });
 */
export function useDismissNewlyManagedMessageMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DismissNewlyManagedMessageMutation,
    DismissNewlyManagedMessageMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    DismissNewlyManagedMessageMutation,
    DismissNewlyManagedMessageMutationVariables
  >(DismissNewlyManagedMessageDocument, options);
}
export type DismissNewlyManagedMessageMutationHookResult = ReturnType<
  typeof useDismissNewlyManagedMessageMutation
>;
export type DismissNewlyManagedMessageMutationResult =
  Apollo.MutationResult<DismissNewlyManagedMessageMutation>;
export type DismissNewlyManagedMessageMutationOptions =
  Apollo.BaseMutationOptions<
    DismissNewlyManagedMessageMutation,
    DismissNewlyManagedMessageMutationVariables
  >;
