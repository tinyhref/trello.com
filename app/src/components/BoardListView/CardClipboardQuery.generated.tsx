import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const CardClipboardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CardClipboard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"idList"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"CardClipboard","document":CardClipboardDocument}} as const;
export type CardClipboardQueryVariables = Types.Exact<{
  idCard: Types.Scalars['ID']['input'];
}>;


export type CardClipboardQuery = (
  { __typename: 'Query' }
  & { card?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<
      Types.Card,
      | 'id'
      | 'idBoard'
      | 'idList'
      | 'pos'
      | 'url'
    >
  )> }
);

/**
 * __useCardClipboardQuery__
 *
 * To run a query within a React component, call `useCardClipboardQuery` and pass it any options that fit your needs.
 * When your component renders, `useCardClipboardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCardClipboardQuery({
 *   variables: {
 *      idCard: // value for 'idCard'
 *   },
 * });
 */
export function useCardClipboardQuery(
  baseOptions: TrelloQueryHookOptions<
    CardClipboardQuery,
    CardClipboardQueryVariables
  > &
    (
      | { variables: CardClipboardQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: CardClipboardDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    CardClipboardQuery,
    CardClipboardQueryVariables
  >(CardClipboardDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useCardClipboardLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    CardClipboardQuery,
    CardClipboardQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CardClipboardQuery, CardClipboardQueryVariables>(
    CardClipboardDocument,
    options,
  );
}
export function useCardClipboardSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        CardClipboardQuery,
        CardClipboardQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    CardClipboardQuery,
    CardClipboardQueryVariables
  >(CardClipboardDocument, options);
}
export type CardClipboardQueryHookResult = ReturnType<
  typeof useCardClipboardQuery
>;
export type CardClipboardLazyQueryHookResult = ReturnType<
  typeof useCardClipboardLazyQuery
>;
export type CardClipboardSuspenseQueryHookResult = ReturnType<
  typeof useCardClipboardSuspenseQuery
>;
export type CardClipboardQueryResult = Apollo.QueryResult<
  CardClipboardQuery,
  CardClipboardQueryVariables
>;
