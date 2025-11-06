import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const UpgradePromptOrganizationDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UpgradePromptOrganizationData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idEntitlement"}},{"kind":"Field","name":{"kind":"Name","value":"offering"}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"UpgradePromptOrganizationData","document":UpgradePromptOrganizationDataDocument}} as const;
export type UpgradePromptOrganizationDataQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID']['input'];
}>;


export type UpgradePromptOrganizationDataQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<
      Types.Organization,
      | 'id'
      | 'idEntitlement'
      | 'offering'
      | 'premiumFeatures'
    >
  )> }
);

/**
 * __useUpgradePromptOrganizationDataQuery__
 *
 * To run a query within a React component, call `useUpgradePromptOrganizationDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useUpgradePromptOrganizationDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUpgradePromptOrganizationDataQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useUpgradePromptOrganizationDataQuery(
  baseOptions: TrelloQueryHookOptions<
    UpgradePromptOrganizationDataQuery,
    UpgradePromptOrganizationDataQueryVariables
  > &
    (
      | {
          variables: UpgradePromptOrganizationDataQueryVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: UpgradePromptOrganizationDataDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    UpgradePromptOrganizationDataQuery,
    UpgradePromptOrganizationDataQueryVariables
  >(UpgradePromptOrganizationDataDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useUpgradePromptOrganizationDataLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    UpgradePromptOrganizationDataQuery,
    UpgradePromptOrganizationDataQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    UpgradePromptOrganizationDataQuery,
    UpgradePromptOrganizationDataQueryVariables
  >(UpgradePromptOrganizationDataDocument, options);
}
export function useUpgradePromptOrganizationDataSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        UpgradePromptOrganizationDataQuery,
        UpgradePromptOrganizationDataQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    UpgradePromptOrganizationDataQuery,
    UpgradePromptOrganizationDataQueryVariables
  >(UpgradePromptOrganizationDataDocument, options);
}
export type UpgradePromptOrganizationDataQueryHookResult = ReturnType<
  typeof useUpgradePromptOrganizationDataQuery
>;
export type UpgradePromptOrganizationDataLazyQueryHookResult = ReturnType<
  typeof useUpgradePromptOrganizationDataLazyQuery
>;
export type UpgradePromptOrganizationDataSuspenseQueryHookResult = ReturnType<
  typeof useUpgradePromptOrganizationDataSuspenseQuery
>;
export type UpgradePromptOrganizationDataQueryResult = Apollo.QueryResult<
  UpgradePromptOrganizationDataQuery,
  UpgradePromptOrganizationDataQueryVariables
>;
