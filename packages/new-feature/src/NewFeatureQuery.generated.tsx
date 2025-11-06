import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const NewFeatureDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NewFeature"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"NewFeature","document":NewFeatureDocument}} as const;
export type NewFeatureQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID']['input'];
}>;


export type NewFeatureQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed'>
  )> }
);

/**
 * __useNewFeatureQuery__
 *
 * To run a query within a React component, call `useNewFeatureQuery` and pass it any options that fit your needs.
 * When your component renders, `useNewFeatureQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewFeatureQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useNewFeatureQuery(
  baseOptions: TrelloQueryHookOptions<
    NewFeatureQuery,
    NewFeatureQueryVariables
  > &
    (
      | { variables: NewFeatureQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: NewFeatureDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<NewFeatureQuery, NewFeatureQueryVariables>(
    NewFeatureDocument,
    options,
  );
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useNewFeatureLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    NewFeatureQuery,
    NewFeatureQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<NewFeatureQuery, NewFeatureQueryVariables>(
    NewFeatureDocument,
    options,
  );
}
export function useNewFeatureSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<NewFeatureQuery, NewFeatureQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<NewFeatureQuery, NewFeatureQueryVariables>(
    NewFeatureDocument,
    options,
  );
}
export type NewFeatureQueryHookResult = ReturnType<typeof useNewFeatureQuery>;
export type NewFeatureLazyQueryHookResult = ReturnType<
  typeof useNewFeatureLazyQuery
>;
export type NewFeatureSuspenseQueryHookResult = ReturnType<
  typeof useNewFeatureSuspenseQuery
>;
export type NewFeatureQueryResult = Apollo.QueryResult<
  NewFeatureQuery,
  NewFeatureQueryVariables
>;
