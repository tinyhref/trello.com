import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const BoardShareButtonAccessRequestsSpotlightMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BoardShareButtonAccessRequestsSpotlightMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addOneTimeMessagesDismissed"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"memberId"},"value":{"kind":"StringValue","value":"me","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"messageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"BoardShareButtonAccessRequestsSpotlightMessage","document":BoardShareButtonAccessRequestsSpotlightMessageDocument}} as const;
export type BoardShareButtonAccessRequestsSpotlightMessageMutationVariables = Types.Exact<{
  messageId: Types.Scalars['ID']['input'];
}>;


export type BoardShareButtonAccessRequestsSpotlightMessageMutation = (
  { __typename: 'Mutation' }
  & { addOneTimeMessagesDismissed?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed'>
  )> }
);

export type BoardShareButtonAccessRequestsSpotlightMessageMutationFn =
  Apollo.MutationFunction<
    BoardShareButtonAccessRequestsSpotlightMessageMutation,
    BoardShareButtonAccessRequestsSpotlightMessageMutationVariables
  >;

/**
 * __useBoardShareButtonAccessRequestsSpotlightMessageMutation__
 *
 * To run a mutation, you first call `useBoardShareButtonAccessRequestsSpotlightMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBoardShareButtonAccessRequestsSpotlightMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [boardShareButtonAccessRequestsSpotlightMessageMutation, { data, loading, error }] = useBoardShareButtonAccessRequestsSpotlightMessageMutation({
 *   variables: {
 *      messageId: // value for 'messageId'
 *   },
 * });
 */
export function useBoardShareButtonAccessRequestsSpotlightMessageMutation(
  baseOptions?: Apollo.MutationHookOptions<
    BoardShareButtonAccessRequestsSpotlightMessageMutation,
    BoardShareButtonAccessRequestsSpotlightMessageMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    BoardShareButtonAccessRequestsSpotlightMessageMutation,
    BoardShareButtonAccessRequestsSpotlightMessageMutationVariables
  >(BoardShareButtonAccessRequestsSpotlightMessageDocument, options);
}
export type BoardShareButtonAccessRequestsSpotlightMessageMutationHookResult =
  ReturnType<typeof useBoardShareButtonAccessRequestsSpotlightMessageMutation>;
export type BoardShareButtonAccessRequestsSpotlightMessageMutationResult =
  Apollo.MutationResult<BoardShareButtonAccessRequestsSpotlightMessageMutation>;
export type BoardShareButtonAccessRequestsSpotlightMessageMutationOptions =
  Apollo.BaseMutationOptions<
    BoardShareButtonAccessRequestsSpotlightMessageMutation,
    BoardShareButtonAccessRequestsSpotlightMessageMutationVariables
  >;
