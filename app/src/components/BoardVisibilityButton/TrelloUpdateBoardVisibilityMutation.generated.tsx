import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const TrelloUpdateBoardVisibilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TrelloUpdateBoardVisibility"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloUpdateBoardVisibilityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBoardVisibility"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloUpdateBoardVisibility","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"TrelloUpdateBoardVisibility","document":TrelloUpdateBoardVisibilityDocument}} as const;
export type TrelloUpdateBoardVisibilityMutationVariables = Types.Exact<{
  input: Types.TrelloUpdateBoardVisibilityInput;
}>;


export type TrelloUpdateBoardVisibilityMutation = (
  { __typename: 'Mutation' }
  & { trello: (
    { __typename: 'TrelloMutationApi' }
    & { updateBoardVisibility?: Types.Maybe<(
      { __typename: 'TrelloUpdateBoardVisibilityPayload' }
      & Pick<Types.TrelloUpdateBoardVisibilityPayload, 'success'>
      & {
        board?: Types.Maybe<(
          { __typename: 'TrelloBoard' }
          & Pick<Types.TrelloBoard, 'id'>
          & { prefs: (
            { __typename: 'TrelloBoardPrefs' }
            & Pick<Types.TrelloBoardPrefs, 'permissionLevel'>
          ) }
        )>,
        errors?: Types.Maybe<Array<(
          { __typename: 'MutationError' }
          & Pick<Types.MutationError, 'message'>
        )>>,
      }
    )> }
  ) }
);

export type TrelloUpdateBoardVisibilityMutationFn = Apollo.MutationFunction<
  TrelloUpdateBoardVisibilityMutation,
  TrelloUpdateBoardVisibilityMutationVariables
>;

/**
 * __useTrelloUpdateBoardVisibilityMutation__
 *
 * To run a mutation, you first call `useTrelloUpdateBoardVisibilityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTrelloUpdateBoardVisibilityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [trelloUpdateBoardVisibilityMutation, { data, loading, error }] = useTrelloUpdateBoardVisibilityMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTrelloUpdateBoardVisibilityMutation(
  baseOptions?: Apollo.MutationHookOptions<
    TrelloUpdateBoardVisibilityMutation,
    TrelloUpdateBoardVisibilityMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    TrelloUpdateBoardVisibilityMutation,
    TrelloUpdateBoardVisibilityMutationVariables
  >(TrelloUpdateBoardVisibilityDocument, options);
}
export type TrelloUpdateBoardVisibilityMutationHookResult = ReturnType<
  typeof useTrelloUpdateBoardVisibilityMutation
>;
export type TrelloUpdateBoardVisibilityMutationResult =
  Apollo.MutationResult<TrelloUpdateBoardVisibilityMutation>;
export type TrelloUpdateBoardVisibilityMutationOptions =
  Apollo.BaseMutationOptions<
    TrelloUpdateBoardVisibilityMutation,
    TrelloUpdateBoardVisibilityMutationVariables
  >;
