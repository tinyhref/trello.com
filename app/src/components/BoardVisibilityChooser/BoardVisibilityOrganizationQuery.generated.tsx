import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const BoardVisibilityOrganizationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardVisibilityOrganization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"enterprise"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deactivated"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"unconfirmed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"offering"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boardVisibilityRestrict"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enterprise"}},{"kind":"Field","name":{"kind":"Name","value":"org"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"public"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"BoardVisibilityOrganization","document":BoardVisibilityOrganizationDocument}} as const;
export type BoardVisibilityOrganizationQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID']['input'];
}>;


export type BoardVisibilityOrganizationQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<
      Types.Organization,
      | 'id'
      | 'displayName'
      | 'idEnterprise'
      | 'name'
      | 'offering'
      | 'premiumFeatures'
    >
    & {
      enterprise?: Types.Maybe<(
        { __typename: 'Enterprise' }
        & Pick<Types.Enterprise, 'id' | 'displayName'>
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
      prefs: (
        { __typename: 'Organization_Prefs' }
        & { boardVisibilityRestrict?: Types.Maybe<(
          { __typename: 'Organization_Prefs_BoardVisibilityRestrict' }
          & Pick<
            Types.Organization_Prefs_BoardVisibilityRestrict,
            | 'enterprise'
            | 'org'
            | 'private'
            | 'public'
          >
        )> }
      ),
    }
  )> }
);

/**
 * __useBoardVisibilityOrganizationQuery__
 *
 * To run a query within a React component, call `useBoardVisibilityOrganizationQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardVisibilityOrganizationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardVisibilityOrganizationQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useBoardVisibilityOrganizationQuery(
  baseOptions: TrelloQueryHookOptions<
    BoardVisibilityOrganizationQuery,
    BoardVisibilityOrganizationQueryVariables
  > &
    (
      | { variables: BoardVisibilityOrganizationQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: BoardVisibilityOrganizationDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    BoardVisibilityOrganizationQuery,
    BoardVisibilityOrganizationQueryVariables
  >(BoardVisibilityOrganizationDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useBoardVisibilityOrganizationLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    BoardVisibilityOrganizationQuery,
    BoardVisibilityOrganizationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    BoardVisibilityOrganizationQuery,
    BoardVisibilityOrganizationQueryVariables
  >(BoardVisibilityOrganizationDocument, options);
}
export function useBoardVisibilityOrganizationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        BoardVisibilityOrganizationQuery,
        BoardVisibilityOrganizationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    BoardVisibilityOrganizationQuery,
    BoardVisibilityOrganizationQueryVariables
  >(BoardVisibilityOrganizationDocument, options);
}
export type BoardVisibilityOrganizationQueryHookResult = ReturnType<
  typeof useBoardVisibilityOrganizationQuery
>;
export type BoardVisibilityOrganizationLazyQueryHookResult = ReturnType<
  typeof useBoardVisibilityOrganizationLazyQuery
>;
export type BoardVisibilityOrganizationSuspenseQueryHookResult = ReturnType<
  typeof useBoardVisibilityOrganizationSuspenseQuery
>;
export type BoardVisibilityOrganizationQueryResult = Apollo.QueryResult<
  BoardVisibilityOrganizationQuery,
  BoardVisibilityOrganizationQueryVariables
>;
