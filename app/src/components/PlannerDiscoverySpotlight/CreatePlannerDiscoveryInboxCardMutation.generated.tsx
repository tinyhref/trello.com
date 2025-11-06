import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const CreatePlannerDiscoveryInboxCardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePlannerDiscoveryInboxCard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"desc"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idList"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pos"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"desc"},"value":{"kind":"Variable","name":{"kind":"Name","value":"desc"}}},{"kind":"Argument","name":{"kind":"Name","value":"idList"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idList"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"pos"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pos"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"desc"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"idList"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"CreatePlannerDiscoveryInboxCard","document":CreatePlannerDiscoveryInboxCardDocument}} as const;
export type CreatePlannerDiscoveryInboxCardMutationVariables = Types.Exact<{
  desc?: Types.InputMaybe<Types.Scalars['String']['input']>;
  idList: Types.Scalars['ID']['input'];
  name: Types.Scalars['String']['input'];
  pos: Types.Scalars['Float']['input'];
  traceId: Types.Scalars['String']['input'];
}>;


export type CreatePlannerDiscoveryInboxCardMutation = (
  { __typename: 'Mutation' }
  & { createCard?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<
      Types.Card,
      | 'id'
      | 'closed'
      | 'desc'
      | 'idBoard'
      | 'idList'
      | 'isTemplate'
      | 'name'
      | 'shortLink'
    >
  )> }
);

export type CreatePlannerDiscoveryInboxCardMutationFn = Apollo.MutationFunction<
  CreatePlannerDiscoveryInboxCardMutation,
  CreatePlannerDiscoveryInboxCardMutationVariables
>;

/**
 * __useCreatePlannerDiscoveryInboxCardMutation__
 *
 * To run a mutation, you first call `useCreatePlannerDiscoveryInboxCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePlannerDiscoveryInboxCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPlannerDiscoveryInboxCardMutation, { data, loading, error }] = useCreatePlannerDiscoveryInboxCardMutation({
 *   variables: {
 *      desc: // value for 'desc'
 *      idList: // value for 'idList'
 *      name: // value for 'name'
 *      pos: // value for 'pos'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useCreatePlannerDiscoveryInboxCardMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreatePlannerDiscoveryInboxCardMutation,
    CreatePlannerDiscoveryInboxCardMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreatePlannerDiscoveryInboxCardMutation,
    CreatePlannerDiscoveryInboxCardMutationVariables
  >(CreatePlannerDiscoveryInboxCardDocument, options);
}
export type CreatePlannerDiscoveryInboxCardMutationHookResult = ReturnType<
  typeof useCreatePlannerDiscoveryInboxCardMutation
>;
export type CreatePlannerDiscoveryInboxCardMutationResult =
  Apollo.MutationResult<CreatePlannerDiscoveryInboxCardMutation>;
export type CreatePlannerDiscoveryInboxCardMutationOptions =
  Apollo.BaseMutationOptions<
    CreatePlannerDiscoveryInboxCardMutation,
    CreatePlannerDiscoveryInboxCardMutationVariables
  >;
