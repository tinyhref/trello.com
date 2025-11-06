import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const EnterpriseNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EnterpriseNotifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"enterprises"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"saml"},{"kind":"EnumValue","value":"member"},{"kind":"EnumValue","value":"memberUnconfirmed"},{"kind":"EnumValue","value":"owned"}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"banners"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"EnterpriseNotifications","document":EnterpriseNotificationsDocument}} as const;
export type EnterpriseNotificationsQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID']['input'];
}>;


export type EnterpriseNotificationsQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id'>
    & { enterprises: Array<(
      { __typename: 'Enterprise' }
      & Pick<Types.Enterprise, 'id' | 'displayName'>
      & { prefs?: Types.Maybe<(
        { __typename: 'Enterprise_Prefs' }
        & { notifications?: Types.Maybe<(
          { __typename: 'EnterpriseNotifications' }
          & { banners?: Types.Maybe<Array<(
            { __typename: 'EnterpriseNotificationBanner' }
            & Pick<Types.EnterpriseNotificationBanner, 'id' | 'message'>
          )>> }
        )> }
      )> }
    )> }
  )> }
);

/**
 * __useEnterpriseNotificationsQuery__
 *
 * To run a query within a React component, call `useEnterpriseNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useEnterpriseNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEnterpriseNotificationsQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useEnterpriseNotificationsQuery(
  baseOptions: TrelloQueryHookOptions<
    EnterpriseNotificationsQuery,
    EnterpriseNotificationsQueryVariables
  > &
    (
      | { variables: EnterpriseNotificationsQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: EnterpriseNotificationsDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    EnterpriseNotificationsQuery,
    EnterpriseNotificationsQueryVariables
  >(EnterpriseNotificationsDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useEnterpriseNotificationsLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    EnterpriseNotificationsQuery,
    EnterpriseNotificationsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    EnterpriseNotificationsQuery,
    EnterpriseNotificationsQueryVariables
  >(EnterpriseNotificationsDocument, options);
}
export function useEnterpriseNotificationsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        EnterpriseNotificationsQuery,
        EnterpriseNotificationsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    EnterpriseNotificationsQuery,
    EnterpriseNotificationsQueryVariables
  >(EnterpriseNotificationsDocument, options);
}
export type EnterpriseNotificationsQueryHookResult = ReturnType<
  typeof useEnterpriseNotificationsQuery
>;
export type EnterpriseNotificationsLazyQueryHookResult = ReturnType<
  typeof useEnterpriseNotificationsLazyQuery
>;
export type EnterpriseNotificationsSuspenseQueryHookResult = ReturnType<
  typeof useEnterpriseNotificationsSuspenseQuery
>;
export type EnterpriseNotificationsQueryResult = Apollo.QueryResult<
  EnterpriseNotificationsQuery,
  EnterpriseNotificationsQueryVariables
>;
