import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const AddOneTimeMessageDismissedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddOneTimeMessageDismissed"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addOneTimeMessagesDismissed"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"memberId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}},{"kind":"Argument","name":{"kind":"Name","value":"messageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"AddOneTimeMessageDismissed","document":AddOneTimeMessageDismissedDocument}} as const;
export type AddOneTimeMessageDismissedMutationVariables = Types.Exact<{
  memberId: Types.Scalars['ID']['input'];
  messageId: Types.Scalars['ID']['input'];
}>;


export type AddOneTimeMessageDismissedMutation = (
  { __typename: 'Mutation' }
  & { addOneTimeMessagesDismissed?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed'>
  )> }
);

export type AddOneTimeMessageDismissedMutationFn = Apollo.MutationFunction<
  AddOneTimeMessageDismissedMutation,
  AddOneTimeMessageDismissedMutationVariables
>;

/**
 * __useAddOneTimeMessageDismissedMutation__
 *
 * To run a mutation, you first call `useAddOneTimeMessageDismissedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddOneTimeMessageDismissedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addOneTimeMessageDismissedMutation, { data, loading, error }] = useAddOneTimeMessageDismissedMutation({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      messageId: // value for 'messageId'
 *   },
 * });
 */
export function useAddOneTimeMessageDismissedMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AddOneTimeMessageDismissedMutation,
    AddOneTimeMessageDismissedMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AddOneTimeMessageDismissedMutation,
    AddOneTimeMessageDismissedMutationVariables
  >(AddOneTimeMessageDismissedDocument, options);
}
export type AddOneTimeMessageDismissedMutationHookResult = ReturnType<
  typeof useAddOneTimeMessageDismissedMutation
>;
export type AddOneTimeMessageDismissedMutationResult =
  Apollo.MutationResult<AddOneTimeMessageDismissedMutation>;
export type AddOneTimeMessageDismissedMutationOptions =
  Apollo.BaseMutationOptions<
    AddOneTimeMessageDismissedMutation,
    AddOneTimeMessageDismissedMutationVariables
  >;
