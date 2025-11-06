import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const BulkCopyCardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkCopyCards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cardIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pos"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"targetBoardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"targetListId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkCopyCards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cardIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cardIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"idBoard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}},{"kind":"Argument","name":{"kind":"Name","value":"pos"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pos"}}},{"kind":"Argument","name":{"kind":"Name","value":"targetBoardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"targetBoardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"targetListId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"targetListId"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"BulkCopyCards","document":BulkCopyCardsDocument}} as const;
export type BulkCopyCardsMutationVariables = Types.Exact<{
  cardIds: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
  idBoard: Types.Scalars['ID']['input'];
  pos: Types.Scalars['String']['input'];
  targetBoardId: Types.Scalars['ID']['input'];
  targetListId: Types.Scalars['ID']['input'];
  traceId: Types.Scalars['String']['input'];
}>;


export type BulkCopyCardsMutation = (
  { __typename: 'Mutation' }
  & { bulkCopyCards?: Types.Maybe<(
    { __typename: 'BulkCopyCards_Response' }
    & Pick<Types.BulkCopyCards_Response, 'idBoard'>
    & { cards: Array<(
      { __typename: 'Card' }
      & Pick<Types.Card, 'id' | 'name'>
    )> }
  )> }
);

export type BulkCopyCardsMutationFn = Apollo.MutationFunction<
  BulkCopyCardsMutation,
  BulkCopyCardsMutationVariables
>;

/**
 * __useBulkCopyCardsMutation__
 *
 * To run a mutation, you first call `useBulkCopyCardsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkCopyCardsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkCopyCardsMutation, { data, loading, error }] = useBulkCopyCardsMutation({
 *   variables: {
 *      cardIds: // value for 'cardIds'
 *      idBoard: // value for 'idBoard'
 *      pos: // value for 'pos'
 *      targetBoardId: // value for 'targetBoardId'
 *      targetListId: // value for 'targetListId'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useBulkCopyCardsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    BulkCopyCardsMutation,
    BulkCopyCardsMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    BulkCopyCardsMutation,
    BulkCopyCardsMutationVariables
  >(BulkCopyCardsDocument, options);
}
export type BulkCopyCardsMutationHookResult = ReturnType<
  typeof useBulkCopyCardsMutation
>;
export type BulkCopyCardsMutationResult =
  Apollo.MutationResult<BulkCopyCardsMutation>;
export type BulkCopyCardsMutationOptions = Apollo.BaseMutationOptions<
  BulkCopyCardsMutation,
  BulkCopyCardsMutationVariables
>;
