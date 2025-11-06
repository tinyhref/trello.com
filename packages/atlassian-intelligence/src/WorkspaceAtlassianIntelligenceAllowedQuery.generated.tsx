import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const WorkspaceAtlassianIntelligenceAllowedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspaceAtlassianIntelligenceAllowed"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"enterprise"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"aiPrefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"atlassianIntelligenceEnabled"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"offering"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"atlassianIntelligenceEnabled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"WorkspaceAtlassianIntelligenceAllowed","document":WorkspaceAtlassianIntelligenceAllowedDocument}} as const;
export type WorkspaceAtlassianIntelligenceAllowedQueryVariables = Types.Exact<{
  workspaceId: Types.Scalars['ID']['input'];
}>;


export type WorkspaceAtlassianIntelligenceAllowedQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id' | 'offering' | 'premiumFeatures'>
    & {
      enterprise?: Types.Maybe<(
        { __typename: 'Enterprise' }
        & Pick<Types.Enterprise, 'id'>
        & { aiPrefs?: Types.Maybe<(
          { __typename: 'Enterprise_AI_Prefs' }
          & Pick<Types.Enterprise_Ai_Prefs, 'atlassianIntelligenceEnabled'>
        )> }
      )>,
      prefs: (
        { __typename: 'Organization_Prefs' }
        & Pick<Types.Organization_Prefs, 'atlassianIntelligenceEnabled'>
      ),
    }
  )> }
);

/**
 * __useWorkspaceAtlassianIntelligenceAllowedQuery__
 *
 * To run a query within a React component, call `useWorkspaceAtlassianIntelligenceAllowedQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceAtlassianIntelligenceAllowedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceAtlassianIntelligenceAllowedQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useWorkspaceAtlassianIntelligenceAllowedQuery(
  baseOptions: TrelloQueryHookOptions<
    WorkspaceAtlassianIntelligenceAllowedQuery,
    WorkspaceAtlassianIntelligenceAllowedQueryVariables
  > &
    (
      | {
          variables: WorkspaceAtlassianIntelligenceAllowedQueryVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: WorkspaceAtlassianIntelligenceAllowedDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    WorkspaceAtlassianIntelligenceAllowedQuery,
    WorkspaceAtlassianIntelligenceAllowedQueryVariables
  >(WorkspaceAtlassianIntelligenceAllowedDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useWorkspaceAtlassianIntelligenceAllowedLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    WorkspaceAtlassianIntelligenceAllowedQuery,
    WorkspaceAtlassianIntelligenceAllowedQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    WorkspaceAtlassianIntelligenceAllowedQuery,
    WorkspaceAtlassianIntelligenceAllowedQueryVariables
  >(WorkspaceAtlassianIntelligenceAllowedDocument, options);
}
export function useWorkspaceAtlassianIntelligenceAllowedSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        WorkspaceAtlassianIntelligenceAllowedQuery,
        WorkspaceAtlassianIntelligenceAllowedQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    WorkspaceAtlassianIntelligenceAllowedQuery,
    WorkspaceAtlassianIntelligenceAllowedQueryVariables
  >(WorkspaceAtlassianIntelligenceAllowedDocument, options);
}
export type WorkspaceAtlassianIntelligenceAllowedQueryHookResult = ReturnType<
  typeof useWorkspaceAtlassianIntelligenceAllowedQuery
>;
export type WorkspaceAtlassianIntelligenceAllowedLazyQueryHookResult =
  ReturnType<typeof useWorkspaceAtlassianIntelligenceAllowedLazyQuery>;
export type WorkspaceAtlassianIntelligenceAllowedSuspenseQueryHookResult =
  ReturnType<typeof useWorkspaceAtlassianIntelligenceAllowedSuspenseQuery>;
export type WorkspaceAtlassianIntelligenceAllowedQueryResult =
  Apollo.QueryResult<
    WorkspaceAtlassianIntelligenceAllowedQuery,
    WorkspaceAtlassianIntelligenceAllowedQueryVariables
  >;
