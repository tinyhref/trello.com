import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const CrossFlowProviderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CrossFlowProvider"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"enterprises"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"saml"},{"kind":"EnumValue","value":"member"},{"kind":"EnumValue","value":"memberUnconfirmed"},{"kind":"EnumValue","value":"owned"}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"idPremOrgsAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locale"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"CrossFlowProvider","document":CrossFlowProviderDocument}} as const;
export type CrossFlowProviderQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID']['input'];
}>;


export type CrossFlowProviderQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'fullName' | 'idPremOrgsAdmin'>
    & {
      enterprises: Array<(
        { __typename: 'Enterprise' }
        & Pick<Types.Enterprise, 'id' | 'displayName' | 'name'>
      )>,
      organizations: Array<(
        { __typename: 'Organization' }
        & Pick<Types.Organization, 'id' | 'displayName' | 'idEnterprise'>
      )>,
      prefs?: Types.Maybe<(
        { __typename: 'Member_Prefs' }
        & Pick<Types.Member_Prefs, 'locale'>
      )>,
    }
  )> }
);

/**
 * __useCrossFlowProviderQuery__
 *
 * To run a query within a React component, call `useCrossFlowProviderQuery` and pass it any options that fit your needs.
 * When your component renders, `useCrossFlowProviderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCrossFlowProviderQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useCrossFlowProviderQuery(
  baseOptions: TrelloQueryHookOptions<
    CrossFlowProviderQuery,
    CrossFlowProviderQueryVariables
  > &
    (
      | { variables: CrossFlowProviderQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: CrossFlowProviderDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    CrossFlowProviderQuery,
    CrossFlowProviderQueryVariables
  >(CrossFlowProviderDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useCrossFlowProviderLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    CrossFlowProviderQuery,
    CrossFlowProviderQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    CrossFlowProviderQuery,
    CrossFlowProviderQueryVariables
  >(CrossFlowProviderDocument, options);
}
export function useCrossFlowProviderSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        CrossFlowProviderQuery,
        CrossFlowProviderQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    CrossFlowProviderQuery,
    CrossFlowProviderQueryVariables
  >(CrossFlowProviderDocument, options);
}
export type CrossFlowProviderQueryHookResult = ReturnType<
  typeof useCrossFlowProviderQuery
>;
export type CrossFlowProviderLazyQueryHookResult = ReturnType<
  typeof useCrossFlowProviderLazyQuery
>;
export type CrossFlowProviderSuspenseQueryHookResult = ReturnType<
  typeof useCrossFlowProviderSuspenseQuery
>;
export type CrossFlowProviderQueryResult = Apollo.QueryResult<
  CrossFlowProviderQuery,
  CrossFlowProviderQueryVariables
>;
