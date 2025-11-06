import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const ErrorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Error"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"Error","document":ErrorDocument}} as const;
export type ErrorQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ErrorQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'email' | 'fullName'>
  )> }
);

/**
 * __useErrorQuery__
 *
 * To run a query within a React component, call `useErrorQuery` and pass it any options that fit your needs.
 * When your component renders, `useErrorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useErrorQuery({
 *   variables: {
 *   },
 * });
 */
export function useErrorQuery(
  baseOptions?: TrelloQueryHookOptions<ErrorQuery, ErrorQueryVariables>,
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: ErrorDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<ErrorQuery, ErrorQueryVariables>(
    ErrorDocument,
    options,
  );
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useErrorLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<ErrorQuery, ErrorQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ErrorQuery, ErrorQueryVariables>(
    ErrorDocument,
    options,
  );
}
export function useErrorSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<ErrorQuery, ErrorQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<ErrorQuery, ErrorQueryVariables>(
    ErrorDocument,
    options,
  );
}
export type ErrorQueryHookResult = ReturnType<typeof useErrorQuery>;
export type ErrorLazyQueryHookResult = ReturnType<typeof useErrorLazyQuery>;
export type ErrorSuspenseQueryHookResult = ReturnType<
  typeof useErrorSuspenseQuery
>;
export type ErrorQueryResult = Apollo.QueryResult<
  ErrorQuery,
  ErrorQueryVariables
>;
