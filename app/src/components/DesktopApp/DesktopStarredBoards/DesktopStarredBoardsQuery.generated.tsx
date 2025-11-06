import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const DesktopStarredBoardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DesktopStarredBoards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"boardStars"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"DesktopStarredBoards","document":DesktopStarredBoardsDocument}} as const;
export type DesktopStarredBoardsQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID']['input'];
}>;


export type DesktopStarredBoardsQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id'>
    & { boardStars: Array<(
      { __typename: 'BoardStar' }
      & Pick<Types.BoardStar, 'id' | 'idBoard' | 'pos'>
    )> }
  )> }
);

/**
 * __useDesktopStarredBoardsQuery__
 *
 * To run a query within a React component, call `useDesktopStarredBoardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDesktopStarredBoardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDesktopStarredBoardsQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useDesktopStarredBoardsQuery(
  baseOptions: TrelloQueryHookOptions<
    DesktopStarredBoardsQuery,
    DesktopStarredBoardsQueryVariables
  > &
    (
      | { variables: DesktopStarredBoardsQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: DesktopStarredBoardsDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    DesktopStarredBoardsQuery,
    DesktopStarredBoardsQueryVariables
  >(DesktopStarredBoardsDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useDesktopStarredBoardsLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    DesktopStarredBoardsQuery,
    DesktopStarredBoardsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    DesktopStarredBoardsQuery,
    DesktopStarredBoardsQueryVariables
  >(DesktopStarredBoardsDocument, options);
}
export function useDesktopStarredBoardsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        DesktopStarredBoardsQuery,
        DesktopStarredBoardsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    DesktopStarredBoardsQuery,
    DesktopStarredBoardsQueryVariables
  >(DesktopStarredBoardsDocument, options);
}
export type DesktopStarredBoardsQueryHookResult = ReturnType<
  typeof useDesktopStarredBoardsQuery
>;
export type DesktopStarredBoardsLazyQueryHookResult = ReturnType<
  typeof useDesktopStarredBoardsLazyQuery
>;
export type DesktopStarredBoardsSuspenseQueryHookResult = ReturnType<
  typeof useDesktopStarredBoardsSuspenseQuery
>;
export type DesktopStarredBoardsQueryResult = Apollo.QueryResult<
  DesktopStarredBoardsQuery,
  DesktopStarredBoardsQueryVariables
>;
