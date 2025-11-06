import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const CardShortLinkForBoardIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CardShortLinkForBoardId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"CardShortLinkForBoardId","document":CardShortLinkForBoardIdDocument}} as const;
export type CardShortLinkForBoardIdQueryVariables = Types.Exact<{
  cardId: Types.Scalars['ID']['input'];
}>;


export type CardShortLinkForBoardIdQuery = (
  { __typename: 'Query' }
  & { card?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'idBoard'>
  )> }
);

/**
 * __useCardShortLinkForBoardIdQuery__
 *
 * To run a query within a React component, call `useCardShortLinkForBoardIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useCardShortLinkForBoardIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCardShortLinkForBoardIdQuery({
 *   variables: {
 *      cardId: // value for 'cardId'
 *   },
 * });
 */
export function useCardShortLinkForBoardIdQuery(
  baseOptions: TrelloQueryHookOptions<
    CardShortLinkForBoardIdQuery,
    CardShortLinkForBoardIdQueryVariables
  > &
    (
      | { variables: CardShortLinkForBoardIdQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: CardShortLinkForBoardIdDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    CardShortLinkForBoardIdQuery,
    CardShortLinkForBoardIdQueryVariables
  >(CardShortLinkForBoardIdDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useCardShortLinkForBoardIdLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    CardShortLinkForBoardIdQuery,
    CardShortLinkForBoardIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    CardShortLinkForBoardIdQuery,
    CardShortLinkForBoardIdQueryVariables
  >(CardShortLinkForBoardIdDocument, options);
}
export function useCardShortLinkForBoardIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        CardShortLinkForBoardIdQuery,
        CardShortLinkForBoardIdQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    CardShortLinkForBoardIdQuery,
    CardShortLinkForBoardIdQueryVariables
  >(CardShortLinkForBoardIdDocument, options);
}
export type CardShortLinkForBoardIdQueryHookResult = ReturnType<
  typeof useCardShortLinkForBoardIdQuery
>;
export type CardShortLinkForBoardIdLazyQueryHookResult = ReturnType<
  typeof useCardShortLinkForBoardIdLazyQuery
>;
export type CardShortLinkForBoardIdSuspenseQueryHookResult = ReturnType<
  typeof useCardShortLinkForBoardIdSuspenseQuery
>;
export type CardShortLinkForBoardIdQueryResult = Apollo.QueryResult<
  CardShortLinkForBoardIdQuery,
  CardShortLinkForBoardIdQueryVariables
>;
