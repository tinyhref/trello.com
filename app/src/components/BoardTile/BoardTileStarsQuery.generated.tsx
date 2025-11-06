import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const BoardTileStarsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardTileStars"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"starred"}}]}},{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"boardStars"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"BoardTileStars","document":BoardTileStarsDocument}} as const;
export type BoardTileStarsQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID']['input'];
  memberId: Types.Scalars['ID']['input'];
}>;


export type BoardTileStarsQuery = (
  { __typename: 'Query' }
  & {
    board?: Types.Maybe<(
      { __typename: 'Board' }
      & Pick<Types.Board, 'id' | 'starred'>
    )>,
    member?: Types.Maybe<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'id'>
      & { boardStars: Array<(
        { __typename: 'BoardStar' }
        & Pick<Types.BoardStar, 'id' | 'idBoard' | 'pos'>
      )> }
    )>,
  }
);

/**
 * __useBoardTileStarsQuery__
 *
 * To run a query within a React component, call `useBoardTileStarsQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardTileStarsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardTileStarsQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useBoardTileStarsQuery(
  baseOptions: TrelloQueryHookOptions<
    BoardTileStarsQuery,
    BoardTileStarsQueryVariables
  > &
    (
      | { variables: BoardTileStarsQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: BoardTileStarsDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    BoardTileStarsQuery,
    BoardTileStarsQueryVariables
  >(BoardTileStarsDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useBoardTileStarsLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    BoardTileStarsQuery,
    BoardTileStarsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<BoardTileStarsQuery, BoardTileStarsQueryVariables>(
    BoardTileStarsDocument,
    options,
  );
}
export function useBoardTileStarsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        BoardTileStarsQuery,
        BoardTileStarsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    BoardTileStarsQuery,
    BoardTileStarsQueryVariables
  >(BoardTileStarsDocument, options);
}
export type BoardTileStarsQueryHookResult = ReturnType<
  typeof useBoardTileStarsQuery
>;
export type BoardTileStarsLazyQueryHookResult = ReturnType<
  typeof useBoardTileStarsLazyQuery
>;
export type BoardTileStarsSuspenseQueryHookResult = ReturnType<
  typeof useBoardTileStarsSuspenseQuery
>;
export type BoardTileStarsQueryResult = Apollo.QueryResult<
  BoardTileStarsQuery,
  BoardTileStarsQueryVariables
>;
