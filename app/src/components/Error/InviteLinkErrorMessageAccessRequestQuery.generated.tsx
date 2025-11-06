import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const InviteLinkErrorMessageAccessRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InviteLinkErrorMessageAccessRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"modelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"modelType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestAccessModelType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"modelId"}}},{"kind":"Argument","name":{"kind":"Name","value":"modelType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"modelType"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allowed"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"InviteLinkErrorMessageAccessRequest","document":InviteLinkErrorMessageAccessRequestDocument}} as const;
export type InviteLinkErrorMessageAccessRequestQueryVariables = Types.Exact<{
  modelId: Types.Scalars['ID']['input'];
  modelType: Types.RequestAccessModelType;
}>;


export type InviteLinkErrorMessageAccessRequestQuery = (
  { __typename: 'Query' }
  & { accessRequest: (
    { __typename: 'AccessRequest' }
    & Pick<Types.AccessRequest, 'allowed' | 'reason'>
  ) }
);

/**
 * __useInviteLinkErrorMessageAccessRequestQuery__
 *
 * To run a query within a React component, call `useInviteLinkErrorMessageAccessRequestQuery` and pass it any options that fit your needs.
 * When your component renders, `useInviteLinkErrorMessageAccessRequestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInviteLinkErrorMessageAccessRequestQuery({
 *   variables: {
 *      modelId: // value for 'modelId'
 *      modelType: // value for 'modelType'
 *   },
 * });
 */
export function useInviteLinkErrorMessageAccessRequestQuery(
  baseOptions: TrelloQueryHookOptions<
    InviteLinkErrorMessageAccessRequestQuery,
    InviteLinkErrorMessageAccessRequestQueryVariables
  > &
    (
      | {
          variables: InviteLinkErrorMessageAccessRequestQueryVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: InviteLinkErrorMessageAccessRequestDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    InviteLinkErrorMessageAccessRequestQuery,
    InviteLinkErrorMessageAccessRequestQueryVariables
  >(InviteLinkErrorMessageAccessRequestDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useInviteLinkErrorMessageAccessRequestLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    InviteLinkErrorMessageAccessRequestQuery,
    InviteLinkErrorMessageAccessRequestQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    InviteLinkErrorMessageAccessRequestQuery,
    InviteLinkErrorMessageAccessRequestQueryVariables
  >(InviteLinkErrorMessageAccessRequestDocument, options);
}
export function useInviteLinkErrorMessageAccessRequestSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        InviteLinkErrorMessageAccessRequestQuery,
        InviteLinkErrorMessageAccessRequestQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    InviteLinkErrorMessageAccessRequestQuery,
    InviteLinkErrorMessageAccessRequestQueryVariables
  >(InviteLinkErrorMessageAccessRequestDocument, options);
}
export type InviteLinkErrorMessageAccessRequestQueryHookResult = ReturnType<
  typeof useInviteLinkErrorMessageAccessRequestQuery
>;
export type InviteLinkErrorMessageAccessRequestLazyQueryHookResult = ReturnType<
  typeof useInviteLinkErrorMessageAccessRequestLazyQuery
>;
export type InviteLinkErrorMessageAccessRequestSuspenseQueryHookResult =
  ReturnType<typeof useInviteLinkErrorMessageAccessRequestSuspenseQuery>;
export type InviteLinkErrorMessageAccessRequestQueryResult = Apollo.QueryResult<
  InviteLinkErrorMessageAccessRequestQuery,
  InviteLinkErrorMessageAccessRequestQueryVariables
>;
