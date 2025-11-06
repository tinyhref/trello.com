import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const ConvertCardRoleButtonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ConvertCardRoleButton"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cardRole"}},{"kind":"Field","name":{"kind":"Name","value":"possibleCardRole"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"ConvertCardRoleButton","document":ConvertCardRoleButtonDocument}} as const;
export type ConvertCardRoleButtonQueryVariables = Types.Exact<{
  cardId: Types.Scalars['ID']['input'];
}>;


export type ConvertCardRoleButtonQuery = (
  { __typename: 'Query' }
  & { card?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'cardRole' | 'possibleCardRole'>
  )> }
);

/**
 * __useConvertCardRoleButtonQuery__
 *
 * To run a query within a React component, call `useConvertCardRoleButtonQuery` and pass it any options that fit your needs.
 * When your component renders, `useConvertCardRoleButtonQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConvertCardRoleButtonQuery({
 *   variables: {
 *      cardId: // value for 'cardId'
 *   },
 * });
 */
export function useConvertCardRoleButtonQuery(
  baseOptions: TrelloQueryHookOptions<
    ConvertCardRoleButtonQuery,
    ConvertCardRoleButtonQueryVariables
  > &
    (
      | { variables: ConvertCardRoleButtonQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: ConvertCardRoleButtonDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    ConvertCardRoleButtonQuery,
    ConvertCardRoleButtonQueryVariables
  >(ConvertCardRoleButtonDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useConvertCardRoleButtonLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    ConvertCardRoleButtonQuery,
    ConvertCardRoleButtonQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    ConvertCardRoleButtonQuery,
    ConvertCardRoleButtonQueryVariables
  >(ConvertCardRoleButtonDocument, options);
}
export function useConvertCardRoleButtonSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        ConvertCardRoleButtonQuery,
        ConvertCardRoleButtonQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    ConvertCardRoleButtonQuery,
    ConvertCardRoleButtonQueryVariables
  >(ConvertCardRoleButtonDocument, options);
}
export type ConvertCardRoleButtonQueryHookResult = ReturnType<
  typeof useConvertCardRoleButtonQuery
>;
export type ConvertCardRoleButtonLazyQueryHookResult = ReturnType<
  typeof useConvertCardRoleButtonLazyQuery
>;
export type ConvertCardRoleButtonSuspenseQueryHookResult = ReturnType<
  typeof useConvertCardRoleButtonSuspenseQuery
>;
export type ConvertCardRoleButtonQueryResult = Apollo.QueryResult<
  ConvertCardRoleButtonQuery,
  ConvertCardRoleButtonQueryVariables
>;
