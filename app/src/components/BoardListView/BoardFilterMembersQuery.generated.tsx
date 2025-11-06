import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const BoardFilterMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardFilterMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"BoardFilterMembers","document":BoardFilterMembersDocument}} as const;
export type BoardFilterMembersQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID']['input'];
}>;


export type BoardFilterMembersQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
    & { members: Array<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'id' | 'username'>
    )> }
  )> }
);

/**
 * __useBoardFilterMembersQuery__
 *
 * To run a query within a React component, call `useBoardFilterMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardFilterMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardFilterMembersQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useBoardFilterMembersQuery(
  baseOptions: TrelloQueryHookOptions<
    BoardFilterMembersQuery,
    BoardFilterMembersQueryVariables
  > &
    (
      | { variables: BoardFilterMembersQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: BoardFilterMembersDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    BoardFilterMembersQuery,
    BoardFilterMembersQueryVariables
  >(BoardFilterMembersDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useBoardFilterMembersLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    BoardFilterMembersQuery,
    BoardFilterMembersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    BoardFilterMembersQuery,
    BoardFilterMembersQueryVariables
  >(BoardFilterMembersDocument, options);
}
export function useBoardFilterMembersSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        BoardFilterMembersQuery,
        BoardFilterMembersQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    BoardFilterMembersQuery,
    BoardFilterMembersQueryVariables
  >(BoardFilterMembersDocument, options);
}
export type BoardFilterMembersQueryHookResult = ReturnType<
  typeof useBoardFilterMembersQuery
>;
export type BoardFilterMembersLazyQueryHookResult = ReturnType<
  typeof useBoardFilterMembersLazyQuery
>;
export type BoardFilterMembersSuspenseQueryHookResult = ReturnType<
  typeof useBoardFilterMembersSuspenseQuery
>;
export type BoardFilterMembersQueryResult = Apollo.QueryResult<
  BoardFilterMembersQuery,
  BoardFilterMembersQueryVariables
>;
