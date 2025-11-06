import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const OrganizationBillingPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrganizationBillingPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"credits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"applied"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"countType"}},{"kind":"Field","name":{"kind":"Name","value":"idMemberInvited"}},{"kind":"Field","name":{"kind":"Name","value":"idModel"}},{"kind":"Field","name":{"kind":"Name","value":"modelType"}},{"kind":"Field","name":{"kind":"Name","value":"reward"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"via"}}]}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"enterprise"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"idAdmins"}},{"kind":"Field","name":{"kind":"Name","value":"logoHash"}}]}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"active"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deactivated"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"unconfirmed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"offering"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"OrganizationBillingPage","document":OrganizationBillingPageDocument}} as const;
export type OrganizationBillingPageQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type OrganizationBillingPageQuery = (
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
      | 'products'
      | 'type'
    >
    & {
      credits: Array<(
        { __typename: 'Credit' }
        & Pick<
          Types.Credit,
          | 'id'
          | 'applied'
          | 'count'
          | 'countType'
          | 'idMemberInvited'
          | 'idModel'
          | 'modelType'
          | 'reward'
          | 'type'
          | 'via'
        >
      )>,
      enterprise?: Types.Maybe<(
        { __typename: 'Enterprise' }
        & Pick<
          Types.Enterprise,
          | 'id'
          | 'displayName'
          | 'idAdmins'
          | 'logoHash'
        >
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
        & Pick<Types.Organization_Prefs, 'permissionLevel'>
      ),
    }
  )> }
);

/**
 * __useOrganizationBillingPageQuery__
 *
 * To run a query within a React component, call `useOrganizationBillingPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationBillingPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationBillingPageQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOrganizationBillingPageQuery(
  baseOptions: Apollo.QueryHookOptions<
    OrganizationBillingPageQuery,
    OrganizationBillingPageQueryVariables
  > &
    (
      | { variables: OrganizationBillingPageQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OrganizationBillingPageQuery,
    OrganizationBillingPageQueryVariables
  >(OrganizationBillingPageDocument, options);
}
export function useOrganizationBillingPageLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OrganizationBillingPageQuery,
    OrganizationBillingPageQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OrganizationBillingPageQuery,
    OrganizationBillingPageQueryVariables
  >(OrganizationBillingPageDocument, options);
}
export function useOrganizationBillingPageSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        OrganizationBillingPageQuery,
        OrganizationBillingPageQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    OrganizationBillingPageQuery,
    OrganizationBillingPageQueryVariables
  >(OrganizationBillingPageDocument, options);
}
export type OrganizationBillingPageQueryHookResult = ReturnType<
  typeof useOrganizationBillingPageQuery
>;
export type OrganizationBillingPageLazyQueryHookResult = ReturnType<
  typeof useOrganizationBillingPageLazyQuery
>;
export type OrganizationBillingPageSuspenseQueryHookResult = ReturnType<
  typeof useOrganizationBillingPageSuspenseQuery
>;
export type OrganizationBillingPageQueryResult = Apollo.QueryResult<
  OrganizationBillingPageQuery,
  OrganizationBillingPageQueryVariables
>;
