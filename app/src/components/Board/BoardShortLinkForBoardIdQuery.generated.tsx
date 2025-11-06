import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const BoardShortLinkForBoardIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardShortLinkForBoardId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"BoardShortLinkForBoardId","document":BoardShortLinkForBoardIdDocument}} as const;
export type BoardShortLinkForBoardIdQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID']['input'];
}>;


export type BoardShortLinkForBoardIdQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
  )> }
);

/**
 * __useBoardShortLinkForBoardIdQuery__
 *
 * To run a query within a React component, call `useBoardShortLinkForBoardIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardShortLinkForBoardIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardShortLinkForBoardIdQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useBoardShortLinkForBoardIdQuery(
  baseOptions: TrelloQueryHookOptions<
    BoardShortLinkForBoardIdQuery,
    BoardShortLinkForBoardIdQueryVariables
  > &
    (
      | { variables: BoardShortLinkForBoardIdQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: BoardShortLinkForBoardIdDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    BoardShortLinkForBoardIdQuery,
    BoardShortLinkForBoardIdQueryVariables
  >(BoardShortLinkForBoardIdDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useBoardShortLinkForBoardIdLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    BoardShortLinkForBoardIdQuery,
    BoardShortLinkForBoardIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    BoardShortLinkForBoardIdQuery,
    BoardShortLinkForBoardIdQueryVariables
  >(BoardShortLinkForBoardIdDocument, options);
}
export function useBoardShortLinkForBoardIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        BoardShortLinkForBoardIdQuery,
        BoardShortLinkForBoardIdQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    BoardShortLinkForBoardIdQuery,
    BoardShortLinkForBoardIdQueryVariables
  >(BoardShortLinkForBoardIdDocument, options);
}
export type BoardShortLinkForBoardIdQueryHookResult = ReturnType<
  typeof useBoardShortLinkForBoardIdQuery
>;
export type BoardShortLinkForBoardIdLazyQueryHookResult = ReturnType<
  typeof useBoardShortLinkForBoardIdLazyQuery
>;
export type BoardShortLinkForBoardIdSuspenseQueryHookResult = ReturnType<
  typeof useBoardShortLinkForBoardIdSuspenseQuery
>;
export type BoardShortLinkForBoardIdQueryResult = Apollo.QueryResult<
  BoardShortLinkForBoardIdQuery,
  BoardShortLinkForBoardIdQueryVariables
>;
