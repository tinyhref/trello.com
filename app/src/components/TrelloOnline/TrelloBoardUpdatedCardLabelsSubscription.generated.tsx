import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const TrelloBoardUpdatedCardLabelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"TrelloBoardUpdatedCardLabels"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onBoardUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloOnBoardUpdated","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"_deltas"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"enterprise"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"lists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloCardUpdated"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloCardUpdatedSubscriptionCard"}}]}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"onLabelDeleted"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canInvite"}},{"kind":"Field","name":{"kind":"Name","value":"invitations"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"workspace"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloCardUpdatedSubscriptionCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloCardUpdated"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"TrelloBoardUpdatedCardLabels","document":TrelloBoardUpdatedCardLabelsDocument}} as const;
export type TrelloBoardUpdatedCardLabelsSubscriptionVariables = Types.Exact<{
  nodeId: Types.Scalars['ID']['input'];
}>;


export type TrelloBoardUpdatedCardLabelsSubscription = (
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
        lists?: Types.Maybe<(
          { __typename: 'TrelloListUpdatedConnection' }
          & { edges?: Types.Maybe<Array<(
            { __typename: 'TrelloListEdgeUpdated' }
            & { node: (
              { __typename: 'TrelloListUpdated' }
              & Pick<Types.TrelloListUpdated, 'id'>
              & { cards?: Types.Maybe<(
                { __typename: 'TrelloCardUpdatedConnection' }
                & { edges?: Types.Maybe<Array<(
                  { __typename: 'TrelloCardEdgeUpdated' }
                  & { node:
                    | (
                      { __typename: 'TrelloCardUpdated' }
                      & Pick<Types.TrelloCardUpdated, 'id'>
                      & { labels?: Types.Maybe<(
                        { __typename: 'TrelloLabelUpdatedConnection' }
                        & { edges?: Types.Maybe<Array<(
                          { __typename: 'TrelloCardLabelEdgeUpdated' }
                          & { node: (
                            { __typename: 'TrelloLabelId' }
                            & Pick<Types.TrelloLabelId, 'id'>
                          ) }
                        )>> }
                      )> }
                    )
                    | { __typename: 'TrelloInboxCardUpdated' }
                   }
                )>> }
              )> }
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
 * __useTrelloBoardUpdatedCardLabelsSubscription__
 *
 * To run a query within a React component, call `useTrelloBoardUpdatedCardLabelsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTrelloBoardUpdatedCardLabelsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrelloBoardUpdatedCardLabelsSubscription({
 *   variables: {
 *      nodeId: // value for 'nodeId'
 *   },
 * });
 */
export function useTrelloBoardUpdatedCardLabelsSubscription(
  baseOptions: Apollo.SubscriptionHookOptions<
    TrelloBoardUpdatedCardLabelsSubscription,
    TrelloBoardUpdatedCardLabelsSubscriptionVariables
  > &
    (
      | {
          variables: TrelloBoardUpdatedCardLabelsSubscriptionVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSubscription<
    TrelloBoardUpdatedCardLabelsSubscription,
    TrelloBoardUpdatedCardLabelsSubscriptionVariables
  >(TrelloBoardUpdatedCardLabelsDocument, options);
}
export type TrelloBoardUpdatedCardLabelsSubscriptionHookResult = ReturnType<
  typeof useTrelloBoardUpdatedCardLabelsSubscription
>;
export type TrelloBoardUpdatedCardLabelsSubscriptionResult =
  Apollo.SubscriptionResult<TrelloBoardUpdatedCardLabelsSubscription>;
