import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const BoardAccessRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardAccessRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accessRequests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idMemberRequestor"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"BoardAccessRequests","document":BoardAccessRequestsDocument}} as const;
export type BoardAccessRequestsQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID']['input'];
}>;


export type BoardAccessRequestsQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
    & { accessRequests?: Types.Maybe<Array<(
      { __typename: 'AccessRequestItem' }
      & Pick<
        Types.AccessRequestItem,
        | 'id'
        | 'idMemberRequestor'
        | 'signature'
        | 'timestamp'
      >
    )>> }
  )> }
);

/**
 * __useBoardAccessRequestsQuery__
 *
 * To run a query within a React component, call `useBoardAccessRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardAccessRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardAccessRequestsQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useBoardAccessRequestsQuery(
  baseOptions: TrelloQueryHookOptions<
    BoardAccessRequestsQuery,
    BoardAccessRequestsQueryVariables
  > &
    (
      | { variables: BoardAccessRequestsQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: BoardAccessRequestsDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    BoardAccessRequestsQuery,
    BoardAccessRequestsQueryVariables
  >(BoardAccessRequestsDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useBoardAccessRequestsLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    BoardAccessRequestsQuery,
    BoardAccessRequestsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    BoardAccessRequestsQuery,
    BoardAccessRequestsQueryVariables
  >(BoardAccessRequestsDocument, options);
}
export function useBoardAccessRequestsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        BoardAccessRequestsQuery,
        BoardAccessRequestsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    BoardAccessRequestsQuery,
    BoardAccessRequestsQueryVariables
  >(BoardAccessRequestsDocument, options);
}
export type BoardAccessRequestsQueryHookResult = ReturnType<
  typeof useBoardAccessRequestsQuery
>;
export type BoardAccessRequestsLazyQueryHookResult = ReturnType<
  typeof useBoardAccessRequestsLazyQuery
>;
export type BoardAccessRequestsSuspenseQueryHookResult = ReturnType<
  typeof useBoardAccessRequestsSuspenseQuery
>;
export type BoardAccessRequestsQueryResult = Apollo.QueryResult<
  BoardAccessRequestsQuery,
  BoardAccessRequestsQueryVariables
>;
