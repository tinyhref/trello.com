import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const WorkspaceForBoardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspaceForBoard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"WorkspaceForBoard","document":WorkspaceForBoardDocument}} as const;
export type WorkspaceForBoardQueryVariables = Types.Exact<{
  idBoard: Types.Scalars['ID']['input'];
}>;


export type WorkspaceForBoardQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id' | 'idOrganization'>
  )> }
);

/**
 * __useWorkspaceForBoardQuery__
 *
 * To run a query within a React component, call `useWorkspaceForBoardQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceForBoardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceForBoardQuery({
 *   variables: {
 *      idBoard: // value for 'idBoard'
 *   },
 * });
 */
export function useWorkspaceForBoardQuery(
  baseOptions: TrelloQueryHookOptions<
    WorkspaceForBoardQuery,
    WorkspaceForBoardQueryVariables
  > &
    (
      | { variables: WorkspaceForBoardQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: WorkspaceForBoardDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    WorkspaceForBoardQuery,
    WorkspaceForBoardQueryVariables
  >(WorkspaceForBoardDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useWorkspaceForBoardLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    WorkspaceForBoardQuery,
    WorkspaceForBoardQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    WorkspaceForBoardQuery,
    WorkspaceForBoardQueryVariables
  >(WorkspaceForBoardDocument, options);
}
export function useWorkspaceForBoardSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        WorkspaceForBoardQuery,
        WorkspaceForBoardQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    WorkspaceForBoardQuery,
    WorkspaceForBoardQueryVariables
  >(WorkspaceForBoardDocument, options);
}
export type WorkspaceForBoardQueryHookResult = ReturnType<
  typeof useWorkspaceForBoardQuery
>;
export type WorkspaceForBoardLazyQueryHookResult = ReturnType<
  typeof useWorkspaceForBoardLazyQuery
>;
export type WorkspaceForBoardSuspenseQueryHookResult = ReturnType<
  typeof useWorkspaceForBoardSuspenseQuery
>;
export type WorkspaceForBoardQueryResult = Apollo.QueryResult<
  WorkspaceForBoardQuery,
  WorkspaceForBoardQueryVariables
>;
