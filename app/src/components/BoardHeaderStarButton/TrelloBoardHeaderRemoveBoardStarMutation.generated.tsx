import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const TrelloBoardHeaderRemoveBoardStarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TrelloBoardHeaderRemoveBoardStar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloRemoveBoardStarInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeBoardStar"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloRemoveBoardStar","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"TrelloBoardHeaderRemoveBoardStar","document":TrelloBoardHeaderRemoveBoardStarDocument}} as const;
export type TrelloBoardHeaderRemoveBoardStarMutationVariables = Types.Exact<{
  input: Types.TrelloRemoveBoardStarInput;
}>;


export type TrelloBoardHeaderRemoveBoardStarMutation = (
  { __typename: 'Mutation' }
  & { trello: (
    { __typename: 'TrelloMutationApi' }
    & { removeBoardStar?: Types.Maybe<(
      { __typename: 'TrelloRemoveBoardStarPayload' }
      & Pick<Types.TrelloRemoveBoardStarPayload, 'success'>
      & { errors?: Types.Maybe<Array<(
        { __typename: 'MutationError' }
        & Pick<Types.MutationError, 'message'>
      )>> }
    )> }
  ) }
);

export type TrelloBoardHeaderRemoveBoardStarMutationFn =
  Apollo.MutationFunction<
    TrelloBoardHeaderRemoveBoardStarMutation,
    TrelloBoardHeaderRemoveBoardStarMutationVariables
  >;

/**
 * __useTrelloBoardHeaderRemoveBoardStarMutation__
 *
 * To run a mutation, you first call `useTrelloBoardHeaderRemoveBoardStarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTrelloBoardHeaderRemoveBoardStarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [trelloBoardHeaderRemoveBoardStarMutation, { data, loading, error }] = useTrelloBoardHeaderRemoveBoardStarMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTrelloBoardHeaderRemoveBoardStarMutation(
  baseOptions?: Apollo.MutationHookOptions<
    TrelloBoardHeaderRemoveBoardStarMutation,
    TrelloBoardHeaderRemoveBoardStarMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    TrelloBoardHeaderRemoveBoardStarMutation,
    TrelloBoardHeaderRemoveBoardStarMutationVariables
  >(TrelloBoardHeaderRemoveBoardStarDocument, options);
}
export type TrelloBoardHeaderRemoveBoardStarMutationHookResult = ReturnType<
  typeof useTrelloBoardHeaderRemoveBoardStarMutation
>;
export type TrelloBoardHeaderRemoveBoardStarMutationResult =
  Apollo.MutationResult<TrelloBoardHeaderRemoveBoardStarMutation>;
export type TrelloBoardHeaderRemoveBoardStarMutationOptions =
  Apollo.BaseMutationOptions<
    TrelloBoardHeaderRemoveBoardStarMutation,
    TrelloBoardHeaderRemoveBoardStarMutationVariables
  >;
