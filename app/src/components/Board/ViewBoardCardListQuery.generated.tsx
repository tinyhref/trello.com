import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const ViewBoardCardListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ViewBoardCardList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"visible"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"closed"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"ViewBoardCardList","document":ViewBoardCardListDocument}} as const;
export type ViewBoardCardListQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type ViewBoardCardListQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id' | 'closed'>
    & { cards: Array<(
      { __typename: 'Card' }
      & Pick<Types.Card, 'id'>
    )> }
  )> }
);

/**
 * __useViewBoardCardListQuery__
 *
 * To run a query within a React component, call `useViewBoardCardListQuery` and pass it any options that fit your needs.
 * When your component renders, `useViewBoardCardListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useViewBoardCardListQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useViewBoardCardListQuery(
  baseOptions: TrelloQueryHookOptions<
    ViewBoardCardListQuery,
    ViewBoardCardListQueryVariables
  > &
    (
      | { variables: ViewBoardCardListQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: ViewBoardCardListDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    ViewBoardCardListQuery,
    ViewBoardCardListQueryVariables
  >(ViewBoardCardListDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useViewBoardCardListLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    ViewBoardCardListQuery,
    ViewBoardCardListQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    ViewBoardCardListQuery,
    ViewBoardCardListQueryVariables
  >(ViewBoardCardListDocument, options);
}
export function useViewBoardCardListSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        ViewBoardCardListQuery,
        ViewBoardCardListQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    ViewBoardCardListQuery,
    ViewBoardCardListQueryVariables
  >(ViewBoardCardListDocument, options);
}
export type ViewBoardCardListQueryHookResult = ReturnType<
  typeof useViewBoardCardListQuery
>;
export type ViewBoardCardListLazyQueryHookResult = ReturnType<
  typeof useViewBoardCardListLazyQuery
>;
export type ViewBoardCardListSuspenseQueryHookResult = ReturnType<
  typeof useViewBoardCardListSuspenseQuery
>;
export type ViewBoardCardListQueryResult = Apollo.QueryResult<
  ViewBoardCardListQuery,
  ViewBoardCardListQueryVariables
>;
