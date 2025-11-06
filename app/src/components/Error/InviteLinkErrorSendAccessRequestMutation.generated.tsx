import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const InviteLinkErrorSendAccessRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InviteLinkErrorSendAccessRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"modelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"modelType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestAccessModelType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendAccessRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"modelId"}}},{"kind":"Argument","name":{"kind":"Name","value":"modelType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"modelType"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"InviteLinkErrorSendAccessRequest","document":InviteLinkErrorSendAccessRequestDocument}} as const;
export type InviteLinkErrorSendAccessRequestMutationVariables = Types.Exact<{
  modelId: Types.Scalars['ID']['input'];
  modelType: Types.RequestAccessModelType;
  traceId: Types.Scalars['String']['input'];
}>;


export type InviteLinkErrorSendAccessRequestMutation = (
  { __typename: 'Mutation' }
  & { sendAccessRequest?: Types.Maybe<(
    { __typename: 'AccessRequest_Response' }
    & Pick<Types.AccessRequest_Response, 'success'>
  )> }
);

export type InviteLinkErrorSendAccessRequestMutationFn =
  Apollo.MutationFunction<
    InviteLinkErrorSendAccessRequestMutation,
    InviteLinkErrorSendAccessRequestMutationVariables
  >;

/**
 * __useInviteLinkErrorSendAccessRequestMutation__
 *
 * To run a mutation, you first call `useInviteLinkErrorSendAccessRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInviteLinkErrorSendAccessRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [inviteLinkErrorSendAccessRequestMutation, { data, loading, error }] = useInviteLinkErrorSendAccessRequestMutation({
 *   variables: {
 *      modelId: // value for 'modelId'
 *      modelType: // value for 'modelType'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useInviteLinkErrorSendAccessRequestMutation(
  baseOptions?: Apollo.MutationHookOptions<
    InviteLinkErrorSendAccessRequestMutation,
    InviteLinkErrorSendAccessRequestMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    InviteLinkErrorSendAccessRequestMutation,
    InviteLinkErrorSendAccessRequestMutationVariables
  >(InviteLinkErrorSendAccessRequestDocument, options);
}
export type InviteLinkErrorSendAccessRequestMutationHookResult = ReturnType<
  typeof useInviteLinkErrorSendAccessRequestMutation
>;
export type InviteLinkErrorSendAccessRequestMutationResult =
  Apollo.MutationResult<InviteLinkErrorSendAccessRequestMutation>;
export type InviteLinkErrorSendAccessRequestMutationOptions =
  Apollo.BaseMutationOptions<
    InviteLinkErrorSendAccessRequestMutation,
    InviteLinkErrorSendAccessRequestMutationVariables
  >;
