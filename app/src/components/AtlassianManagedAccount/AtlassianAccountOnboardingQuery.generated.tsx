import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const AtlassianAccountOnboardingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AtlassianAccountOnboarding"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idBoards"}},{"kind":"Field","name":{"kind":"Name","value":"requiresAaOnboarding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enterprise"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"template"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"AtlassianAccountOnboarding","document":AtlassianAccountOnboardingDocument}} as const;
export type AtlassianAccountOnboardingQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID']['input'];
}>;


export type AtlassianAccountOnboardingQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'idBoards'>
    & { requiresAaOnboarding?: Types.Maybe<(
      { __typename: 'RequiresAaOnboarding' }
      & Pick<Types.RequiresAaOnboarding, 'template'>
      & {
        enterprise?: Types.Maybe<(
          { __typename: 'Enterprise' }
          & Pick<Types.Enterprise, 'id' | 'displayName'>
        )>,
        profile?: Types.Maybe<(
          { __typename: 'AaOnboardingProfile' }
          & Pick<Types.AaOnboardingProfile, 'avatarUrl' | 'fullName'>
        )>,
      }
    )> }
  )> }
);

/**
 * __useAtlassianAccountOnboardingQuery__
 *
 * To run a query within a React component, call `useAtlassianAccountOnboardingQuery` and pass it any options that fit your needs.
 * When your component renders, `useAtlassianAccountOnboardingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAtlassianAccountOnboardingQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useAtlassianAccountOnboardingQuery(
  baseOptions: TrelloQueryHookOptions<
    AtlassianAccountOnboardingQuery,
    AtlassianAccountOnboardingQueryVariables
  > &
    (
      | { variables: AtlassianAccountOnboardingQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: AtlassianAccountOnboardingDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    AtlassianAccountOnboardingQuery,
    AtlassianAccountOnboardingQueryVariables
  >(AtlassianAccountOnboardingDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useAtlassianAccountOnboardingLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    AtlassianAccountOnboardingQuery,
    AtlassianAccountOnboardingQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    AtlassianAccountOnboardingQuery,
    AtlassianAccountOnboardingQueryVariables
  >(AtlassianAccountOnboardingDocument, options);
}
export function useAtlassianAccountOnboardingSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        AtlassianAccountOnboardingQuery,
        AtlassianAccountOnboardingQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    AtlassianAccountOnboardingQuery,
    AtlassianAccountOnboardingQueryVariables
  >(AtlassianAccountOnboardingDocument, options);
}
export type AtlassianAccountOnboardingQueryHookResult = ReturnType<
  typeof useAtlassianAccountOnboardingQuery
>;
export type AtlassianAccountOnboardingLazyQueryHookResult = ReturnType<
  typeof useAtlassianAccountOnboardingLazyQuery
>;
export type AtlassianAccountOnboardingSuspenseQueryHookResult = ReturnType<
  typeof useAtlassianAccountOnboardingSuspenseQuery
>;
export type AtlassianAccountOnboardingQueryResult = Apollo.QueryResult<
  AtlassianAccountOnboardingQuery,
  AtlassianAccountOnboardingQueryVariables
>;
