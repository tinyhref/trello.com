import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const RecentBoardsSlimDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RecentBoardsSlim"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"open"},{"kind":"EnumValue","value":"starred"}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"dateLastView"}}]}},{"kind":"Field","name":{"kind":"Name","value":"boardStars"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"RecentBoardsSlim","document":RecentBoardsSlimDocument}} as const;
export type RecentBoardsSlimQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID']['input'];
}>;


export type RecentBoardsSlimQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id'>
    & {
      boards: Array<(
        { __typename: 'Board' }
        & Pick<Types.Board, 'id' | 'closed' | 'dateLastView'>
      )>,
      boardStars: Array<(
        { __typename: 'BoardStar' }
        & Pick<Types.BoardStar, 'id' | 'idBoard' | 'pos'>
      )>,
    }
  )> }
);

/**
 * __useRecentBoardsSlimQuery__
 *
 * To run a query within a React component, call `useRecentBoardsSlimQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecentBoardsSlimQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecentBoardsSlimQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useRecentBoardsSlimQuery(
  baseOptions: TrelloQueryHookOptions<
    RecentBoardsSlimQuery,
    RecentBoardsSlimQueryVariables
  > &
    (
      | { variables: RecentBoardsSlimQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: RecentBoardsSlimDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    RecentBoardsSlimQuery,
    RecentBoardsSlimQueryVariables
  >(RecentBoardsSlimDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useRecentBoardsSlimLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    RecentBoardsSlimQuery,
    RecentBoardsSlimQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    RecentBoardsSlimQuery,
    RecentBoardsSlimQueryVariables
  >(RecentBoardsSlimDocument, options);
}
export function useRecentBoardsSlimSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        RecentBoardsSlimQuery,
        RecentBoardsSlimQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    RecentBoardsSlimQuery,
    RecentBoardsSlimQueryVariables
  >(RecentBoardsSlimDocument, options);
}
export type RecentBoardsSlimQueryHookResult = ReturnType<
  typeof useRecentBoardsSlimQuery
>;
export type RecentBoardsSlimLazyQueryHookResult = ReturnType<
  typeof useRecentBoardsSlimLazyQuery
>;
export type RecentBoardsSlimSuspenseQueryHookResult = ReturnType<
  typeof useRecentBoardsSlimSuspenseQuery
>;
export type RecentBoardsSlimQueryResult = Apollo.QueryResult<
  RecentBoardsSlimQuery,
  RecentBoardsSlimQueryVariables
>;
