import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const BoardBackgroundDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardBackground"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundBottomColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundBrightness"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundDarkColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundDarkImage"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImage"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backgroundTile"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundTopColor"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"BoardBackground","document":BoardBackgroundDocument}} as const;
export type BoardBackgroundQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID']['input'];
}>;


export type BoardBackgroundQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
    & { prefs?: Types.Maybe<(
      { __typename: 'Board_Prefs' }
      & Pick<
        Types.Board_Prefs,
        | 'background'
        | 'backgroundBottomColor'
        | 'backgroundBrightness'
        | 'backgroundColor'
        | 'backgroundDarkColor'
        | 'backgroundDarkImage'
        | 'backgroundImage'
        | 'backgroundTile'
        | 'backgroundTopColor'
      >
      & { backgroundImageScaled?: Types.Maybe<Array<(
        { __typename: 'Board_Prefs_BackgroundImageScaled' }
        & Pick<Types.Board_Prefs_BackgroundImageScaled, 'height' | 'url' | 'width'>
      )>> }
    )> }
  )> }
);

/**
 * __useBoardBackgroundQuery__
 *
 * To run a query within a React component, call `useBoardBackgroundQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardBackgroundQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardBackgroundQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useBoardBackgroundQuery(
  baseOptions: TrelloQueryHookOptions<
    BoardBackgroundQuery,
    BoardBackgroundQueryVariables
  > &
    (
      | { variables: BoardBackgroundQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: BoardBackgroundDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    BoardBackgroundQuery,
    BoardBackgroundQueryVariables
  >(BoardBackgroundDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useBoardBackgroundLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    BoardBackgroundQuery,
    BoardBackgroundQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    BoardBackgroundQuery,
    BoardBackgroundQueryVariables
  >(BoardBackgroundDocument, options);
}
export function useBoardBackgroundSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        BoardBackgroundQuery,
        BoardBackgroundQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    BoardBackgroundQuery,
    BoardBackgroundQueryVariables
  >(BoardBackgroundDocument, options);
}
export type BoardBackgroundQueryHookResult = ReturnType<
  typeof useBoardBackgroundQuery
>;
export type BoardBackgroundLazyQueryHookResult = ReturnType<
  typeof useBoardBackgroundLazyQuery
>;
export type BoardBackgroundSuspenseQueryHookResult = ReturnType<
  typeof useBoardBackgroundSuspenseQuery
>;
export type BoardBackgroundQueryResult = Apollo.QueryResult<
  BoardBackgroundQuery,
  BoardBackgroundQueryVariables
>;
