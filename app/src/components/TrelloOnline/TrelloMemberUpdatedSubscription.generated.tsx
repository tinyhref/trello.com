import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const TrelloMemberUpdatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"TrelloMemberUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onMemberUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloOnMemberUpdated","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"_deltas"}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"viewer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscribed"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"boardStars"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"boardObjectId"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"inbox"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloInbox","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"board"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"workspace"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloInboxNotificationsUpdated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"planner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloInboxNotificationsUpdated"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloInboxNotificationsUpdated"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onQuickCaptureNotificationsCleared"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quickCaptureCards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloInboxQuickCaptureCardFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloInboxQuickCaptureCardFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloInboxQuickCaptureCard"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dateCreated"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"TrelloMemberUpdated","document":TrelloMemberUpdatedDocument}} as const;
export type TrelloMemberUpdatedSubscriptionVariables = Types.Exact<{
  memberId: Types.Scalars['ID']['input'];
}>;


export type TrelloMemberUpdatedSubscription = (
  { __typename: 'Subscription' }
  & { trello: (
    { __typename: 'TrelloSubscriptionApi' }
    & { onMemberUpdated?: Types.Maybe<(
      { __typename: 'TrelloMemberUpdated' }
      & Pick<Types.TrelloMemberUpdated, 'id' | '_deltas'>
      & {
        boards?: Types.Maybe<(
          { __typename: 'TrelloBoardConnectionUpdated' }
          & { edges?: Types.Maybe<Array<(
            { __typename: 'TrelloBoardUpdatedEdge' }
            & { node: (
              { __typename: 'TrelloBoardUpdated' }
              & Pick<Types.TrelloBoardUpdated, 'id' | 'closed' | 'name'>
              & { viewer?: Types.Maybe<(
                { __typename: 'TrelloBoardViewerUpdated' }
                & Pick<Types.TrelloBoardViewerUpdated, 'subscribed'>
              )> }
            ) }
          )>> }
        )>,
        boardStars?: Types.Maybe<(
          { __typename: 'TrelloBoardStarConnectionUpdated' }
          & { edges?: Types.Maybe<Array<(
            { __typename: 'TrelloBoardStarUpdatedEdge' }
            & Pick<
              Types.TrelloBoardStarUpdatedEdge,
              | 'id'
              | 'boardObjectId'
              | 'objectId'
              | 'position'
            >
          )>> }
        )>,
        inbox?: Types.Maybe<(
          { __typename: 'TrelloInboxUpdated' }
          & Pick<Types.TrelloInboxUpdated, 'id'>
          & { board: (
            { __typename: 'TrelloBoardUpdated' }
            & Pick<Types.TrelloBoardUpdated, 'id' | 'objectId'>
            & {
              lists?: Types.Maybe<(
                { __typename: 'TrelloListUpdatedConnection' }
                & { edges?: Types.Maybe<Array<(
                  { __typename: 'TrelloListEdgeUpdated' }
                  & { node: (
                    { __typename: 'TrelloListUpdated' }
                    & Pick<Types.TrelloListUpdated, 'id' | 'objectId'>
                  ) }
                )>> }
              )>,
              workspace?: Types.Maybe<(
                { __typename: 'TrelloBoardWorkspaceUpdated' }
                & Pick<Types.TrelloBoardWorkspaceUpdated, 'id' | 'objectId'>
              )>,
            }
          ) }
        )>,
        notifications?: Types.Maybe<(
          { __typename: 'TrelloInboxNotificationsUpdated' }
          & {
            onQuickCaptureNotificationsCleared?: Types.Maybe<Array<(
              { __typename: 'TrelloQuickCaptureNotificationCleared' }
              & Pick<Types.TrelloQuickCaptureNotificationCleared, 'id'>
            )>>,
            quickCaptureCards?: Types.Maybe<Array<(
              { __typename: 'TrelloInboxQuickCaptureCard' }
              & Pick<Types.TrelloInboxQuickCaptureCard, 'dateCreated' | 'source'>
              & { card?: Types.Maybe<(
                { __typename: 'TrelloCard' }
                & Pick<Types.TrelloCard, 'id'>
              )> }
            )>>,
          }
        )>,
        planner?: Types.Maybe<(
          { __typename: 'TrelloPlannerUpdated' }
          & Pick<Types.TrelloPlannerUpdated, 'id'>
          & { accounts?: Types.Maybe<(
            { __typename: 'TrelloPlannerCalendarAccountConnectionUpdated' }
            & { edges?: Types.Maybe<Array<(
              { __typename: 'TrelloPlannerCalendarAccountEdgeUpdated' }
              & { node: (
                { __typename: 'TrelloPlannerCalendarAccountUpdated' }
                & Pick<Types.TrelloPlannerCalendarAccountUpdated, 'id'>
              ) }
            )>> }
          )> }
        )>,
      }
    )> }
  ) }
);

/**
 * __useTrelloMemberUpdatedSubscription__
 *
 * To run a query within a React component, call `useTrelloMemberUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTrelloMemberUpdatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrelloMemberUpdatedSubscription({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useTrelloMemberUpdatedSubscription(
  baseOptions: Apollo.SubscriptionHookOptions<
    TrelloMemberUpdatedSubscription,
    TrelloMemberUpdatedSubscriptionVariables
  > &
    (
      | { variables: TrelloMemberUpdatedSubscriptionVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSubscription<
    TrelloMemberUpdatedSubscription,
    TrelloMemberUpdatedSubscriptionVariables
  >(TrelloMemberUpdatedDocument, options);
}
export type TrelloMemberUpdatedSubscriptionHookResult = ReturnType<
  typeof useTrelloMemberUpdatedSubscription
>;
export type TrelloMemberUpdatedSubscriptionResult =
  Apollo.SubscriptionResult<TrelloMemberUpdatedSubscription>;
