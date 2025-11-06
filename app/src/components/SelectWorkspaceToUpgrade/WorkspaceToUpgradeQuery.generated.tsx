import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const WorkspaceToUpgradeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspaceToUpgrade"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idPremOrgsAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"credits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"enterprise"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"logoHash"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deactivated"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"unconfirmed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"offering"}},{"kind":"Field","name":{"kind":"Name","value":"paidAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ixSubscriber"}},{"kind":"Field","name":{"kind":"Name","value":"standing"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"WorkspaceToUpgrade","document":WorkspaceToUpgradeDocument}} as const;
export type WorkspaceToUpgradeQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID']['input'];
}>;


export type WorkspaceToUpgradeQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'idPremOrgsAdmin' | 'memberType'>
    & { organizations: Array<(
      { __typename: 'Organization' }
      & Pick<
        Types.Organization,
        | 'id'
        | 'displayName'
        | 'idEnterprise'
        | 'logoHash'
        | 'name'
        | 'offering'
        | 'premiumFeatures'
      >
      & {
        credits: Array<(
          { __typename: 'Credit' }
          & Pick<Types.Credit, 'id' | 'count' | 'type'>
        )>,
        enterprise?: Types.Maybe<(
          { __typename: 'Enterprise' }
          & Pick<Types.Enterprise, 'id'>
        )>,
        memberships: Array<(
          { __typename: 'Organization_Membership' }
          & Pick<
            Types.Organization_Membership,
            | 'id'
            | 'deactivated'
            | 'idMember'
            | 'memberType'
            | 'unconfirmed'
          >
        )>,
        paidAccount?: Types.Maybe<(
          { __typename: 'PaidAccount' }
          & Pick<Types.PaidAccount, 'ixSubscriber' | 'standing'>
        )>,
      }
    )> }
  )> }
);

/**
 * __useWorkspaceToUpgradeQuery__
 *
 * To run a query within a React component, call `useWorkspaceToUpgradeQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceToUpgradeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceToUpgradeQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useWorkspaceToUpgradeQuery(
  baseOptions: TrelloQueryHookOptions<
    WorkspaceToUpgradeQuery,
    WorkspaceToUpgradeQueryVariables
  > &
    (
      | { variables: WorkspaceToUpgradeQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: WorkspaceToUpgradeDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    WorkspaceToUpgradeQuery,
    WorkspaceToUpgradeQueryVariables
  >(WorkspaceToUpgradeDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useWorkspaceToUpgradeLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    WorkspaceToUpgradeQuery,
    WorkspaceToUpgradeQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    WorkspaceToUpgradeQuery,
    WorkspaceToUpgradeQueryVariables
  >(WorkspaceToUpgradeDocument, options);
}
export function useWorkspaceToUpgradeSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        WorkspaceToUpgradeQuery,
        WorkspaceToUpgradeQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    WorkspaceToUpgradeQuery,
    WorkspaceToUpgradeQueryVariables
  >(WorkspaceToUpgradeDocument, options);
}
export type WorkspaceToUpgradeQueryHookResult = ReturnType<
  typeof useWorkspaceToUpgradeQuery
>;
export type WorkspaceToUpgradeLazyQueryHookResult = ReturnType<
  typeof useWorkspaceToUpgradeLazyQuery
>;
export type WorkspaceToUpgradeSuspenseQueryHookResult = ReturnType<
  typeof useWorkspaceToUpgradeSuspenseQuery
>;
export type WorkspaceToUpgradeQueryResult = Apollo.QueryResult<
  WorkspaceToUpgradeQuery,
  WorkspaceToUpgradeQueryVariables
>;
