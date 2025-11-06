import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const MemberEnterprisesWithAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MemberEnterprisesWithAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"confirmed"}},{"kind":"Field","name":{"kind":"Name","value":"enterprises"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"saml"},{"kind":"EnumValue","value":"member"},{"kind":"EnumValue","value":"memberUnconfirmed"}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sandbox"}}]}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprisesAdmin"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"MemberEnterprisesWithAdmin","document":MemberEnterprisesWithAdminDocument}} as const;
export type MemberEnterprisesWithAdminQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID']['input'];
}>;


export type MemberEnterprisesWithAdminQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'confirmed' | 'idEnterprisesAdmin'>
    & { enterprises: Array<(
      { __typename: 'Enterprise' }
      & Pick<Types.Enterprise, 'id' | 'sandbox'>
    )> }
  )> }
);

/**
 * __useMemberEnterprisesWithAdminQuery__
 *
 * To run a query within a React component, call `useMemberEnterprisesWithAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useMemberEnterprisesWithAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMemberEnterprisesWithAdminQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useMemberEnterprisesWithAdminQuery(
  baseOptions: TrelloQueryHookOptions<
    MemberEnterprisesWithAdminQuery,
    MemberEnterprisesWithAdminQueryVariables
  > &
    (
      | { variables: MemberEnterprisesWithAdminQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: MemberEnterprisesWithAdminDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    MemberEnterprisesWithAdminQuery,
    MemberEnterprisesWithAdminQueryVariables
  >(MemberEnterprisesWithAdminDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useMemberEnterprisesWithAdminLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    MemberEnterprisesWithAdminQuery,
    MemberEnterprisesWithAdminQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    MemberEnterprisesWithAdminQuery,
    MemberEnterprisesWithAdminQueryVariables
  >(MemberEnterprisesWithAdminDocument, options);
}
export function useMemberEnterprisesWithAdminSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        MemberEnterprisesWithAdminQuery,
        MemberEnterprisesWithAdminQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    MemberEnterprisesWithAdminQuery,
    MemberEnterprisesWithAdminQueryVariables
  >(MemberEnterprisesWithAdminDocument, options);
}
export type MemberEnterprisesWithAdminQueryHookResult = ReturnType<
  typeof useMemberEnterprisesWithAdminQuery
>;
export type MemberEnterprisesWithAdminLazyQueryHookResult = ReturnType<
  typeof useMemberEnterprisesWithAdminLazyQuery
>;
export type MemberEnterprisesWithAdminSuspenseQueryHookResult = ReturnType<
  typeof useMemberEnterprisesWithAdminSuspenseQuery
>;
export type MemberEnterprisesWithAdminQueryResult = Apollo.QueryResult<
  MemberEnterprisesWithAdminQuery,
  MemberEnterprisesWithAdminQueryVariables
>;
