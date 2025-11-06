import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const BoardFilterLabelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardFilterLabels"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"all"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"BoardFilterLabels","document":BoardFilterLabelsDocument}} as const;
export type BoardFilterLabelsQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID']['input'];
}>;


export type BoardFilterLabelsQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
    & { labels: Array<(
      { __typename: 'Label' }
      & Pick<
        Types.Label,
        | 'id'
        | 'color'
        | 'idBoard'
        | 'name'
      >
    )> }
  )> }
);

/**
 * __useBoardFilterLabelsQuery__
 *
 * To run a query within a React component, call `useBoardFilterLabelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardFilterLabelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardFilterLabelsQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useBoardFilterLabelsQuery(
  baseOptions: TrelloQueryHookOptions<
    BoardFilterLabelsQuery,
    BoardFilterLabelsQueryVariables
  > &
    (
      | { variables: BoardFilterLabelsQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: BoardFilterLabelsDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    BoardFilterLabelsQuery,
    BoardFilterLabelsQueryVariables
  >(BoardFilterLabelsDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useBoardFilterLabelsLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    BoardFilterLabelsQuery,
    BoardFilterLabelsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    BoardFilterLabelsQuery,
    BoardFilterLabelsQueryVariables
  >(BoardFilterLabelsDocument, options);
}
export function useBoardFilterLabelsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        BoardFilterLabelsQuery,
        BoardFilterLabelsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    BoardFilterLabelsQuery,
    BoardFilterLabelsQueryVariables
  >(BoardFilterLabelsDocument, options);
}
export type BoardFilterLabelsQueryHookResult = ReturnType<
  typeof useBoardFilterLabelsQuery
>;
export type BoardFilterLabelsLazyQueryHookResult = ReturnType<
  typeof useBoardFilterLabelsLazyQuery
>;
export type BoardFilterLabelsSuspenseQueryHookResult = ReturnType<
  typeof useBoardFilterLabelsSuspenseQuery
>;
export type BoardFilterLabelsQueryResult = Apollo.QueryResult<
  BoardFilterLabelsQuery,
  BoardFilterLabelsQueryVariables
>;
