import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const TrelloBoardMirrorCardFilterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TrelloBoardMirrorCardFilter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloShortLink"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boardMirrorCardInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"shortLink"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloBoardMirrorCardInfo","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"mirrorCards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"TrelloBoardMirrorCardFilter","document":TrelloBoardMirrorCardFilterDocument}} as const;
export type TrelloBoardMirrorCardFilterQueryVariables = Types.Exact<{
  id: Types.Scalars['TrelloShortLink']['input'];
}>;


export type TrelloBoardMirrorCardFilterQuery = (
  { __typename: 'Query' }
  & { trello: (
    { __typename: 'TrelloQueryApi' }
    & { boardMirrorCardInfo?: Types.Maybe<(
      { __typename: 'TrelloBoardMirrorCards' }
      & Pick<Types.TrelloBoardMirrorCards, 'id'>
      & { mirrorCards?: Types.Maybe<(
        { __typename: 'TrelloMirrorCardConnection' }
        & { edges?: Types.Maybe<Array<(
          { __typename: 'TrelloMirrorCardEdge' }
          & { node?: Types.Maybe<(
            { __typename: 'TrelloMirrorCard' }
            & Pick<Types.TrelloMirrorCard, 'id'>
          )> }
        )>> }
      )> }
    )> }
  ) }
);

/**
 * __useTrelloBoardMirrorCardFilterQuery__
 *
 * To run a query within a React component, call `useTrelloBoardMirrorCardFilterQuery` and pass it any options that fit your needs.
 * When your component renders, `useTrelloBoardMirrorCardFilterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrelloBoardMirrorCardFilterQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTrelloBoardMirrorCardFilterQuery(
  baseOptions: TrelloQueryHookOptions<
    TrelloBoardMirrorCardFilterQuery,
    TrelloBoardMirrorCardFilterQueryVariables
  > &
    (
      | { variables: TrelloBoardMirrorCardFilterQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: TrelloBoardMirrorCardFilterDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    TrelloBoardMirrorCardFilterQuery,
    TrelloBoardMirrorCardFilterQueryVariables
  >(TrelloBoardMirrorCardFilterDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useTrelloBoardMirrorCardFilterLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    TrelloBoardMirrorCardFilterQuery,
    TrelloBoardMirrorCardFilterQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    TrelloBoardMirrorCardFilterQuery,
    TrelloBoardMirrorCardFilterQueryVariables
  >(TrelloBoardMirrorCardFilterDocument, options);
}
export function useTrelloBoardMirrorCardFilterSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        TrelloBoardMirrorCardFilterQuery,
        TrelloBoardMirrorCardFilterQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    TrelloBoardMirrorCardFilterQuery,
    TrelloBoardMirrorCardFilterQueryVariables
  >(TrelloBoardMirrorCardFilterDocument, options);
}
export type TrelloBoardMirrorCardFilterQueryHookResult = ReturnType<
  typeof useTrelloBoardMirrorCardFilterQuery
>;
export type TrelloBoardMirrorCardFilterLazyQueryHookResult = ReturnType<
  typeof useTrelloBoardMirrorCardFilterLazyQuery
>;
export type TrelloBoardMirrorCardFilterSuspenseQueryHookResult = ReturnType<
  typeof useTrelloBoardMirrorCardFilterSuspenseQuery
>;
export type TrelloBoardMirrorCardFilterQueryResult = Apollo.QueryResult<
  TrelloBoardMirrorCardFilterQuery,
  TrelloBoardMirrorCardFilterQueryVariables
>;
