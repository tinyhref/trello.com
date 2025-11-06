import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const AtlassianAccountMigrationStageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AtlassianAccountMigrationStage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"confirmed"}},{"kind":"Field","name":{"kind":"Name","value":"isAaMastered"}},{"kind":"Field","name":{"kind":"Name","value":"requiresAaOnboarding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"template"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"AtlassianAccountMigrationStage","document":AtlassianAccountMigrationStageDocument}} as const;
export type AtlassianAccountMigrationStageQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID']['input'];
}>;


export type AtlassianAccountMigrationStageQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'confirmed' | 'isAaMastered'>
    & { requiresAaOnboarding?: Types.Maybe<(
      { __typename: 'RequiresAaOnboarding' }
      & Pick<Types.RequiresAaOnboarding, 'template'>
    )> }
  )> }
);

/**
 * __useAtlassianAccountMigrationStageQuery__
 *
 * To run a query within a React component, call `useAtlassianAccountMigrationStageQuery` and pass it any options that fit your needs.
 * When your component renders, `useAtlassianAccountMigrationStageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAtlassianAccountMigrationStageQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useAtlassianAccountMigrationStageQuery(
  baseOptions: TrelloQueryHookOptions<
    AtlassianAccountMigrationStageQuery,
    AtlassianAccountMigrationStageQueryVariables
  > &
    (
      | {
          variables: AtlassianAccountMigrationStageQueryVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: AtlassianAccountMigrationStageDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    AtlassianAccountMigrationStageQuery,
    AtlassianAccountMigrationStageQueryVariables
  >(AtlassianAccountMigrationStageDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useAtlassianAccountMigrationStageLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    AtlassianAccountMigrationStageQuery,
    AtlassianAccountMigrationStageQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    AtlassianAccountMigrationStageQuery,
    AtlassianAccountMigrationStageQueryVariables
  >(AtlassianAccountMigrationStageDocument, options);
}
export function useAtlassianAccountMigrationStageSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        AtlassianAccountMigrationStageQuery,
        AtlassianAccountMigrationStageQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    AtlassianAccountMigrationStageQuery,
    AtlassianAccountMigrationStageQueryVariables
  >(AtlassianAccountMigrationStageDocument, options);
}
export type AtlassianAccountMigrationStageQueryHookResult = ReturnType<
  typeof useAtlassianAccountMigrationStageQuery
>;
export type AtlassianAccountMigrationStageLazyQueryHookResult = ReturnType<
  typeof useAtlassianAccountMigrationStageLazyQuery
>;
export type AtlassianAccountMigrationStageSuspenseQueryHookResult = ReturnType<
  typeof useAtlassianAccountMigrationStageSuspenseQuery
>;
export type AtlassianAccountMigrationStageQueryResult = Apollo.QueryResult<
  AtlassianAccountMigrationStageQuery,
  AtlassianAccountMigrationStageQueryVariables
>;
