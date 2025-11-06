import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const AcknowledgeNewFeatureDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AcknowledgeNewFeature"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addOneTimeMessagesDismissed"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"memberId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}},{"kind":"Argument","name":{"kind":"Name","value":"messageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"AcknowledgeNewFeature","document":AcknowledgeNewFeatureDocument}} as const;
export type AcknowledgeNewFeatureMutationVariables = Types.Exact<{
  memberId: Types.Scalars['ID']['input'];
  messageId: Types.Scalars['ID']['input'];
}>;


export type AcknowledgeNewFeatureMutation = (
  { __typename: 'Mutation' }
  & { addOneTimeMessagesDismissed?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed'>
  )> }
);

export type AcknowledgeNewFeatureMutationFn = Apollo.MutationFunction<
  AcknowledgeNewFeatureMutation,
  AcknowledgeNewFeatureMutationVariables
>;

/**
 * __useAcknowledgeNewFeatureMutation__
 *
 * To run a mutation, you first call `useAcknowledgeNewFeatureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcknowledgeNewFeatureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acknowledgeNewFeatureMutation, { data, loading, error }] = useAcknowledgeNewFeatureMutation({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      messageId: // value for 'messageId'
 *   },
 * });
 */
export function useAcknowledgeNewFeatureMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AcknowledgeNewFeatureMutation,
    AcknowledgeNewFeatureMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AcknowledgeNewFeatureMutation,
    AcknowledgeNewFeatureMutationVariables
  >(AcknowledgeNewFeatureDocument, options);
}
export type AcknowledgeNewFeatureMutationHookResult = ReturnType<
  typeof useAcknowledgeNewFeatureMutation
>;
export type AcknowledgeNewFeatureMutationResult =
  Apollo.MutationResult<AcknowledgeNewFeatureMutation>;
export type AcknowledgeNewFeatureMutationOptions = Apollo.BaseMutationOptions<
  AcknowledgeNewFeatureMutation,
  AcknowledgeNewFeatureMutationVariables
>;
