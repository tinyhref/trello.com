import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const TrelloBoardHeaderAddBoardStarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TrelloBoardHeaderAddBoardStar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloAddBoardStarInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addBoardStar"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloAddBoardStar","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"member"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"boardStars"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"boardObjectId"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"TrelloBoardHeaderAddBoardStar","document":TrelloBoardHeaderAddBoardStarDocument}} as const;
export type TrelloBoardHeaderAddBoardStarMutationVariables = Types.Exact<{
  input: Types.TrelloAddBoardStarInput;
}>;


export type TrelloBoardHeaderAddBoardStarMutation = (
  { __typename: 'Mutation' }
  & { trello: (
    { __typename: 'TrelloMutationApi' }
    & { addBoardStar?: Types.Maybe<(
      { __typename: 'TrelloAddBoardStarPayload' }
      & Pick<Types.TrelloAddBoardStarPayload, 'success'>
      & {
        errors?: Types.Maybe<Array<(
          { __typename: 'MutationError' }
          & Pick<Types.MutationError, 'message'>
        )>>,
        member?: Types.Maybe<(
          { __typename: 'TrelloMember' }
          & Pick<Types.TrelloMember, 'id'>
          & { boardStars?: Types.Maybe<(
            { __typename: 'TrelloMemberBoardStarConnection' }
            & { edges?: Types.Maybe<Array<(
              { __typename: 'TrelloMemberBoardStarEdge' }
              & Pick<
                Types.TrelloMemberBoardStarEdge,
                | 'id'
                | 'boardObjectId'
                | 'objectId'
                | 'position'
              >
            )>> }
          )> }
        )>,
      }
    )> }
  ) }
);

export type TrelloBoardHeaderAddBoardStarMutationFn = Apollo.MutationFunction<
  TrelloBoardHeaderAddBoardStarMutation,
  TrelloBoardHeaderAddBoardStarMutationVariables
>;

/**
 * __useTrelloBoardHeaderAddBoardStarMutation__
 *
 * To run a mutation, you first call `useTrelloBoardHeaderAddBoardStarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTrelloBoardHeaderAddBoardStarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [trelloBoardHeaderAddBoardStarMutation, { data, loading, error }] = useTrelloBoardHeaderAddBoardStarMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTrelloBoardHeaderAddBoardStarMutation(
  baseOptions?: Apollo.MutationHookOptions<
    TrelloBoardHeaderAddBoardStarMutation,
    TrelloBoardHeaderAddBoardStarMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    TrelloBoardHeaderAddBoardStarMutation,
    TrelloBoardHeaderAddBoardStarMutationVariables
  >(TrelloBoardHeaderAddBoardStarDocument, options);
}
export type TrelloBoardHeaderAddBoardStarMutationHookResult = ReturnType<
  typeof useTrelloBoardHeaderAddBoardStarMutation
>;
export type TrelloBoardHeaderAddBoardStarMutationResult =
  Apollo.MutationResult<TrelloBoardHeaderAddBoardStarMutation>;
export type TrelloBoardHeaderAddBoardStarMutationOptions =
  Apollo.BaseMutationOptions<
    TrelloBoardHeaderAddBoardStarMutation,
    TrelloBoardHeaderAddBoardStarMutationVariables
  >;
