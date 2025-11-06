import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const UpdateBoardFiltersFromObjectRemovalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UpdateBoardFiltersFromObjectRemoval"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"all"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"UpdateBoardFiltersFromObjectRemoval","document":UpdateBoardFiltersFromObjectRemovalDocument}} as const;
export type UpdateBoardFiltersFromObjectRemovalQueryVariables = Types.Exact<{
  idBoard: Types.Scalars['ID']['input'];
}>;


export type UpdateBoardFiltersFromObjectRemovalQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
    & {
      labels: Array<(
        { __typename: 'Label' }
        & Pick<Types.Label, 'id' | 'color' | 'name'>
      )>,
      members: Array<(
        { __typename: 'Member' }
        & Pick<Types.Member, 'id'>
      )>,
    }
  )> }
);

/**
 * __useUpdateBoardFiltersFromObjectRemovalQuery__
 *
 * To run a query within a React component, call `useUpdateBoardFiltersFromObjectRemovalQuery` and pass it any options that fit your needs.
 * When your component renders, `useUpdateBoardFiltersFromObjectRemovalQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUpdateBoardFiltersFromObjectRemovalQuery({
 *   variables: {
 *      idBoard: // value for 'idBoard'
 *   },
 * });
 */
export function useUpdateBoardFiltersFromObjectRemovalQuery(
  baseOptions: TrelloQueryHookOptions<
    UpdateBoardFiltersFromObjectRemovalQuery,
    UpdateBoardFiltersFromObjectRemovalQueryVariables
  > &
    (
      | {
          variables: UpdateBoardFiltersFromObjectRemovalQueryVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: UpdateBoardFiltersFromObjectRemovalDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    UpdateBoardFiltersFromObjectRemovalQuery,
    UpdateBoardFiltersFromObjectRemovalQueryVariables
  >(UpdateBoardFiltersFromObjectRemovalDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useUpdateBoardFiltersFromObjectRemovalLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    UpdateBoardFiltersFromObjectRemovalQuery,
    UpdateBoardFiltersFromObjectRemovalQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    UpdateBoardFiltersFromObjectRemovalQuery,
    UpdateBoardFiltersFromObjectRemovalQueryVariables
  >(UpdateBoardFiltersFromObjectRemovalDocument, options);
}
export function useUpdateBoardFiltersFromObjectRemovalSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        UpdateBoardFiltersFromObjectRemovalQuery,
        UpdateBoardFiltersFromObjectRemovalQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    UpdateBoardFiltersFromObjectRemovalQuery,
    UpdateBoardFiltersFromObjectRemovalQueryVariables
  >(UpdateBoardFiltersFromObjectRemovalDocument, options);
}
export type UpdateBoardFiltersFromObjectRemovalQueryHookResult = ReturnType<
  typeof useUpdateBoardFiltersFromObjectRemovalQuery
>;
export type UpdateBoardFiltersFromObjectRemovalLazyQueryHookResult = ReturnType<
  typeof useUpdateBoardFiltersFromObjectRemovalLazyQuery
>;
export type UpdateBoardFiltersFromObjectRemovalSuspenseQueryHookResult =
  ReturnType<typeof useUpdateBoardFiltersFromObjectRemovalSuspenseQuery>;
export type UpdateBoardFiltersFromObjectRemovalQueryResult = Apollo.QueryResult<
  UpdateBoardFiltersFromObjectRemovalQuery,
  UpdateBoardFiltersFromObjectRemovalQueryVariables
>;
