import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const TrelloWorkspaceUpdatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"TrelloWorkspaceUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onWorkspaceUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloOnWorkspaceUpdated","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"_deltas"}},{"kind":"Field","name":{"kind":"Name","value":"enterprise"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"offering"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"TrelloWorkspaceUpdated","document":TrelloWorkspaceUpdatedDocument}} as const;
export type TrelloWorkspaceUpdatedSubscriptionVariables = Types.Exact<{
  workspaceId: Types.Scalars['ID']['input'];
}>;


export type TrelloWorkspaceUpdatedSubscription = (
  { __typename: 'Subscription' }
  & { trello: (
    { __typename: 'TrelloSubscriptionApi' }
    & { onWorkspaceUpdated?: Types.Maybe<(
      { __typename: 'TrelloWorkspaceUpdated' }
      & Pick<Types.TrelloWorkspaceUpdated, 'id' | '_deltas' | 'offering'>
      & { enterprise?: Types.Maybe<(
        { __typename: 'TrelloWorkspaceEnterpriseUpdated' }
        & Pick<Types.TrelloWorkspaceEnterpriseUpdated, 'id'>
      )> }
    )> }
  ) }
);

/**
 * __useTrelloWorkspaceUpdatedSubscription__
 *
 * To run a query within a React component, call `useTrelloWorkspaceUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTrelloWorkspaceUpdatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrelloWorkspaceUpdatedSubscription({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useTrelloWorkspaceUpdatedSubscription(
  baseOptions: Apollo.SubscriptionHookOptions<
    TrelloWorkspaceUpdatedSubscription,
    TrelloWorkspaceUpdatedSubscriptionVariables
  > &
    (
      | {
          variables: TrelloWorkspaceUpdatedSubscriptionVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSubscription<
    TrelloWorkspaceUpdatedSubscription,
    TrelloWorkspaceUpdatedSubscriptionVariables
  >(TrelloWorkspaceUpdatedDocument, options);
}
export type TrelloWorkspaceUpdatedSubscriptionHookResult = ReturnType<
  typeof useTrelloWorkspaceUpdatedSubscription
>;
export type TrelloWorkspaceUpdatedSubscriptionResult =
  Apollo.SubscriptionResult<TrelloWorkspaceUpdatedSubscription>;
