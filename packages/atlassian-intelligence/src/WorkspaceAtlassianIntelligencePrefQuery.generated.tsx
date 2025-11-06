import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const WorkspaceAtlassianIntelligencePrefDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspaceAtlassianIntelligencePref"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"enterprise"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"aiPrefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"atlassianIntelligenceEnabled"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"atlassianIntelligenceEnabled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"WorkspaceAtlassianIntelligencePref","document":WorkspaceAtlassianIntelligencePrefDocument}} as const;
export type WorkspaceAtlassianIntelligencePrefQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID']['input'];
}>;


export type WorkspaceAtlassianIntelligencePrefQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
    & {
      enterprise?: Types.Maybe<(
        { __typename: 'Enterprise' }
        & Pick<Types.Enterprise, 'id'>
        & { aiPrefs?: Types.Maybe<(
          { __typename: 'Enterprise_AI_Prefs' }
          & Pick<Types.Enterprise_Ai_Prefs, 'atlassianIntelligenceEnabled'>
        )> }
      )>,
      organization?: Types.Maybe<(
        { __typename: 'Organization' }
        & Pick<Types.Organization, 'id' | 'premiumFeatures'>
        & { prefs: (
          { __typename: 'Organization_Prefs' }
          & Pick<Types.Organization_Prefs, 'atlassianIntelligenceEnabled'>
        ) }
      )>,
    }
  )> }
);

/**
 * __useWorkspaceAtlassianIntelligencePrefQuery__
 *
 * To run a query within a React component, call `useWorkspaceAtlassianIntelligencePrefQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceAtlassianIntelligencePrefQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceAtlassianIntelligencePrefQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useWorkspaceAtlassianIntelligencePrefQuery(
  baseOptions: TrelloQueryHookOptions<
    WorkspaceAtlassianIntelligencePrefQuery,
    WorkspaceAtlassianIntelligencePrefQueryVariables
  > &
    (
      | {
          variables: WorkspaceAtlassianIntelligencePrefQueryVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: WorkspaceAtlassianIntelligencePrefDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    WorkspaceAtlassianIntelligencePrefQuery,
    WorkspaceAtlassianIntelligencePrefQueryVariables
  >(WorkspaceAtlassianIntelligencePrefDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useWorkspaceAtlassianIntelligencePrefLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    WorkspaceAtlassianIntelligencePrefQuery,
    WorkspaceAtlassianIntelligencePrefQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    WorkspaceAtlassianIntelligencePrefQuery,
    WorkspaceAtlassianIntelligencePrefQueryVariables
  >(WorkspaceAtlassianIntelligencePrefDocument, options);
}
export function useWorkspaceAtlassianIntelligencePrefSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        WorkspaceAtlassianIntelligencePrefQuery,
        WorkspaceAtlassianIntelligencePrefQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    WorkspaceAtlassianIntelligencePrefQuery,
    WorkspaceAtlassianIntelligencePrefQueryVariables
  >(WorkspaceAtlassianIntelligencePrefDocument, options);
}
export type WorkspaceAtlassianIntelligencePrefQueryHookResult = ReturnType<
  typeof useWorkspaceAtlassianIntelligencePrefQuery
>;
export type WorkspaceAtlassianIntelligencePrefLazyQueryHookResult = ReturnType<
  typeof useWorkspaceAtlassianIntelligencePrefLazyQuery
>;
export type WorkspaceAtlassianIntelligencePrefSuspenseQueryHookResult =
  ReturnType<typeof useWorkspaceAtlassianIntelligencePrefSuspenseQuery>;
export type WorkspaceAtlassianIntelligencePrefQueryResult = Apollo.QueryResult<
  WorkspaceAtlassianIntelligencePrefQuery,
  WorkspaceAtlassianIntelligencePrefQueryVariables
>;
