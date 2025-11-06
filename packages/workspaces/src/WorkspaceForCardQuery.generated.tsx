import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const WorkspaceForCardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WorkspaceForCard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"board"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"WorkspaceForCard","document":WorkspaceForCardDocument}} as const;
export type WorkspaceForCardQueryVariables = Types.Exact<{
  idCard: Types.Scalars['ID']['input'];
}>;


export type WorkspaceForCardQuery = (
  { __typename: 'Query' }
  & { card?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id'>
    & { board: (
      { __typename: 'Board' }
      & Pick<Types.Board, 'id' | 'idOrganization'>
    ) }
  )> }
);

/**
 * __useWorkspaceForCardQuery__
 *
 * To run a query within a React component, call `useWorkspaceForCardQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceForCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceForCardQuery({
 *   variables: {
 *      idCard: // value for 'idCard'
 *   },
 * });
 */
export function useWorkspaceForCardQuery(
  baseOptions: TrelloQueryHookOptions<
    WorkspaceForCardQuery,
    WorkspaceForCardQueryVariables
  > &
    (
      | { variables: WorkspaceForCardQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: WorkspaceForCardDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    WorkspaceForCardQuery,
    WorkspaceForCardQueryVariables
  >(WorkspaceForCardDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useWorkspaceForCardLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    WorkspaceForCardQuery,
    WorkspaceForCardQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    WorkspaceForCardQuery,
    WorkspaceForCardQueryVariables
  >(WorkspaceForCardDocument, options);
}
export function useWorkspaceForCardSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        WorkspaceForCardQuery,
        WorkspaceForCardQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    WorkspaceForCardQuery,
    WorkspaceForCardQueryVariables
  >(WorkspaceForCardDocument, options);
}
export type WorkspaceForCardQueryHookResult = ReturnType<
  typeof useWorkspaceForCardQuery
>;
export type WorkspaceForCardLazyQueryHookResult = ReturnType<
  typeof useWorkspaceForCardLazyQuery
>;
export type WorkspaceForCardSuspenseQueryHookResult = ReturnType<
  typeof useWorkspaceForCardSuspenseQuery
>;
export type WorkspaceForCardQueryResult = Apollo.QueryResult<
  WorkspaceForCardQuery,
  WorkspaceForCardQueryVariables
>;
