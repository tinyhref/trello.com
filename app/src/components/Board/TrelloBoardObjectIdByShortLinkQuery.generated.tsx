import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const TrelloBoardObjectIdByShortLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TrelloBoardObjectIdByShortLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"shortLink"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TrelloShortLink"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boardByShortLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"shortLink"},"value":{"kind":"Variable","name":{"kind":"Name","value":"shortLink"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloBoard","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"TrelloBoardObjectIdByShortLink","document":TrelloBoardObjectIdByShortLinkDocument}} as const;
export type TrelloBoardObjectIdByShortLinkQueryVariables = Types.Exact<{
  shortLink: Types.Scalars['TrelloShortLink']['input'];
}>;


export type TrelloBoardObjectIdByShortLinkQuery = (
  { __typename: 'Query' }
  & { trello: (
    { __typename: 'TrelloQueryApi' }
    & { boardByShortLink?: Types.Maybe<(
      { __typename: 'TrelloBoard' }
      & Pick<Types.TrelloBoard, 'id' | 'objectId'>
    )> }
  ) }
);

/**
 * __useTrelloBoardObjectIdByShortLinkQuery__
 *
 * To run a query within a React component, call `useTrelloBoardObjectIdByShortLinkQuery` and pass it any options that fit your needs.
 * When your component renders, `useTrelloBoardObjectIdByShortLinkQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrelloBoardObjectIdByShortLinkQuery({
 *   variables: {
 *      shortLink: // value for 'shortLink'
 *   },
 * });
 */
export function useTrelloBoardObjectIdByShortLinkQuery(
  baseOptions: TrelloQueryHookOptions<
    TrelloBoardObjectIdByShortLinkQuery,
    TrelloBoardObjectIdByShortLinkQueryVariables
  > &
    (
      | {
          variables: TrelloBoardObjectIdByShortLinkQueryVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: TrelloBoardObjectIdByShortLinkDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    TrelloBoardObjectIdByShortLinkQuery,
    TrelloBoardObjectIdByShortLinkQueryVariables
  >(TrelloBoardObjectIdByShortLinkDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useTrelloBoardObjectIdByShortLinkLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    TrelloBoardObjectIdByShortLinkQuery,
    TrelloBoardObjectIdByShortLinkQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    TrelloBoardObjectIdByShortLinkQuery,
    TrelloBoardObjectIdByShortLinkQueryVariables
  >(TrelloBoardObjectIdByShortLinkDocument, options);
}
export function useTrelloBoardObjectIdByShortLinkSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        TrelloBoardObjectIdByShortLinkQuery,
        TrelloBoardObjectIdByShortLinkQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    TrelloBoardObjectIdByShortLinkQuery,
    TrelloBoardObjectIdByShortLinkQueryVariables
  >(TrelloBoardObjectIdByShortLinkDocument, options);
}
export type TrelloBoardObjectIdByShortLinkQueryHookResult = ReturnType<
  typeof useTrelloBoardObjectIdByShortLinkQuery
>;
export type TrelloBoardObjectIdByShortLinkLazyQueryHookResult = ReturnType<
  typeof useTrelloBoardObjectIdByShortLinkLazyQuery
>;
export type TrelloBoardObjectIdByShortLinkSuspenseQueryHookResult = ReturnType<
  typeof useTrelloBoardObjectIdByShortLinkSuspenseQuery
>;
export type TrelloBoardObjectIdByShortLinkQueryResult = Apollo.QueryResult<
  TrelloBoardObjectIdByShortLinkQuery,
  TrelloBoardObjectIdByShortLinkQueryVariables
>;
