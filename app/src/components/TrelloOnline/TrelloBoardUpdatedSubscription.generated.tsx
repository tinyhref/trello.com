import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const TrelloBoardUpdatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"TrelloBoardUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onBoardUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloOnBoardUpdated","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"_deltas"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"enterprise"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"onLabelDeleted"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canInvite"}},{"kind":"Field","name":{"kind":"Name","value":"invitations"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"workspace"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"TrelloBoardUpdated","document":TrelloBoardUpdatedDocument}} as const;
export type TrelloBoardUpdatedSubscriptionVariables = Types.Exact<{
  nodeId: Types.Scalars['ID']['input'];
}>;


export type TrelloBoardUpdatedSubscription = (
  { __typename: 'Subscription' }
  & { trello: (
    { __typename: 'TrelloSubscriptionApi' }
    & { onBoardUpdated?: Types.Maybe<(
      { __typename: 'TrelloBoardUpdated' }
      & Pick<
        Types.TrelloBoardUpdated,
        | 'id'
        | '_deltas'
        | 'closed'
        | 'name'
        | 'premiumFeatures'
      >
      & {
        enterprise?: Types.Maybe<(
          { __typename: 'TrelloEnterprise' }
          & Pick<Types.TrelloEnterprise, 'id' | 'objectId'>
        )>,
        labels?: Types.Maybe<(
          { __typename: 'TrelloLabelConnectionUpdated' }
          & { edges?: Types.Maybe<Array<(
            { __typename: 'TrelloLabelEdgeUpdated' }
            & { node: (
              { __typename: 'TrelloLabelUpdated' }
              & Pick<
                Types.TrelloLabelUpdated,
                | 'id'
                | 'color'
                | 'name'
                | 'objectId'
              >
            ) }
          )>> }
        )>,
        onLabelDeleted?: Types.Maybe<Array<(
          { __typename: 'TrelloLabelDeleted' }
          & Pick<Types.TrelloLabelDeleted, 'id'>
        )>>,
        prefs?: Types.Maybe<(
          { __typename: 'TrelloBoardPrefs' }
          & Pick<
            Types.TrelloBoardPrefs,
            | 'canInvite'
            | 'invitations'
            | 'isTemplate'
            | 'permissionLevel'
          >
        )>,
        workspace?: Types.Maybe<(
          { __typename: 'TrelloBoardWorkspaceUpdated' }
          & Pick<Types.TrelloBoardWorkspaceUpdated, 'id' | 'objectId'>
        )>,
      }
    )> }
  ) }
);

/**
 * __useTrelloBoardUpdatedSubscription__
 *
 * To run a query within a React component, call `useTrelloBoardUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTrelloBoardUpdatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrelloBoardUpdatedSubscription({
 *   variables: {
 *      nodeId: // value for 'nodeId'
 *   },
 * });
 */
export function useTrelloBoardUpdatedSubscription(
  baseOptions: Apollo.SubscriptionHookOptions<
    TrelloBoardUpdatedSubscription,
    TrelloBoardUpdatedSubscriptionVariables
  > &
    (
      | { variables: TrelloBoardUpdatedSubscriptionVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSubscription<
    TrelloBoardUpdatedSubscription,
    TrelloBoardUpdatedSubscriptionVariables
  >(TrelloBoardUpdatedDocument, options);
}
export type TrelloBoardUpdatedSubscriptionHookResult = ReturnType<
  typeof useTrelloBoardUpdatedSubscription
>;
export type TrelloBoardUpdatedSubscriptionResult =
  Apollo.SubscriptionResult<TrelloBoardUpdatedSubscription>;
