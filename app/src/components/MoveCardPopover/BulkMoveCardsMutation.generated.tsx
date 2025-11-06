import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const BulkMoveCardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkMoveCards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cardIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pos"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"targetBoardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"targetListId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkMoveCards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cardIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cardIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"idBoard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}},{"kind":"Argument","name":{"kind":"Name","value":"pos"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pos"}}},{"kind":"Argument","name":{"kind":"Name","value":"targetBoardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"targetBoardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"targetListId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"targetListId"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"idList"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}}]}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"BulkMoveCards","document":BulkMoveCardsDocument}} as const;
export type BulkMoveCardsMutationVariables = Types.Exact<{
  cardIds: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
  idBoard: Types.Scalars['ID']['input'];
  pos: Types.Scalars['String']['input'];
  targetBoardId: Types.Scalars['ID']['input'];
  targetListId: Types.Scalars['ID']['input'];
  traceId: Types.Scalars['String']['input'];
}>;


export type BulkMoveCardsMutation = (
  { __typename: 'Mutation' }
  & { bulkMoveCards?: Types.Maybe<(
    { __typename: 'BulkMoveCards_Response' }
    & Pick<Types.BulkMoveCards_Response, 'idBoard'>
    & { cards: Array<(
      { __typename: 'Card' }
      & Pick<
        Types.Card,
        | 'id'
        | 'idBoard'
        | 'idList'
        | 'pos'
      >
    )> }
  )> }
);

export type BulkMoveCardsMutationFn = Apollo.MutationFunction<
  BulkMoveCardsMutation,
  BulkMoveCardsMutationVariables
>;

/**
 * __useBulkMoveCardsMutation__
 *
 * To run a mutation, you first call `useBulkMoveCardsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkMoveCardsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkMoveCardsMutation, { data, loading, error }] = useBulkMoveCardsMutation({
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
export function useBulkMoveCardsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    BulkMoveCardsMutation,
    BulkMoveCardsMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    BulkMoveCardsMutation,
    BulkMoveCardsMutationVariables
  >(BulkMoveCardsDocument, options);
}
export type BulkMoveCardsMutationHookResult = ReturnType<
  typeof useBulkMoveCardsMutation
>;
export type BulkMoveCardsMutationResult =
  Apollo.MutationResult<BulkMoveCardsMutation>;
export type BulkMoveCardsMutationOptions = Apollo.BaseMutationOptions<
  BulkMoveCardsMutation,
  BulkMoveCardsMutationVariables
>;
