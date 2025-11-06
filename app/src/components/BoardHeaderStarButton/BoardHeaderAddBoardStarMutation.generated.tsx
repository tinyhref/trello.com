import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const BoardHeaderAddBoardStarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BoardHeaderAddBoardStar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pos"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addBoardStar"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"memberId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}},{"kind":"Argument","name":{"kind":"Name","value":"pos"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pos"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"BoardHeaderAddBoardStar","document":BoardHeaderAddBoardStarDocument}} as const;
export type BoardHeaderAddBoardStarMutationVariables = Types.Exact<{
  boardId: Types.Scalars['ID']['input'];
  memberId: Types.Scalars['ID']['input'];
  pos: Types.Scalars['Int']['input'];
  traceId?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type BoardHeaderAddBoardStarMutation = (
  { __typename: 'Mutation' }
  & { addBoardStar?: Types.Maybe<(
    { __typename: 'BoardStar' }
    & Pick<Types.BoardStar, 'id' | 'idBoard' | 'pos'>
  )> }
);

export type BoardHeaderAddBoardStarMutationFn = Apollo.MutationFunction<
  BoardHeaderAddBoardStarMutation,
  BoardHeaderAddBoardStarMutationVariables
>;

/**
 * __useBoardHeaderAddBoardStarMutation__
 *
 * To run a mutation, you first call `useBoardHeaderAddBoardStarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBoardHeaderAddBoardStarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [boardHeaderAddBoardStarMutation, { data, loading, error }] = useBoardHeaderAddBoardStarMutation({
 *   variables: {
 *      boardId: // value for 'boardId'
 *      memberId: // value for 'memberId'
 *      pos: // value for 'pos'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useBoardHeaderAddBoardStarMutation(
  baseOptions?: Apollo.MutationHookOptions<
    BoardHeaderAddBoardStarMutation,
    BoardHeaderAddBoardStarMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    BoardHeaderAddBoardStarMutation,
    BoardHeaderAddBoardStarMutationVariables
  >(BoardHeaderAddBoardStarDocument, options);
}
export type BoardHeaderAddBoardStarMutationHookResult = ReturnType<
  typeof useBoardHeaderAddBoardStarMutation
>;
export type BoardHeaderAddBoardStarMutationResult =
  Apollo.MutationResult<BoardHeaderAddBoardStarMutation>;
export type BoardHeaderAddBoardStarMutationOptions = Apollo.BaseMutationOptions<
  BoardHeaderAddBoardStarMutation,
  BoardHeaderAddBoardStarMutationVariables
>;
