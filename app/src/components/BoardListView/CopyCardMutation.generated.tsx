import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const CopyCardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CopyCard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idCardSource"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idList"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"keepFromSource"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pos"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"copyCard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idCardSource"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idCardSource"}}},{"kind":"Argument","name":{"kind":"Name","value":"idList"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idList"}}},{"kind":"Argument","name":{"kind":"Name","value":"keepFromSource"},"value":{"kind":"Variable","name":{"kind":"Name","value":"keepFromSource"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"pos"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pos"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cardRole"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"idList"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"CopyCard","document":CopyCardDocument}} as const;
export type CopyCardMutationVariables = Types.Exact<{
  idCardSource: Types.Scalars['ID']['input'];
  idList: Types.Scalars['ID']['input'];
  keepFromSource?: Types.InputMaybe<Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']>;
  name?: Types.InputMaybe<Types.Scalars['String']['input']>;
  pos?: Types.InputMaybe<Types.Scalars['Float']['input']>;
  traceId: Types.Scalars['String']['input'];
}>;


export type CopyCardMutation = (
  { __typename: 'Mutation' }
  & { copyCard?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<
      Types.Card,
      | 'id'
      | 'cardRole'
      | 'idBoard'
      | 'idList'
      | 'name'
      | 'pos'
      | 'shortLink'
    >
  )> }
);

export type CopyCardMutationFn = Apollo.MutationFunction<
  CopyCardMutation,
  CopyCardMutationVariables
>;

/**
 * __useCopyCardMutation__
 *
 * To run a mutation, you first call `useCopyCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCopyCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [copyCardMutation, { data, loading, error }] = useCopyCardMutation({
 *   variables: {
 *      idCardSource: // value for 'idCardSource'
 *      idList: // value for 'idList'
 *      keepFromSource: // value for 'keepFromSource'
 *      name: // value for 'name'
 *      pos: // value for 'pos'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useCopyCardMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CopyCardMutation,
    CopyCardMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CopyCardMutation, CopyCardMutationVariables>(
    CopyCardDocument,
    options,
  );
}
export type CopyCardMutationHookResult = ReturnType<typeof useCopyCardMutation>;
export type CopyCardMutationResult = Apollo.MutationResult<CopyCardMutation>;
export type CopyCardMutationOptions = Apollo.BaseMutationOptions<
  CopyCardMutation,
  CopyCardMutationVariables
>;
