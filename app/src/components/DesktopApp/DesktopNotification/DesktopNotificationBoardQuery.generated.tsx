import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const DesktopNotificationBoardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DesktopNotificationBoard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"DesktopNotificationBoard","document":DesktopNotificationBoardDocument}} as const;
export type DesktopNotificationBoardQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type DesktopNotificationBoardQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id' | 'url'>
  )> }
);

/**
 * __useDesktopNotificationBoardQuery__
 *
 * To run a query within a React component, call `useDesktopNotificationBoardQuery` and pass it any options that fit your needs.
 * When your component renders, `useDesktopNotificationBoardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDesktopNotificationBoardQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDesktopNotificationBoardQuery(
  baseOptions: TrelloQueryHookOptions<
    DesktopNotificationBoardQuery,
    DesktopNotificationBoardQueryVariables
  > &
    (
      | { variables: DesktopNotificationBoardQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: DesktopNotificationBoardDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    DesktopNotificationBoardQuery,
    DesktopNotificationBoardQueryVariables
  >(DesktopNotificationBoardDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useDesktopNotificationBoardLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    DesktopNotificationBoardQuery,
    DesktopNotificationBoardQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    DesktopNotificationBoardQuery,
    DesktopNotificationBoardQueryVariables
  >(DesktopNotificationBoardDocument, options);
}
export function useDesktopNotificationBoardSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        DesktopNotificationBoardQuery,
        DesktopNotificationBoardQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    DesktopNotificationBoardQuery,
    DesktopNotificationBoardQueryVariables
  >(DesktopNotificationBoardDocument, options);
}
export type DesktopNotificationBoardQueryHookResult = ReturnType<
  typeof useDesktopNotificationBoardQuery
>;
export type DesktopNotificationBoardLazyQueryHookResult = ReturnType<
  typeof useDesktopNotificationBoardLazyQuery
>;
export type DesktopNotificationBoardSuspenseQueryHookResult = ReturnType<
  typeof useDesktopNotificationBoardSuspenseQuery
>;
export type DesktopNotificationBoardQueryResult = Apollo.QueryResult<
  DesktopNotificationBoardQuery,
  DesktopNotificationBoardQueryVariables
>;
