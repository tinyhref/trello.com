import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const DesktopStarredBoardsListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DesktopStarredBoardsList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardIds"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"DesktopStarredBoardsList","document":DesktopStarredBoardsListDocument}} as const;
export type DesktopStarredBoardsListQueryVariables = Types.Exact<{
  boardIds: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
}>;


export type DesktopStarredBoardsListQuery = (
  { __typename: 'Query' }
  & { boards: Array<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id' | 'name' | 'url'>
    & { prefs?: Types.Maybe<(
      { __typename: 'Board_Prefs' }
      & Pick<Types.Board_Prefs, 'backgroundColor' | 'backgroundImage'>
    )> }
  )> }
);

/**
 * __useDesktopStarredBoardsListQuery__
 *
 * To run a query within a React component, call `useDesktopStarredBoardsListQuery` and pass it any options that fit your needs.
 * When your component renders, `useDesktopStarredBoardsListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDesktopStarredBoardsListQuery({
 *   variables: {
 *      boardIds: // value for 'boardIds'
 *   },
 * });
 */
export function useDesktopStarredBoardsListQuery(
  baseOptions: TrelloQueryHookOptions<
    DesktopStarredBoardsListQuery,
    DesktopStarredBoardsListQueryVariables
  > &
    (
      | { variables: DesktopStarredBoardsListQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: DesktopStarredBoardsListDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    DesktopStarredBoardsListQuery,
    DesktopStarredBoardsListQueryVariables
  >(DesktopStarredBoardsListDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useDesktopStarredBoardsListLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    DesktopStarredBoardsListQuery,
    DesktopStarredBoardsListQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    DesktopStarredBoardsListQuery,
    DesktopStarredBoardsListQueryVariables
  >(DesktopStarredBoardsListDocument, options);
}
export function useDesktopStarredBoardsListSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        DesktopStarredBoardsListQuery,
        DesktopStarredBoardsListQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    DesktopStarredBoardsListQuery,
    DesktopStarredBoardsListQueryVariables
  >(DesktopStarredBoardsListDocument, options);
}
export type DesktopStarredBoardsListQueryHookResult = ReturnType<
  typeof useDesktopStarredBoardsListQuery
>;
export type DesktopStarredBoardsListLazyQueryHookResult = ReturnType<
  typeof useDesktopStarredBoardsListLazyQuery
>;
export type DesktopStarredBoardsListSuspenseQueryHookResult = ReturnType<
  typeof useDesktopStarredBoardsListSuspenseQuery
>;
export type DesktopStarredBoardsListQueryResult = Apollo.QueryResult<
  DesktopStarredBoardsListQuery,
  DesktopStarredBoardsListQueryVariables
>;
