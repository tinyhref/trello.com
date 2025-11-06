import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const SubscribeToCardShortcutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SubscribeToCardShortcut"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subscribed"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCardSubscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"subscribed"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subscribed"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subscribed"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"SubscribeToCardShortcut","document":SubscribeToCardShortcutDocument}} as const;
export type SubscribeToCardShortcutMutationVariables = Types.Exact<{
  cardId: Types.Scalars['ID']['input'];
  subscribed: Types.Scalars['Boolean']['input'];
  traceId: Types.Scalars['String']['input'];
}>;


export type SubscribeToCardShortcutMutation = (
  { __typename: 'Mutation' }
  & { updateCardSubscription?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'subscribed'>
  )> }
);

export type SubscribeToCardShortcutMutationFn = Apollo.MutationFunction<
  SubscribeToCardShortcutMutation,
  SubscribeToCardShortcutMutationVariables
>;

/**
 * __useSubscribeToCardShortcutMutation__
 *
 * To run a mutation, you first call `useSubscribeToCardShortcutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubscribeToCardShortcutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [subscribeToCardShortcutMutation, { data, loading, error }] = useSubscribeToCardShortcutMutation({
 *   variables: {
 *      cardId: // value for 'cardId'
 *      subscribed: // value for 'subscribed'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useSubscribeToCardShortcutMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SubscribeToCardShortcutMutation,
    SubscribeToCardShortcutMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    SubscribeToCardShortcutMutation,
    SubscribeToCardShortcutMutationVariables
  >(SubscribeToCardShortcutDocument, options);
}
export type SubscribeToCardShortcutMutationHookResult = ReturnType<
  typeof useSubscribeToCardShortcutMutation
>;
export type SubscribeToCardShortcutMutationResult =
  Apollo.MutationResult<SubscribeToCardShortcutMutation>;
export type SubscribeToCardShortcutMutationOptions = Apollo.BaseMutationOptions<
  SubscribeToCardShortcutMutation,
  SubscribeToCardShortcutMutationVariables
>;
