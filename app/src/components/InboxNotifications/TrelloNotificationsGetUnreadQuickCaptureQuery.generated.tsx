import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const TrelloNotificationsGetUnreadQuickCaptureDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TrelloNotificationsGetUnreadQuickCapture"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloMe","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"StringValue","value":"UNREAD","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"types"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"QUICK_CAPTURE","block":false}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloMemberNotifications","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloQuickCaptureNotification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrelloQuickCaptureNotificationFields"}}]}}]}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrelloQuickCaptureNotificationFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloQuickCaptureNotification"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"card"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"TrelloNotificationsGetUnreadQuickCapture","document":TrelloNotificationsGetUnreadQuickCaptureDocument}} as const;
export type TrelloNotificationsGetUnreadQuickCaptureQueryVariables = Types.Exact<{
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type TrelloNotificationsGetUnreadQuickCaptureQuery = (
  { __typename: 'Query' }
  & { trello: (
    { __typename: 'TrelloQueryApi' }
    & { me?: Types.Maybe<(
      { __typename: 'TrelloMember' }
      & Pick<Types.TrelloMember, 'id'>
      & { notifications?: Types.Maybe<(
        { __typename: 'TrelloNotificationConnection' }
        & { edges?: Types.Maybe<Array<(
          { __typename: 'TrelloNotificationEdge' }
          & { node?: Types.Maybe<(
            { __typename: 'TrelloQuickCaptureNotification' }
            & Pick<Types.TrelloQuickCaptureNotification, 'id'>
            & { card?: Types.Maybe<(
              { __typename: 'TrelloQuickCaptureCard' }
              & Pick<Types.TrelloQuickCaptureCard, 'id'>
            )> }
          )> }
        )>> }
      )> }
    )> }
  ) }
);

/**
 * __useTrelloNotificationsGetUnreadQuickCaptureQuery__
 *
 * To run a query within a React component, call `useTrelloNotificationsGetUnreadQuickCaptureQuery` and pass it any options that fit your needs.
 * When your component renders, `useTrelloNotificationsGetUnreadQuickCaptureQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrelloNotificationsGetUnreadQuickCaptureQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useTrelloNotificationsGetUnreadQuickCaptureQuery(
  baseOptions?: TrelloQueryHookOptions<
    TrelloNotificationsGetUnreadQuickCaptureQuery,
    TrelloNotificationsGetUnreadQuickCaptureQueryVariables
  >,
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: TrelloNotificationsGetUnreadQuickCaptureDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    TrelloNotificationsGetUnreadQuickCaptureQuery,
    TrelloNotificationsGetUnreadQuickCaptureQueryVariables
  >(TrelloNotificationsGetUnreadQuickCaptureDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useTrelloNotificationsGetUnreadQuickCaptureLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    TrelloNotificationsGetUnreadQuickCaptureQuery,
    TrelloNotificationsGetUnreadQuickCaptureQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    TrelloNotificationsGetUnreadQuickCaptureQuery,
    TrelloNotificationsGetUnreadQuickCaptureQueryVariables
  >(TrelloNotificationsGetUnreadQuickCaptureDocument, options);
}
export function useTrelloNotificationsGetUnreadQuickCaptureSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        TrelloNotificationsGetUnreadQuickCaptureQuery,
        TrelloNotificationsGetUnreadQuickCaptureQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    TrelloNotificationsGetUnreadQuickCaptureQuery,
    TrelloNotificationsGetUnreadQuickCaptureQueryVariables
  >(TrelloNotificationsGetUnreadQuickCaptureDocument, options);
}
export type TrelloNotificationsGetUnreadQuickCaptureQueryHookResult =
  ReturnType<typeof useTrelloNotificationsGetUnreadQuickCaptureQuery>;
export type TrelloNotificationsGetUnreadQuickCaptureLazyQueryHookResult =
  ReturnType<typeof useTrelloNotificationsGetUnreadQuickCaptureLazyQuery>;
export type TrelloNotificationsGetUnreadQuickCaptureSuspenseQueryHookResult =
  ReturnType<typeof useTrelloNotificationsGetUnreadQuickCaptureSuspenseQuery>;
export type TrelloNotificationsGetUnreadQuickCaptureQueryResult =
  Apollo.QueryResult<
    TrelloNotificationsGetUnreadQuickCaptureQuery,
    TrelloNotificationsGetUnreadQuickCaptureQueryVariables
  >;
