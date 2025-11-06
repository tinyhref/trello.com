import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const DesktopNotificationCardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DesktopNotificationCard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"DesktopNotificationCard","document":DesktopNotificationCardDocument}} as const;
export type DesktopNotificationCardQueryVariables = Types.Exact<{
  idCard: Types.Scalars['ID']['input'];
}>;


export type DesktopNotificationCardQuery = (
  { __typename: 'Query' }
  & { card?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'url'>
  )> }
);

/**
 * __useDesktopNotificationCardQuery__
 *
 * To run a query within a React component, call `useDesktopNotificationCardQuery` and pass it any options that fit your needs.
 * When your component renders, `useDesktopNotificationCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDesktopNotificationCardQuery({
 *   variables: {
 *      idCard: // value for 'idCard'
 *   },
 * });
 */
export function useDesktopNotificationCardQuery(
  baseOptions: TrelloQueryHookOptions<
    DesktopNotificationCardQuery,
    DesktopNotificationCardQueryVariables
  > &
    (
      | { variables: DesktopNotificationCardQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: DesktopNotificationCardDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    DesktopNotificationCardQuery,
    DesktopNotificationCardQueryVariables
  >(DesktopNotificationCardDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useDesktopNotificationCardLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    DesktopNotificationCardQuery,
    DesktopNotificationCardQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    DesktopNotificationCardQuery,
    DesktopNotificationCardQueryVariables
  >(DesktopNotificationCardDocument, options);
}
export function useDesktopNotificationCardSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        DesktopNotificationCardQuery,
        DesktopNotificationCardQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    DesktopNotificationCardQuery,
    DesktopNotificationCardQueryVariables
  >(DesktopNotificationCardDocument, options);
}
export type DesktopNotificationCardQueryHookResult = ReturnType<
  typeof useDesktopNotificationCardQuery
>;
export type DesktopNotificationCardLazyQueryHookResult = ReturnType<
  typeof useDesktopNotificationCardLazyQuery
>;
export type DesktopNotificationCardSuspenseQueryHookResult = ReturnType<
  typeof useDesktopNotificationCardSuspenseQuery
>;
export type DesktopNotificationCardQueryResult = Apollo.QueryResult<
  DesktopNotificationCardQuery,
  DesktopNotificationCardQueryVariables
>;
