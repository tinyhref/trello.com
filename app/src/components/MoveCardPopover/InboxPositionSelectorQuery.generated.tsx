import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const InboxPositionSelectorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InboxPositionSelector"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"inboxId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"inboxId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"visible"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"InboxPositionSelector","document":InboxPositionSelectorDocument}} as const;
export type InboxPositionSelectorQueryVariables = Types.Exact<{
  inboxId: Types.Scalars['ID']['input'];
}>;


export type InboxPositionSelectorQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
    & { cards: Array<(
      { __typename: 'Card' }
      & Pick<Types.Card, 'id' | 'pos'>
    )> }
  )> }
);

/**
 * __useInboxPositionSelectorQuery__
 *
 * To run a query within a React component, call `useInboxPositionSelectorQuery` and pass it any options that fit your needs.
 * When your component renders, `useInboxPositionSelectorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInboxPositionSelectorQuery({
 *   variables: {
 *      inboxId: // value for 'inboxId'
 *   },
 * });
 */
export function useInboxPositionSelectorQuery(
  baseOptions: TrelloQueryHookOptions<
    InboxPositionSelectorQuery,
    InboxPositionSelectorQueryVariables
  > &
    (
      | { variables: InboxPositionSelectorQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: InboxPositionSelectorDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    InboxPositionSelectorQuery,
    InboxPositionSelectorQueryVariables
  >(InboxPositionSelectorDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useInboxPositionSelectorLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    InboxPositionSelectorQuery,
    InboxPositionSelectorQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    InboxPositionSelectorQuery,
    InboxPositionSelectorQueryVariables
  >(InboxPositionSelectorDocument, options);
}
export function useInboxPositionSelectorSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        InboxPositionSelectorQuery,
        InboxPositionSelectorQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    InboxPositionSelectorQuery,
    InboxPositionSelectorQueryVariables
  >(InboxPositionSelectorDocument, options);
}
export type InboxPositionSelectorQueryHookResult = ReturnType<
  typeof useInboxPositionSelectorQuery
>;
export type InboxPositionSelectorLazyQueryHookResult = ReturnType<
  typeof useInboxPositionSelectorLazyQuery
>;
export type InboxPositionSelectorSuspenseQueryHookResult = ReturnType<
  typeof useInboxPositionSelectorSuspenseQuery
>;
export type InboxPositionSelectorQueryResult = Apollo.QueryResult<
  InboxPositionSelectorQuery,
  InboxPositionSelectorQueryVariables
>;
