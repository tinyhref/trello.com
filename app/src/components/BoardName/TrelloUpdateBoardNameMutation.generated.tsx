import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const TrelloUpdateBoardNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TrelloUpdateBoardName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBoardName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloUpdateBoardName","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"TrelloUpdateBoardName","document":TrelloUpdateBoardNameDocument}} as const;
export type TrelloUpdateBoardNameMutationVariables = Types.Exact<{
  boardId: Types.Scalars['ID']['input'];
  name: Types.Scalars['String']['input'];
}>;


export type TrelloUpdateBoardNameMutation = (
  { __typename: 'Mutation' }
  & { trello: (
    { __typename: 'TrelloMutationApi' }
    & { updateBoardName?: Types.Maybe<(
      { __typename: 'TrelloUpdateBoardNamePayload' }
      & Pick<Types.TrelloUpdateBoardNamePayload, 'success'>
      & {
        board?: Types.Maybe<(
          { __typename: 'TrelloBoard' }
          & Pick<Types.TrelloBoard, 'id' | 'name'>
        )>,
        errors?: Types.Maybe<Array<(
          { __typename: 'MutationError' }
          & Pick<Types.MutationError, 'message'>
        )>>,
      }
    )> }
  ) }
);

export type TrelloUpdateBoardNameMutationFn = Apollo.MutationFunction<
  TrelloUpdateBoardNameMutation,
  TrelloUpdateBoardNameMutationVariables
>;

/**
 * __useTrelloUpdateBoardNameMutation__
 *
 * To run a mutation, you first call `useTrelloUpdateBoardNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTrelloUpdateBoardNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [trelloUpdateBoardNameMutation, { data, loading, error }] = useTrelloUpdateBoardNameMutation({
 *   variables: {
 *      boardId: // value for 'boardId'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useTrelloUpdateBoardNameMutation(
  baseOptions?: Apollo.MutationHookOptions<
    TrelloUpdateBoardNameMutation,
    TrelloUpdateBoardNameMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    TrelloUpdateBoardNameMutation,
    TrelloUpdateBoardNameMutationVariables
  >(TrelloUpdateBoardNameDocument, options);
}
export type TrelloUpdateBoardNameMutationHookResult = ReturnType<
  typeof useTrelloUpdateBoardNameMutation
>;
export type TrelloUpdateBoardNameMutationResult =
  Apollo.MutationResult<TrelloUpdateBoardNameMutation>;
export type TrelloUpdateBoardNameMutationOptions = Apollo.BaseMutationOptions<
  TrelloUpdateBoardNameMutation,
  TrelloUpdateBoardNameMutationVariables
>;
