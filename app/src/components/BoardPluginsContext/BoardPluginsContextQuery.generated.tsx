import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const BoardPluginsContextDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardPluginsContext"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"boardPlugins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idPlugin"}}]}},{"kind":"Field","name":{"kind":"Name","value":"plugins"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"enabled"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"capabilities"}},{"kind":"Field","name":{"kind":"Name","value":"icon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"BoardPluginsContext","document":BoardPluginsContextDocument}} as const;
export type BoardPluginsContextQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID']['input'];
}>;


export type BoardPluginsContextQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
    & {
      boardPlugins: Array<(
        { __typename: 'BoardPlugin' }
        & Pick<Types.BoardPlugin, 'id' | 'idPlugin'>
      )>,
      plugins: Array<(
        { __typename: 'Plugin' }
        & Pick<Types.Plugin, 'id' | 'capabilities' | 'name'>
        & { icon: (
          { __typename: 'Plugin_Icon' }
          & Pick<Types.Plugin_Icon, 'url'>
        ) }
      )>,
    }
  )> }
);

/**
 * __useBoardPluginsContextQuery__
 *
 * To run a query within a React component, call `useBoardPluginsContextQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardPluginsContextQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardPluginsContextQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useBoardPluginsContextQuery(
  baseOptions: TrelloQueryHookOptions<
    BoardPluginsContextQuery,
    BoardPluginsContextQueryVariables
  > &
    (
      | { variables: BoardPluginsContextQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: BoardPluginsContextDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    BoardPluginsContextQuery,
    BoardPluginsContextQueryVariables
  >(BoardPluginsContextDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useBoardPluginsContextLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    BoardPluginsContextQuery,
    BoardPluginsContextQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    BoardPluginsContextQuery,
    BoardPluginsContextQueryVariables
  >(BoardPluginsContextDocument, options);
}
export function useBoardPluginsContextSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        BoardPluginsContextQuery,
        BoardPluginsContextQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    BoardPluginsContextQuery,
    BoardPluginsContextQueryVariables
  >(BoardPluginsContextDocument, options);
}
export type BoardPluginsContextQueryHookResult = ReturnType<
  typeof useBoardPluginsContextQuery
>;
export type BoardPluginsContextLazyQueryHookResult = ReturnType<
  typeof useBoardPluginsContextLazyQuery
>;
export type BoardPluginsContextSuspenseQueryHookResult = ReturnType<
  typeof useBoardPluginsContextSuspenseQuery
>;
export type BoardPluginsContextQueryResult = Apollo.QueryResult<
  BoardPluginsContextQuery,
  BoardPluginsContextQueryVariables
>;
