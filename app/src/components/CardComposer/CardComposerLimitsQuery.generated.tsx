import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const CardComposerLimitsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CardComposerLimits"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"listId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"openPerBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalPerBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"list"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"listId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"openPerList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalPerList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"CardComposerLimits","document":CardComposerLimitsDocument}} as const;
export type CardComposerLimitsQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID']['input'];
  listId: Types.Scalars['ID']['input'];
}>;


export type CardComposerLimitsQuery = (
  { __typename: 'Query' }
  & {
    board?: Types.Maybe<(
      { __typename: 'Board' }
      & Pick<Types.Board, 'id' | 'name'>
      & { limits: (
        { __typename: 'Board_Limits' }
        & { cards: (
          { __typename: 'Board_Limits_Cards' }
          & {
            openPerBoard: (
              { __typename: 'Limit' }
              & Pick<Types.Limit, 'status'>
            ),
            totalPerBoard: (
              { __typename: 'Limit' }
              & Pick<Types.Limit, 'status'>
            ),
          }
        ) }
      ) }
    )>,
    list?: Types.Maybe<(
      { __typename: 'List' }
      & Pick<Types.List, 'id' | 'name'>
      & { limits: (
        { __typename: 'List_Limits' }
        & { cards: (
          { __typename: 'List_Limits_Cards' }
          & {
            openPerList: (
              { __typename: 'Limit' }
              & Pick<Types.Limit, 'status'>
            ),
            totalPerList: (
              { __typename: 'Limit' }
              & Pick<Types.Limit, 'status'>
            ),
          }
        ) }
      ) }
    )>,
  }
);

/**
 * __useCardComposerLimitsQuery__
 *
 * To run a query within a React component, call `useCardComposerLimitsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCardComposerLimitsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCardComposerLimitsQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *      listId: // value for 'listId'
 *   },
 * });
 */
export function useCardComposerLimitsQuery(
  baseOptions: TrelloQueryHookOptions<
    CardComposerLimitsQuery,
    CardComposerLimitsQueryVariables
  > &
    (
      | { variables: CardComposerLimitsQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: CardComposerLimitsDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    CardComposerLimitsQuery,
    CardComposerLimitsQueryVariables
  >(CardComposerLimitsDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useCardComposerLimitsLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    CardComposerLimitsQuery,
    CardComposerLimitsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    CardComposerLimitsQuery,
    CardComposerLimitsQueryVariables
  >(CardComposerLimitsDocument, options);
}
export function useCardComposerLimitsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        CardComposerLimitsQuery,
        CardComposerLimitsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    CardComposerLimitsQuery,
    CardComposerLimitsQueryVariables
  >(CardComposerLimitsDocument, options);
}
export type CardComposerLimitsQueryHookResult = ReturnType<
  typeof useCardComposerLimitsQuery
>;
export type CardComposerLimitsLazyQueryHookResult = ReturnType<
  typeof useCardComposerLimitsLazyQuery
>;
export type CardComposerLimitsSuspenseQueryHookResult = ReturnType<
  typeof useCardComposerLimitsSuspenseQuery
>;
export type CardComposerLimitsQueryResult = Apollo.QueryResult<
  CardComposerLimitsQuery,
  CardComposerLimitsQueryVariables
>;
