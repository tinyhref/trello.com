import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const TrelloRemoveBoardStarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TrelloRemoveBoardStar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloRemoveBoardStarInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeBoardStar"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloRemoveBoardStar","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"TrelloRemoveBoardStar","document":TrelloRemoveBoardStarDocument}} as const;
export type TrelloRemoveBoardStarMutationVariables = Types.Exact<{
  input: Types.TrelloRemoveBoardStarInput;
}>;


export type TrelloRemoveBoardStarMutation = (
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

export type TrelloRemoveBoardStarMutationFn = Apollo.MutationFunction<
  TrelloRemoveBoardStarMutation,
  TrelloRemoveBoardStarMutationVariables
>;

/**
 * __useTrelloRemoveBoardStarMutation__
 *
 * To run a mutation, you first call `useTrelloRemoveBoardStarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTrelloRemoveBoardStarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [trelloRemoveBoardStarMutation, { data, loading, error }] = useTrelloRemoveBoardStarMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTrelloRemoveBoardStarMutation(
  baseOptions?: Apollo.MutationHookOptions<
    TrelloRemoveBoardStarMutation,
    TrelloRemoveBoardStarMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    TrelloRemoveBoardStarMutation,
    TrelloRemoveBoardStarMutationVariables
  >(TrelloRemoveBoardStarDocument, options);
}
export type TrelloRemoveBoardStarMutationHookResult = ReturnType<
  typeof useTrelloRemoveBoardStarMutation
>;
export type TrelloRemoveBoardStarMutationResult =
  Apollo.MutationResult<TrelloRemoveBoardStarMutation>;
export type TrelloRemoveBoardStarMutationOptions = Apollo.BaseMutationOptions<
  TrelloRemoveBoardStarMutation,
  TrelloRemoveBoardStarMutationVariables
>;
