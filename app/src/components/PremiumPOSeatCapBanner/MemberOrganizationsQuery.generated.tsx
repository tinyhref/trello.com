import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const MemberOrganizationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MemberOrganizations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idPremOrgsAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"availableLicenseCount"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"maximumLicenseCount"}},{"kind":"Field","name":{"kind":"Name","value":"offering"}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"MemberOrganizations","document":MemberOrganizationsDocument}} as const;
export type MemberOrganizationsQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID']['input'];
}>;


export type MemberOrganizationsQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'idPremOrgsAdmin'>
    & { organizations: Array<(
      { __typename: 'Organization' }
      & Pick<
        Types.Organization,
        | 'id'
        | 'availableLicenseCount'
        | 'displayName'
        | 'idEnterprise'
        | 'maximumLicenseCount'
        | 'offering'
        | 'premiumFeatures'
      >
    )> }
  )> }
);

/**
 * __useMemberOrganizationsQuery__
 *
 * To run a query within a React component, call `useMemberOrganizationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMemberOrganizationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMemberOrganizationsQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useMemberOrganizationsQuery(
  baseOptions: TrelloQueryHookOptions<
    MemberOrganizationsQuery,
    MemberOrganizationsQueryVariables
  > &
    (
      | { variables: MemberOrganizationsQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: MemberOrganizationsDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    MemberOrganizationsQuery,
    MemberOrganizationsQueryVariables
  >(MemberOrganizationsDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useMemberOrganizationsLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    MemberOrganizationsQuery,
    MemberOrganizationsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    MemberOrganizationsQuery,
    MemberOrganizationsQueryVariables
  >(MemberOrganizationsDocument, options);
}
export function useMemberOrganizationsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        MemberOrganizationsQuery,
        MemberOrganizationsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    MemberOrganizationsQuery,
    MemberOrganizationsQueryVariables
  >(MemberOrganizationsDocument, options);
}
export type MemberOrganizationsQueryHookResult = ReturnType<
  typeof useMemberOrganizationsQuery
>;
export type MemberOrganizationsLazyQueryHookResult = ReturnType<
  typeof useMemberOrganizationsLazyQuery
>;
export type MemberOrganizationsSuspenseQueryHookResult = ReturnType<
  typeof useMemberOrganizationsSuspenseQuery
>;
export type MemberOrganizationsQueryResult = Apollo.QueryResult<
  MemberOrganizationsQuery,
  MemberOrganizationsQueryVariables
>;
