import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const EligibleWorkspacesForProvisioningDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EligibleWorkspacesForProvisioning"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"jwmLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idCloud"}}]}},{"kind":"Field","name":{"kind":"Name","value":"offering"}},{"kind":"Field","name":{"kind":"Name","value":"paidAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trialExpiration"}},{"kind":"Field","name":{"kind":"Name","value":"trialType"}}]}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"EligibleWorkspacesForProvisioning","document":EligibleWorkspacesForProvisioningDocument}} as const;
export type EligibleWorkspacesForProvisioningQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID']['input'];
}>;


export type EligibleWorkspacesForProvisioningQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id'>
    & { organizations: Array<(
      { __typename: 'Organization' }
      & Pick<
        Types.Organization,
        | 'id'
        | 'displayName'
        | 'idEnterprise'
        | 'offering'
      >
      & {
        jwmLink?: Types.Maybe<(
          { __typename: 'JwmWorkspaceLink' }
          & Pick<Types.JwmWorkspaceLink, 'idCloud'>
        )>,
        paidAccount?: Types.Maybe<(
          { __typename: 'PaidAccount' }
          & Pick<Types.PaidAccount, 'trialExpiration' | 'trialType'>
        )>,
      }
    )> }
  )> }
);

/**
 * __useEligibleWorkspacesForProvisioningQuery__
 *
 * To run a query within a React component, call `useEligibleWorkspacesForProvisioningQuery` and pass it any options that fit your needs.
 * When your component renders, `useEligibleWorkspacesForProvisioningQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEligibleWorkspacesForProvisioningQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useEligibleWorkspacesForProvisioningQuery(
  baseOptions: TrelloQueryHookOptions<
    EligibleWorkspacesForProvisioningQuery,
    EligibleWorkspacesForProvisioningQueryVariables
  > &
    (
      | {
          variables: EligibleWorkspacesForProvisioningQueryVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: EligibleWorkspacesForProvisioningDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    EligibleWorkspacesForProvisioningQuery,
    EligibleWorkspacesForProvisioningQueryVariables
  >(EligibleWorkspacesForProvisioningDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useEligibleWorkspacesForProvisioningLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    EligibleWorkspacesForProvisioningQuery,
    EligibleWorkspacesForProvisioningQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    EligibleWorkspacesForProvisioningQuery,
    EligibleWorkspacesForProvisioningQueryVariables
  >(EligibleWorkspacesForProvisioningDocument, options);
}
export function useEligibleWorkspacesForProvisioningSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        EligibleWorkspacesForProvisioningQuery,
        EligibleWorkspacesForProvisioningQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    EligibleWorkspacesForProvisioningQuery,
    EligibleWorkspacesForProvisioningQueryVariables
  >(EligibleWorkspacesForProvisioningDocument, options);
}
export type EligibleWorkspacesForProvisioningQueryHookResult = ReturnType<
  typeof useEligibleWorkspacesForProvisioningQuery
>;
export type EligibleWorkspacesForProvisioningLazyQueryHookResult = ReturnType<
  typeof useEligibleWorkspacesForProvisioningLazyQuery
>;
export type EligibleWorkspacesForProvisioningSuspenseQueryHookResult =
  ReturnType<typeof useEligibleWorkspacesForProvisioningSuspenseQuery>;
export type EligibleWorkspacesForProvisioningQueryResult = Apollo.QueryResult<
  EligibleWorkspacesForProvisioningQuery,
  EligibleWorkspacesForProvisioningQueryVariables
>;
