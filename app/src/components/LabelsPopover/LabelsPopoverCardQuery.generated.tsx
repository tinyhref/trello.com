import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const LabelsPopoverCardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LabelsPopoverCard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idList"}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"LabelsPopoverCard","document":LabelsPopoverCardDocument}} as const;
export type LabelsPopoverCardQueryVariables = Types.Exact<{
  idCard: Types.Scalars['ID']['input'];
}>;


export type LabelsPopoverCardQuery = (
  { __typename: 'Query' }
  & { card?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'idList'>
    & { labels: Array<(
      { __typename: 'Label' }
      & Pick<Types.Label, 'id' | 'color' | 'name'>
    )> }
  )> }
);

/**
 * __useLabelsPopoverCardQuery__
 *
 * To run a query within a React component, call `useLabelsPopoverCardQuery` and pass it any options that fit your needs.
 * When your component renders, `useLabelsPopoverCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLabelsPopoverCardQuery({
 *   variables: {
 *      idCard: // value for 'idCard'
 *   },
 * });
 */
export function useLabelsPopoverCardQuery(
  baseOptions: TrelloQueryHookOptions<
    LabelsPopoverCardQuery,
    LabelsPopoverCardQueryVariables
  > &
    (
      | { variables: LabelsPopoverCardQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: LabelsPopoverCardDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    LabelsPopoverCardQuery,
    LabelsPopoverCardQueryVariables
  >(LabelsPopoverCardDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useLabelsPopoverCardLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    LabelsPopoverCardQuery,
    LabelsPopoverCardQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    LabelsPopoverCardQuery,
    LabelsPopoverCardQueryVariables
  >(LabelsPopoverCardDocument, options);
}
export function useLabelsPopoverCardSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        LabelsPopoverCardQuery,
        LabelsPopoverCardQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    LabelsPopoverCardQuery,
    LabelsPopoverCardQueryVariables
  >(LabelsPopoverCardDocument, options);
}
export type LabelsPopoverCardQueryHookResult = ReturnType<
  typeof useLabelsPopoverCardQuery
>;
export type LabelsPopoverCardLazyQueryHookResult = ReturnType<
  typeof useLabelsPopoverCardLazyQuery
>;
export type LabelsPopoverCardSuspenseQueryHookResult = ReturnType<
  typeof useLabelsPopoverCardSuspenseQuery
>;
export type LabelsPopoverCardQueryResult = Apollo.QueryResult<
  LabelsPopoverCardQuery,
  LabelsPopoverCardQueryVariables
>;
