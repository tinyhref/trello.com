import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const PrePopulatedBoardsShortlinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PrePopulatedBoardsShortlink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"boardIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardIds"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"PrePopulatedBoardsShortlink","document":PrePopulatedBoardsShortlinkDocument}} as const;
export type PrePopulatedBoardsShortlinkQueryVariables = Types.Exact<{
  boardIds: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
  workspaceId: Types.Scalars['ID']['input'];
}>;


export type PrePopulatedBoardsShortlinkQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id'>
    & { boards: Array<(
      { __typename: 'Board' }
      & Pick<Types.Board, 'id' | 'shortLink'>
    )> }
  )> }
);

/**
 * __usePrePopulatedBoardsShortlinkQuery__
 *
 * To run a query within a React component, call `usePrePopulatedBoardsShortlinkQuery` and pass it any options that fit your needs.
 * When your component renders, `usePrePopulatedBoardsShortlinkQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePrePopulatedBoardsShortlinkQuery({
 *   variables: {
 *      boardIds: // value for 'boardIds'
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function usePrePopulatedBoardsShortlinkQuery(
  baseOptions: TrelloQueryHookOptions<
    PrePopulatedBoardsShortlinkQuery,
    PrePopulatedBoardsShortlinkQueryVariables
  > &
    (
      | { variables: PrePopulatedBoardsShortlinkQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: PrePopulatedBoardsShortlinkDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    PrePopulatedBoardsShortlinkQuery,
    PrePopulatedBoardsShortlinkQueryVariables
  >(PrePopulatedBoardsShortlinkDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function usePrePopulatedBoardsShortlinkLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    PrePopulatedBoardsShortlinkQuery,
    PrePopulatedBoardsShortlinkQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    PrePopulatedBoardsShortlinkQuery,
    PrePopulatedBoardsShortlinkQueryVariables
  >(PrePopulatedBoardsShortlinkDocument, options);
}
export function usePrePopulatedBoardsShortlinkSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        PrePopulatedBoardsShortlinkQuery,
        PrePopulatedBoardsShortlinkQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    PrePopulatedBoardsShortlinkQuery,
    PrePopulatedBoardsShortlinkQueryVariables
  >(PrePopulatedBoardsShortlinkDocument, options);
}
export type PrePopulatedBoardsShortlinkQueryHookResult = ReturnType<
  typeof usePrePopulatedBoardsShortlinkQuery
>;
export type PrePopulatedBoardsShortlinkLazyQueryHookResult = ReturnType<
  typeof usePrePopulatedBoardsShortlinkLazyQuery
>;
export type PrePopulatedBoardsShortlinkSuspenseQueryHookResult = ReturnType<
  typeof usePrePopulatedBoardsShortlinkSuspenseQuery
>;
export type PrePopulatedBoardsShortlinkQueryResult = Apollo.QueryResult<
  PrePopulatedBoardsShortlinkQuery,
  PrePopulatedBoardsShortlinkQueryVariables
>;
