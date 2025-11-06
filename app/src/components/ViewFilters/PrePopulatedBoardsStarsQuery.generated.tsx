import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const PrePopulatedBoardsStarsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PrePopulatedBoardsStars"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"boardStars"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"PrePopulatedBoardsStars","document":PrePopulatedBoardsStarsDocument}} as const;
export type PrePopulatedBoardsStarsQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID']['input'];
}>;


export type PrePopulatedBoardsStarsQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id'>
    & { boardStars: Array<(
      { __typename: 'BoardStar' }
      & Pick<Types.BoardStar, 'id' | 'idBoard' | 'pos'>
    )> }
  )> }
);

/**
 * __usePrePopulatedBoardsStarsQuery__
 *
 * To run a query within a React component, call `usePrePopulatedBoardsStarsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePrePopulatedBoardsStarsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePrePopulatedBoardsStarsQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function usePrePopulatedBoardsStarsQuery(
  baseOptions: TrelloQueryHookOptions<
    PrePopulatedBoardsStarsQuery,
    PrePopulatedBoardsStarsQueryVariables
  > &
    (
      | { variables: PrePopulatedBoardsStarsQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: PrePopulatedBoardsStarsDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    PrePopulatedBoardsStarsQuery,
    PrePopulatedBoardsStarsQueryVariables
  >(PrePopulatedBoardsStarsDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function usePrePopulatedBoardsStarsLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    PrePopulatedBoardsStarsQuery,
    PrePopulatedBoardsStarsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    PrePopulatedBoardsStarsQuery,
    PrePopulatedBoardsStarsQueryVariables
  >(PrePopulatedBoardsStarsDocument, options);
}
export function usePrePopulatedBoardsStarsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        PrePopulatedBoardsStarsQuery,
        PrePopulatedBoardsStarsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    PrePopulatedBoardsStarsQuery,
    PrePopulatedBoardsStarsQueryVariables
  >(PrePopulatedBoardsStarsDocument, options);
}
export type PrePopulatedBoardsStarsQueryHookResult = ReturnType<
  typeof usePrePopulatedBoardsStarsQuery
>;
export type PrePopulatedBoardsStarsLazyQueryHookResult = ReturnType<
  typeof usePrePopulatedBoardsStarsLazyQuery
>;
export type PrePopulatedBoardsStarsSuspenseQueryHookResult = ReturnType<
  typeof usePrePopulatedBoardsStarsSuspenseQuery
>;
export type PrePopulatedBoardsStarsQueryResult = Apollo.QueryResult<
  PrePopulatedBoardsStarsQuery,
  PrePopulatedBoardsStarsQueryVariables
>;
