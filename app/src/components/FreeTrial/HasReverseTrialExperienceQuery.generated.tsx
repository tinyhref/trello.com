import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const HasReverseTrialExperienceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HasReverseTrialExperience"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"credits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"via"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"HasReverseTrialExperience","document":HasReverseTrialExperienceDocument}} as const;
export type HasReverseTrialExperienceQueryVariables = Types.Exact<{
  workspaceId: Types.Scalars['ID']['input'];
}>;


export type HasReverseTrialExperienceQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id'>
    & { credits: Array<(
      { __typename: 'Credit' }
      & Pick<Types.Credit, 'id' | 'type' | 'via'>
    )> }
  )> }
);

/**
 * __useHasReverseTrialExperienceQuery__
 *
 * To run a query within a React component, call `useHasReverseTrialExperienceQuery` and pass it any options that fit your needs.
 * When your component renders, `useHasReverseTrialExperienceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHasReverseTrialExperienceQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useHasReverseTrialExperienceQuery(
  baseOptions: TrelloQueryHookOptions<
    HasReverseTrialExperienceQuery,
    HasReverseTrialExperienceQueryVariables
  > &
    (
      | { variables: HasReverseTrialExperienceQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: HasReverseTrialExperienceDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    HasReverseTrialExperienceQuery,
    HasReverseTrialExperienceQueryVariables
  >(HasReverseTrialExperienceDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useHasReverseTrialExperienceLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    HasReverseTrialExperienceQuery,
    HasReverseTrialExperienceQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    HasReverseTrialExperienceQuery,
    HasReverseTrialExperienceQueryVariables
  >(HasReverseTrialExperienceDocument, options);
}
export function useHasReverseTrialExperienceSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        HasReverseTrialExperienceQuery,
        HasReverseTrialExperienceQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    HasReverseTrialExperienceQuery,
    HasReverseTrialExperienceQueryVariables
  >(HasReverseTrialExperienceDocument, options);
}
export type HasReverseTrialExperienceQueryHookResult = ReturnType<
  typeof useHasReverseTrialExperienceQuery
>;
export type HasReverseTrialExperienceLazyQueryHookResult = ReturnType<
  typeof useHasReverseTrialExperienceLazyQuery
>;
export type HasReverseTrialExperienceSuspenseQueryHookResult = ReturnType<
  typeof useHasReverseTrialExperienceSuspenseQuery
>;
export type HasReverseTrialExperienceQueryResult = Apollo.QueryResult<
  HasReverseTrialExperienceQuery,
  HasReverseTrialExperienceQueryVariables
>;
