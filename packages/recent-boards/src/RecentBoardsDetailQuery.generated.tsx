import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const RecentBoardsDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RecentBoardsDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoards"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoards"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"dateLastActivity"}},{"kind":"Field","name":{"kind":"Name","value":"dateLastView"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nodeId"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImage"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backgroundTile"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"RecentBoardsDetail","document":RecentBoardsDetailDocument}} as const;
export type RecentBoardsDetailQueryVariables = Types.Exact<{
  idBoards: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
}>;


export type RecentBoardsDetailQuery = (
  { __typename: 'Query' }
  & { boards: Array<(
    { __typename: 'Board' }
    & Pick<
      Types.Board,
      | 'id'
      | 'closed'
      | 'dateLastActivity'
      | 'dateLastView'
      | 'idOrganization'
      | 'name'
      | 'nodeId'
      | 'shortLink'
    >
    & {
      organization?: Types.Maybe<(
        { __typename: 'Organization' }
        & Pick<Types.Organization, 'id' | 'displayName'>
      )>,
      prefs?: Types.Maybe<(
        { __typename: 'Board_Prefs' }
        & Pick<
          Types.Board_Prefs,
          | 'background'
          | 'backgroundColor'
          | 'backgroundImage'
          | 'backgroundTile'
          | 'isTemplate'
        >
        & { backgroundImageScaled?: Types.Maybe<Array<(
          { __typename: 'Board_Prefs_BackgroundImageScaled' }
          & Pick<Types.Board_Prefs_BackgroundImageScaled, 'height' | 'url' | 'width'>
        )>> }
      )>,
    }
  )> }
);

/**
 * __useRecentBoardsDetailQuery__
 *
 * To run a query within a React component, call `useRecentBoardsDetailQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecentBoardsDetailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecentBoardsDetailQuery({
 *   variables: {
 *      idBoards: // value for 'idBoards'
 *   },
 * });
 */
export function useRecentBoardsDetailQuery(
  baseOptions: TrelloQueryHookOptions<
    RecentBoardsDetailQuery,
    RecentBoardsDetailQueryVariables
  > &
    (
      | { variables: RecentBoardsDetailQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: RecentBoardsDetailDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    RecentBoardsDetailQuery,
    RecentBoardsDetailQueryVariables
  >(RecentBoardsDetailDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useRecentBoardsDetailLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    RecentBoardsDetailQuery,
    RecentBoardsDetailQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    RecentBoardsDetailQuery,
    RecentBoardsDetailQueryVariables
  >(RecentBoardsDetailDocument, options);
}
export function useRecentBoardsDetailSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        RecentBoardsDetailQuery,
        RecentBoardsDetailQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    RecentBoardsDetailQuery,
    RecentBoardsDetailQueryVariables
  >(RecentBoardsDetailDocument, options);
}
export type RecentBoardsDetailQueryHookResult = ReturnType<
  typeof useRecentBoardsDetailQuery
>;
export type RecentBoardsDetailLazyQueryHookResult = ReturnType<
  typeof useRecentBoardsDetailLazyQuery
>;
export type RecentBoardsDetailSuspenseQueryHookResult = ReturnType<
  typeof useRecentBoardsDetailSuspenseQuery
>;
export type RecentBoardsDetailQueryResult = Apollo.QueryResult<
  RecentBoardsDetailQuery,
  RecentBoardsDetailQueryVariables
>;
