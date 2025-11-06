import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const BoardListsContextDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardListsContext"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"visible"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BoardListsContextCard"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BoardListsContextList"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BoardListsContextCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Card"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cardRole"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"dueComplete"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"idList"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pinned"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BoardListsContextList"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"List"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"BoardListsContext","document":BoardListsContextDocument}} as const;
export type BoardListsContextQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID']['input'];
}>;


export type BoardListsContextQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
    & {
      cards: Array<(
        { __typename: 'Card' }
        & Pick<
          Types.Card,
          | 'id'
          | 'cardRole'
          | 'closed'
          | 'dueComplete'
          | 'idBoard'
          | 'idList'
          | 'name'
          | 'pinned'
          | 'pos'
        >
      )>,
      lists: Array<(
        { __typename: 'List' }
        & Pick<
          Types.List,
          | 'id'
          | 'closed'
          | 'name'
          | 'pos'
          | 'type'
        >
      )>,
    }
  )> }
);

/**
 * __useBoardListsContextQuery__
 *
 * To run a query within a React component, call `useBoardListsContextQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardListsContextQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardListsContextQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useBoardListsContextQuery(
  baseOptions: TrelloQueryHookOptions<
    BoardListsContextQuery,
    BoardListsContextQueryVariables
  > &
    (
      | { variables: BoardListsContextQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: BoardListsContextDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    BoardListsContextQuery,
    BoardListsContextQueryVariables
  >(BoardListsContextDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useBoardListsContextLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    BoardListsContextQuery,
    BoardListsContextQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    BoardListsContextQuery,
    BoardListsContextQueryVariables
  >(BoardListsContextDocument, options);
}
export function useBoardListsContextSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        BoardListsContextQuery,
        BoardListsContextQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    BoardListsContextQuery,
    BoardListsContextQueryVariables
  >(BoardListsContextDocument, options);
}
export type BoardListsContextQueryHookResult = ReturnType<
  typeof useBoardListsContextQuery
>;
export type BoardListsContextLazyQueryHookResult = ReturnType<
  typeof useBoardListsContextLazyQuery
>;
export type BoardListsContextSuspenseQueryHookResult = ReturnType<
  typeof useBoardListsContextSuspenseQuery
>;
export type BoardListsContextQueryResult = Apollo.QueryResult<
  BoardListsContextQuery,
  BoardListsContextQueryVariables
>;
