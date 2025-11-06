import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const TrelloMarkInboxNotificationsReadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TrelloMarkInboxNotificationsRead"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markInboxNotificationsRead"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloNotificationInboxRead","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"updatedCount"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"TrelloMarkInboxNotificationsRead","document":TrelloMarkInboxNotificationsReadDocument}} as const;
export type TrelloMarkInboxNotificationsReadMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type TrelloMarkInboxNotificationsReadMutation = (
  { __typename: 'Mutation' }
  & { trello: (
    { __typename: 'TrelloMutationApi' }
    & { markInboxNotificationsRead?: Types.Maybe<(
      { __typename: 'TrelloMarkInboxNotificationsReadPayload' }
      & Pick<Types.TrelloMarkInboxNotificationsReadPayload, 'success' | 'updatedCount'>
    )> }
  ) }
);

export type TrelloMarkInboxNotificationsReadMutationFn =
  Apollo.MutationFunction<
    TrelloMarkInboxNotificationsReadMutation,
    TrelloMarkInboxNotificationsReadMutationVariables
  >;

/**
 * __useTrelloMarkInboxNotificationsReadMutation__
 *
 * To run a mutation, you first call `useTrelloMarkInboxNotificationsReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTrelloMarkInboxNotificationsReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [trelloMarkInboxNotificationsReadMutation, { data, loading, error }] = useTrelloMarkInboxNotificationsReadMutation({
 *   variables: {
 *   },
 * });
 */
export function useTrelloMarkInboxNotificationsReadMutation(
  baseOptions?: Apollo.MutationHookOptions<
    TrelloMarkInboxNotificationsReadMutation,
    TrelloMarkInboxNotificationsReadMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    TrelloMarkInboxNotificationsReadMutation,
    TrelloMarkInboxNotificationsReadMutationVariables
  >(TrelloMarkInboxNotificationsReadDocument, options);
}
export type TrelloMarkInboxNotificationsReadMutationHookResult = ReturnType<
  typeof useTrelloMarkInboxNotificationsReadMutation
>;
export type TrelloMarkInboxNotificationsReadMutationResult =
  Apollo.MutationResult<TrelloMarkInboxNotificationsReadMutation>;
export type TrelloMarkInboxNotificationsReadMutationOptions =
  Apollo.BaseMutationOptions<
    TrelloMarkInboxNotificationsReadMutation,
    TrelloMarkInboxNotificationsReadMutationVariables
  >;
