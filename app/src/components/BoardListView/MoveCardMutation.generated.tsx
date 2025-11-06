import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const MoveCardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MoveCard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"card"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCardArgs"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"card"},"value":{"kind":"Variable","name":{"kind":"Name","value":"card"}}},{"kind":"Argument","name":{"kind":"Name","value":"idCard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"idList"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"MoveCard","document":MoveCardDocument}} as const;
export type MoveCardMutationVariables = Types.Exact<{
  card: Types.UpdateCardArgs;
  cardId: Types.Scalars['ID']['input'];
  traceId: Types.Scalars['String']['input'];
}>;


export type MoveCardMutation = (
  { __typename: 'Mutation' }
  & { updateCard?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<
      Types.Card,
      | 'id'
      | 'closed'
      | 'idBoard'
      | 'idList'
      | 'pos'
    >
  )> }
);

export type MoveCardMutationFn = Apollo.MutationFunction<
  MoveCardMutation,
  MoveCardMutationVariables
>;

/**
 * __useMoveCardMutation__
 *
 * To run a mutation, you first call `useMoveCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMoveCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [moveCardMutation, { data, loading, error }] = useMoveCardMutation({
 *   variables: {
 *      card: // value for 'card'
 *      cardId: // value for 'cardId'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useMoveCardMutation(
  baseOptions?: Apollo.MutationHookOptions<
    MoveCardMutation,
    MoveCardMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<MoveCardMutation, MoveCardMutationVariables>(
    MoveCardDocument,
    options,
  );
}
export type MoveCardMutationHookResult = ReturnType<typeof useMoveCardMutation>;
export type MoveCardMutationResult = Apollo.MutationResult<MoveCardMutation>;
export type MoveCardMutationOptions = Apollo.BaseMutationOptions<
  MoveCardMutation,
  MoveCardMutationVariables
>;
