import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const MirrorCardSendAccessRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MirrorCardSendAccessRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"modelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"modelType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestAccessModelType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendAccessRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"modelId"}}},{"kind":"Argument","name":{"kind":"Name","value":"modelType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"modelType"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"MirrorCardSendAccessRequest","document":MirrorCardSendAccessRequestDocument}} as const;
export type MirrorCardSendAccessRequestMutationVariables = Types.Exact<{
  modelId: Types.Scalars['ID']['input'];
  modelType: Types.RequestAccessModelType;
  traceId: Types.Scalars['String']['input'];
}>;


export type MirrorCardSendAccessRequestMutation = (
  { __typename: 'Mutation' }
  & { sendAccessRequest?: Types.Maybe<(
    { __typename: 'AccessRequest_Response' }
    & Pick<Types.AccessRequest_Response, 'success'>
  )> }
);

export type MirrorCardSendAccessRequestMutationFn = Apollo.MutationFunction<
  MirrorCardSendAccessRequestMutation,
  MirrorCardSendAccessRequestMutationVariables
>;

/**
 * __useMirrorCardSendAccessRequestMutation__
 *
 * To run a mutation, you first call `useMirrorCardSendAccessRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMirrorCardSendAccessRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [mirrorCardSendAccessRequestMutation, { data, loading, error }] = useMirrorCardSendAccessRequestMutation({
 *   variables: {
 *      modelId: // value for 'modelId'
 *      modelType: // value for 'modelType'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useMirrorCardSendAccessRequestMutation(
  baseOptions?: Apollo.MutationHookOptions<
    MirrorCardSendAccessRequestMutation,
    MirrorCardSendAccessRequestMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    MirrorCardSendAccessRequestMutation,
    MirrorCardSendAccessRequestMutationVariables
  >(MirrorCardSendAccessRequestDocument, options);
}
export type MirrorCardSendAccessRequestMutationHookResult = ReturnType<
  typeof useMirrorCardSendAccessRequestMutation
>;
export type MirrorCardSendAccessRequestMutationResult =
  Apollo.MutationResult<MirrorCardSendAccessRequestMutation>;
export type MirrorCardSendAccessRequestMutationOptions =
  Apollo.BaseMutationOptions<
    MirrorCardSendAccessRequestMutation,
    MirrorCardSendAccessRequestMutationVariables
  >;
