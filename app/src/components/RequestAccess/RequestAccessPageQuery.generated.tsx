import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const RequestAccessPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RequestAccessPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"modelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"modelType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestAccessModelType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"modelId"}}},{"kind":"Argument","name":{"kind":"Name","value":"modelType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"modelType"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allowed"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}},{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"confirmed"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"logins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"RequestAccessPage","document":RequestAccessPageDocument}} as const;
export type RequestAccessPageQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID']['input'];
  modelId: Types.Scalars['ID']['input'];
  modelType: Types.RequestAccessModelType;
}>;


export type RequestAccessPageQuery = (
  { __typename: 'Query' }
  & {
    accessRequest: (
      { __typename: 'AccessRequest' }
      & Pick<Types.AccessRequest, 'allowed' | 'reason'>
    ),
    member?: Types.Maybe<(
      { __typename: 'Member' }
      & Pick<
        Types.Member,
        | 'id'
        | 'confirmed'
        | 'email'
        | 'fullName'
      >
      & { logins: Array<(
        { __typename: 'Login' }
        & Pick<Types.Login, 'id' | 'primary'>
      )> }
    )>,
  }
);

/**
 * __useRequestAccessPageQuery__
 *
 * To run a query within a React component, call `useRequestAccessPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useRequestAccessPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRequestAccessPageQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      modelId: // value for 'modelId'
 *      modelType: // value for 'modelType'
 *   },
 * });
 */
export function useRequestAccessPageQuery(
  baseOptions: TrelloQueryHookOptions<
    RequestAccessPageQuery,
    RequestAccessPageQueryVariables
  > &
    (
      | { variables: RequestAccessPageQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: RequestAccessPageDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    RequestAccessPageQuery,
    RequestAccessPageQueryVariables
  >(RequestAccessPageDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useRequestAccessPageLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    RequestAccessPageQuery,
    RequestAccessPageQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    RequestAccessPageQuery,
    RequestAccessPageQueryVariables
  >(RequestAccessPageDocument, options);
}
export function useRequestAccessPageSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        RequestAccessPageQuery,
        RequestAccessPageQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    RequestAccessPageQuery,
    RequestAccessPageQueryVariables
  >(RequestAccessPageDocument, options);
}
export type RequestAccessPageQueryHookResult = ReturnType<
  typeof useRequestAccessPageQuery
>;
export type RequestAccessPageLazyQueryHookResult = ReturnType<
  typeof useRequestAccessPageLazyQuery
>;
export type RequestAccessPageSuspenseQueryHookResult = ReturnType<
  typeof useRequestAccessPageSuspenseQuery
>;
export type RequestAccessPageQueryResult = Apollo.QueryResult<
  RequestAccessPageQuery,
  RequestAccessPageQueryVariables
>;
