import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const ListVisibleCardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListVisibleCards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"visible"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"idList"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"ListVisibleCards","document":ListVisibleCardsDocument}} as const;
export type ListVisibleCardsQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID']['input'];
}>;


export type ListVisibleCardsQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
    & { cards: Array<(
      { __typename: 'Card' }
      & Pick<
        Types.Card,
        | 'id'
        | 'idBoard'
        | 'idList'
        | 'pos'
      >
    )> }
  )> }
);

/**
 * __useListVisibleCardsQuery__
 *
 * To run a query within a React component, call `useListVisibleCardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListVisibleCardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListVisibleCardsQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useListVisibleCardsQuery(
  baseOptions: TrelloQueryHookOptions<
    ListVisibleCardsQuery,
    ListVisibleCardsQueryVariables
  > &
    (
      | { variables: ListVisibleCardsQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: ListVisibleCardsDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    ListVisibleCardsQuery,
    ListVisibleCardsQueryVariables
  >(ListVisibleCardsDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useListVisibleCardsLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    ListVisibleCardsQuery,
    ListVisibleCardsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    ListVisibleCardsQuery,
    ListVisibleCardsQueryVariables
  >(ListVisibleCardsDocument, options);
}
export function useListVisibleCardsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        ListVisibleCardsQuery,
        ListVisibleCardsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    ListVisibleCardsQuery,
    ListVisibleCardsQueryVariables
  >(ListVisibleCardsDocument, options);
}
export type ListVisibleCardsQueryHookResult = ReturnType<
  typeof useListVisibleCardsQuery
>;
export type ListVisibleCardsLazyQueryHookResult = ReturnType<
  typeof useListVisibleCardsLazyQuery
>;
export type ListVisibleCardsSuspenseQueryHookResult = ReturnType<
  typeof useListVisibleCardsSuspenseQuery
>;
export type ListVisibleCardsQueryResult = Apollo.QueryResult<
  ListVisibleCardsQuery,
  ListVisibleCardsQueryVariables
>;
