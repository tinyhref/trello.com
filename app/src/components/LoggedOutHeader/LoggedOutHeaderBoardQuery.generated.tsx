import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const LoggedOutHeaderBoardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LoggedOutHeaderBoard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"shortLink"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"shortLink"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"LoggedOutHeaderBoard","document":LoggedOutHeaderBoardDocument}} as const;
export type LoggedOutHeaderBoardQueryVariables = Types.Exact<{
  shortLink: Types.Scalars['ID']['input'];
}>;


export type LoggedOutHeaderBoardQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id' | 'idOrganization'>
    & { members: Array<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'id' | 'memberType'>
    )> }
  )> }
);

/**
 * __useLoggedOutHeaderBoardQuery__
 *
 * To run a query within a React component, call `useLoggedOutHeaderBoardQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoggedOutHeaderBoardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoggedOutHeaderBoardQuery({
 *   variables: {
 *      shortLink: // value for 'shortLink'
 *   },
 * });
 */
export function useLoggedOutHeaderBoardQuery(
  baseOptions: TrelloQueryHookOptions<
    LoggedOutHeaderBoardQuery,
    LoggedOutHeaderBoardQueryVariables
  > &
    (
      | { variables: LoggedOutHeaderBoardQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: LoggedOutHeaderBoardDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    LoggedOutHeaderBoardQuery,
    LoggedOutHeaderBoardQueryVariables
  >(LoggedOutHeaderBoardDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useLoggedOutHeaderBoardLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    LoggedOutHeaderBoardQuery,
    LoggedOutHeaderBoardQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    LoggedOutHeaderBoardQuery,
    LoggedOutHeaderBoardQueryVariables
  >(LoggedOutHeaderBoardDocument, options);
}
export function useLoggedOutHeaderBoardSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        LoggedOutHeaderBoardQuery,
        LoggedOutHeaderBoardQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    LoggedOutHeaderBoardQuery,
    LoggedOutHeaderBoardQueryVariables
  >(LoggedOutHeaderBoardDocument, options);
}
export type LoggedOutHeaderBoardQueryHookResult = ReturnType<
  typeof useLoggedOutHeaderBoardQuery
>;
export type LoggedOutHeaderBoardLazyQueryHookResult = ReturnType<
  typeof useLoggedOutHeaderBoardLazyQuery
>;
export type LoggedOutHeaderBoardSuspenseQueryHookResult = ReturnType<
  typeof useLoggedOutHeaderBoardSuspenseQuery
>;
export type LoggedOutHeaderBoardQueryResult = Apollo.QueryResult<
  LoggedOutHeaderBoardQuery,
  LoggedOutHeaderBoardQueryVariables
>;
