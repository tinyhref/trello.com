import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const SwitchToBoardCardDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SwitchToBoardCardData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"SwitchToBoardCardData","document":SwitchToBoardCardDataDocument}} as const;
export type SwitchToBoardCardDataQueryVariables = Types.Exact<{
  cardId: Types.Scalars['ID']['input'];
}>;


export type SwitchToBoardCardDataQuery = (
  { __typename: 'Query' }
  & { card?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'idBoard'>
  )> }
);

/**
 * __useSwitchToBoardCardDataQuery__
 *
 * To run a query within a React component, call `useSwitchToBoardCardDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useSwitchToBoardCardDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSwitchToBoardCardDataQuery({
 *   variables: {
 *      cardId: // value for 'cardId'
 *   },
 * });
 */
export function useSwitchToBoardCardDataQuery(
  baseOptions: TrelloQueryHookOptions<
    SwitchToBoardCardDataQuery,
    SwitchToBoardCardDataQueryVariables
  > &
    (
      | { variables: SwitchToBoardCardDataQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: SwitchToBoardCardDataDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    SwitchToBoardCardDataQuery,
    SwitchToBoardCardDataQueryVariables
  >(SwitchToBoardCardDataDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useSwitchToBoardCardDataLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    SwitchToBoardCardDataQuery,
    SwitchToBoardCardDataQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    SwitchToBoardCardDataQuery,
    SwitchToBoardCardDataQueryVariables
  >(SwitchToBoardCardDataDocument, options);
}
export function useSwitchToBoardCardDataSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        SwitchToBoardCardDataQuery,
        SwitchToBoardCardDataQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    SwitchToBoardCardDataQuery,
    SwitchToBoardCardDataQueryVariables
  >(SwitchToBoardCardDataDocument, options);
}
export type SwitchToBoardCardDataQueryHookResult = ReturnType<
  typeof useSwitchToBoardCardDataQuery
>;
export type SwitchToBoardCardDataLazyQueryHookResult = ReturnType<
  typeof useSwitchToBoardCardDataLazyQuery
>;
export type SwitchToBoardCardDataSuspenseQueryHookResult = ReturnType<
  typeof useSwitchToBoardCardDataSuspenseQuery
>;
export type SwitchToBoardCardDataQueryResult = Apollo.QueryResult<
  SwitchToBoardCardDataQuery,
  SwitchToBoardCardDataQueryVariables
>;
