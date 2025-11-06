import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const MyEnterpriseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyEnterprise"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"enterprises"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"saml"},{"kind":"EnumValue","value":"member"},{"kind":"EnumValue","value":"memberUnconfirmed"},{"kind":"EnumValue","value":"owned"}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organizationPrefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boardVisibilityRestrict"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enterprise"}},{"kind":"Field","name":{"kind":"Name","value":"org"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"public"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"MyEnterprise","document":MyEnterpriseDocument}} as const;
export type MyEnterpriseQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type MyEnterpriseQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'idEnterprise'>
    & { enterprises: Array<(
      { __typename: 'Enterprise' }
      & Pick<Types.Enterprise, 'id'>
      & { organizationPrefs: (
        { __typename: 'Enterprise_Organization_Prefs' }
        & { boardVisibilityRestrict?: Types.Maybe<(
          { __typename: 'Enterprise_Organization_Prefs_BoardRestrictions' }
          & Pick<
            Types.Enterprise_Organization_Prefs_BoardRestrictions,
            | 'enterprise'
            | 'org'
            | 'private'
            | 'public'
          >
        )> }
      ) }
    )> }
  )> }
);

/**
 * __useMyEnterpriseQuery__
 *
 * To run a query within a React component, call `useMyEnterpriseQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyEnterpriseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyEnterpriseQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMyEnterpriseQuery(
  baseOptions: TrelloQueryHookOptions<
    MyEnterpriseQuery,
    MyEnterpriseQueryVariables
  > &
    (
      | { variables: MyEnterpriseQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: MyEnterpriseDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<MyEnterpriseQuery, MyEnterpriseQueryVariables>(
    MyEnterpriseDocument,
    options,
  );
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useMyEnterpriseLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    MyEnterpriseQuery,
    MyEnterpriseQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MyEnterpriseQuery, MyEnterpriseQueryVariables>(
    MyEnterpriseDocument,
    options,
  );
}
export function useMyEnterpriseSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        MyEnterpriseQuery,
        MyEnterpriseQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<MyEnterpriseQuery, MyEnterpriseQueryVariables>(
    MyEnterpriseDocument,
    options,
  );
}
export type MyEnterpriseQueryHookResult = ReturnType<
  typeof useMyEnterpriseQuery
>;
export type MyEnterpriseLazyQueryHookResult = ReturnType<
  typeof useMyEnterpriseLazyQuery
>;
export type MyEnterpriseSuspenseQueryHookResult = ReturnType<
  typeof useMyEnterpriseSuspenseQuery
>;
export type MyEnterpriseQueryResult = Apollo.QueryResult<
  MyEnterpriseQuery,
  MyEnterpriseQueryVariables
>;
