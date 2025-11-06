import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const CanPasteCardFromClipboardCardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CanPasteCardFromClipboardCard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"CanPasteCardFromClipboardCard","document":CanPasteCardFromClipboardCardDocument}} as const;
export type CanPasteCardFromClipboardCardQueryVariables = Types.Exact<{
  idCard: Types.Scalars['ID']['input'];
}>;


export type CanPasteCardFromClipboardCardQuery = (
  { __typename: 'Query' }
  & { card?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'idBoard'>
  )> }
);

/**
 * __useCanPasteCardFromClipboardCardQuery__
 *
 * To run a query within a React component, call `useCanPasteCardFromClipboardCardQuery` and pass it any options that fit your needs.
 * When your component renders, `useCanPasteCardFromClipboardCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCanPasteCardFromClipboardCardQuery({
 *   variables: {
 *      idCard: // value for 'idCard'
 *   },
 * });
 */
export function useCanPasteCardFromClipboardCardQuery(
  baseOptions: TrelloQueryHookOptions<
    CanPasteCardFromClipboardCardQuery,
    CanPasteCardFromClipboardCardQueryVariables
  > &
    (
      | {
          variables: CanPasteCardFromClipboardCardQueryVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: CanPasteCardFromClipboardCardDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    CanPasteCardFromClipboardCardQuery,
    CanPasteCardFromClipboardCardQueryVariables
  >(CanPasteCardFromClipboardCardDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useCanPasteCardFromClipboardCardLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    CanPasteCardFromClipboardCardQuery,
    CanPasteCardFromClipboardCardQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    CanPasteCardFromClipboardCardQuery,
    CanPasteCardFromClipboardCardQueryVariables
  >(CanPasteCardFromClipboardCardDocument, options);
}
export function useCanPasteCardFromClipboardCardSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        CanPasteCardFromClipboardCardQuery,
        CanPasteCardFromClipboardCardQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    CanPasteCardFromClipboardCardQuery,
    CanPasteCardFromClipboardCardQueryVariables
  >(CanPasteCardFromClipboardCardDocument, options);
}
export type CanPasteCardFromClipboardCardQueryHookResult = ReturnType<
  typeof useCanPasteCardFromClipboardCardQuery
>;
export type CanPasteCardFromClipboardCardLazyQueryHookResult = ReturnType<
  typeof useCanPasteCardFromClipboardCardLazyQuery
>;
export type CanPasteCardFromClipboardCardSuspenseQueryHookResult = ReturnType<
  typeof useCanPasteCardFromClipboardCardSuspenseQuery
>;
export type CanPasteCardFromClipboardCardQueryResult = Apollo.QueryResult<
  CanPasteCardFromClipboardCardQuery,
  CanPasteCardFromClipboardCardQueryVariables
>;
