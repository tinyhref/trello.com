import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const TrelloMergeCardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TrelloMergeCards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cardIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"targetBoardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"targetListId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mergeCards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"cardIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cardIds"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"targetBoardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"targetBoardId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"targetListId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"targetListId"}}}]}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloMergeCards","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"archivedCardIds"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"TrelloMergeCards","document":TrelloMergeCardsDocument}} as const;
export type TrelloMergeCardsMutationVariables = Types.Exact<{
  cardIds: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
  targetBoardId: Types.Scalars['ID']['input'];
  targetListId: Types.Scalars['ID']['input'];
}>;


export type TrelloMergeCardsMutation = (
  { __typename: 'Mutation' }
  & { trello: (
    { __typename: 'TrelloMutationApi' }
    & { mergeCards?: Types.Maybe<(
      { __typename: 'TrelloMergeCardsPayload' }
      & Pick<Types.TrelloMergeCardsPayload, 'archivedCardIds' | 'success'>
      & {
        card?: Types.Maybe<(
          { __typename: 'TrelloCard' }
          & Pick<Types.TrelloCard, 'id'>
        )>,
        errors?: Types.Maybe<Array<(
          { __typename: 'MutationError' }
          & Pick<Types.MutationError, 'message'>
        )>>,
      }
    )> }
  ) }
);

export type TrelloMergeCardsMutationFn = Apollo.MutationFunction<
  TrelloMergeCardsMutation,
  TrelloMergeCardsMutationVariables
>;

/**
 * __useTrelloMergeCardsMutation__
 *
 * To run a mutation, you first call `useTrelloMergeCardsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTrelloMergeCardsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [trelloMergeCardsMutation, { data, loading, error }] = useTrelloMergeCardsMutation({
 *   variables: {
 *      cardIds: // value for 'cardIds'
 *      targetBoardId: // value for 'targetBoardId'
 *      targetListId: // value for 'targetListId'
 *   },
 * });
 */
export function useTrelloMergeCardsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    TrelloMergeCardsMutation,
    TrelloMergeCardsMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    TrelloMergeCardsMutation,
    TrelloMergeCardsMutationVariables
  >(TrelloMergeCardsDocument, options);
}
export type TrelloMergeCardsMutationHookResult = ReturnType<
  typeof useTrelloMergeCardsMutation
>;
export type TrelloMergeCardsMutationResult =
  Apollo.MutationResult<TrelloMergeCardsMutation>;
export type TrelloMergeCardsMutationOptions = Apollo.BaseMutationOptions<
  TrelloMergeCardsMutation,
  TrelloMergeCardsMutationVariables
>;
