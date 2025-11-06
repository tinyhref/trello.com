import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const SwitchToBoardDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SwitchToBoardData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"SwitchToBoardData","document":SwitchToBoardDataDocument}} as const;
export type SwitchToBoardDataQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID']['input'];
}>;


export type SwitchToBoardDataQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id' | 'name' | 'shortLink'>
  )> }
);

/**
 * __useSwitchToBoardDataQuery__
 *
 * To run a query within a React component, call `useSwitchToBoardDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useSwitchToBoardDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSwitchToBoardDataQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useSwitchToBoardDataQuery(
  baseOptions: TrelloQueryHookOptions<
    SwitchToBoardDataQuery,
    SwitchToBoardDataQueryVariables
  > &
    (
      | { variables: SwitchToBoardDataQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: SwitchToBoardDataDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    SwitchToBoardDataQuery,
    SwitchToBoardDataQueryVariables
  >(SwitchToBoardDataDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useSwitchToBoardDataLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    SwitchToBoardDataQuery,
    SwitchToBoardDataQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    SwitchToBoardDataQuery,
    SwitchToBoardDataQueryVariables
  >(SwitchToBoardDataDocument, options);
}
export function useSwitchToBoardDataSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        SwitchToBoardDataQuery,
        SwitchToBoardDataQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    SwitchToBoardDataQuery,
    SwitchToBoardDataQueryVariables
  >(SwitchToBoardDataDocument, options);
}
export type SwitchToBoardDataQueryHookResult = ReturnType<
  typeof useSwitchToBoardDataQuery
>;
export type SwitchToBoardDataLazyQueryHookResult = ReturnType<
  typeof useSwitchToBoardDataLazyQuery
>;
export type SwitchToBoardDataSuspenseQueryHookResult = ReturnType<
  typeof useSwitchToBoardDataSuspenseQuery
>;
export type SwitchToBoardDataQueryResult = Apollo.QueryResult<
  SwitchToBoardDataQuery,
  SwitchToBoardDataQueryVariables
>;
