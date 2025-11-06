import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const CanPasteCardFromClipboardEnterpriseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CanPasteCardFromClipboardEnterprise"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idEnterprise"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enterprise"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idEnterprise"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"CanPasteCardFromClipboardEnterprise","document":CanPasteCardFromClipboardEnterpriseDocument}} as const;
export type CanPasteCardFromClipboardEnterpriseQueryVariables = Types.Exact<{
  idEnterprise: Types.Scalars['ID']['input'];
}>;


export type CanPasteCardFromClipboardEnterpriseQuery = (
  { __typename: 'Query' }
  & { enterprise?: Types.Maybe<(
    { __typename: 'Enterprise' }
    & Pick<Types.Enterprise, 'id' | 'name'>
  )> }
);

/**
 * __useCanPasteCardFromClipboardEnterpriseQuery__
 *
 * To run a query within a React component, call `useCanPasteCardFromClipboardEnterpriseQuery` and pass it any options that fit your needs.
 * When your component renders, `useCanPasteCardFromClipboardEnterpriseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCanPasteCardFromClipboardEnterpriseQuery({
 *   variables: {
 *      idEnterprise: // value for 'idEnterprise'
 *   },
 * });
 */
export function useCanPasteCardFromClipboardEnterpriseQuery(
  baseOptions: TrelloQueryHookOptions<
    CanPasteCardFromClipboardEnterpriseQuery,
    CanPasteCardFromClipboardEnterpriseQueryVariables
  > &
    (
      | {
          variables: CanPasteCardFromClipboardEnterpriseQueryVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: CanPasteCardFromClipboardEnterpriseDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    CanPasteCardFromClipboardEnterpriseQuery,
    CanPasteCardFromClipboardEnterpriseQueryVariables
  >(CanPasteCardFromClipboardEnterpriseDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useCanPasteCardFromClipboardEnterpriseLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    CanPasteCardFromClipboardEnterpriseQuery,
    CanPasteCardFromClipboardEnterpriseQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    CanPasteCardFromClipboardEnterpriseQuery,
    CanPasteCardFromClipboardEnterpriseQueryVariables
  >(CanPasteCardFromClipboardEnterpriseDocument, options);
}
export function useCanPasteCardFromClipboardEnterpriseSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        CanPasteCardFromClipboardEnterpriseQuery,
        CanPasteCardFromClipboardEnterpriseQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    CanPasteCardFromClipboardEnterpriseQuery,
    CanPasteCardFromClipboardEnterpriseQueryVariables
  >(CanPasteCardFromClipboardEnterpriseDocument, options);
}
export type CanPasteCardFromClipboardEnterpriseQueryHookResult = ReturnType<
  typeof useCanPasteCardFromClipboardEnterpriseQuery
>;
export type CanPasteCardFromClipboardEnterpriseLazyQueryHookResult = ReturnType<
  typeof useCanPasteCardFromClipboardEnterpriseLazyQuery
>;
export type CanPasteCardFromClipboardEnterpriseSuspenseQueryHookResult =
  ReturnType<typeof useCanPasteCardFromClipboardEnterpriseSuspenseQuery>;
export type CanPasteCardFromClipboardEnterpriseQueryResult = Apollo.QueryResult<
  CanPasteCardFromClipboardEnterpriseQuery,
  CanPasteCardFromClipboardEnterpriseQueryVariables
>;
