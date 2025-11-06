import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const MirrorCardAccessRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MirrorCardAccessRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"modelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"modelType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestAccessModelType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"modelId"}}},{"kind":"Argument","name":{"kind":"Name","value":"modelType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"modelType"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allowed"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"MirrorCardAccessRequest","document":MirrorCardAccessRequestDocument}} as const;
export type MirrorCardAccessRequestQueryVariables = Types.Exact<{
  modelId: Types.Scalars['ID']['input'];
  modelType: Types.RequestAccessModelType;
}>;


export type MirrorCardAccessRequestQuery = (
  { __typename: 'Query' }
  & { accessRequest: (
    { __typename: 'AccessRequest' }
    & Pick<Types.AccessRequest, 'allowed' | 'reason'>
  ) }
);

/**
 * __useMirrorCardAccessRequestQuery__
 *
 * To run a query within a React component, call `useMirrorCardAccessRequestQuery` and pass it any options that fit your needs.
 * When your component renders, `useMirrorCardAccessRequestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMirrorCardAccessRequestQuery({
 *   variables: {
 *      modelId: // value for 'modelId'
 *      modelType: // value for 'modelType'
 *   },
 * });
 */
export function useMirrorCardAccessRequestQuery(
  baseOptions: TrelloQueryHookOptions<
    MirrorCardAccessRequestQuery,
    MirrorCardAccessRequestQueryVariables
  > &
    (
      | { variables: MirrorCardAccessRequestQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: MirrorCardAccessRequestDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    MirrorCardAccessRequestQuery,
    MirrorCardAccessRequestQueryVariables
  >(MirrorCardAccessRequestDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useMirrorCardAccessRequestLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    MirrorCardAccessRequestQuery,
    MirrorCardAccessRequestQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    MirrorCardAccessRequestQuery,
    MirrorCardAccessRequestQueryVariables
  >(MirrorCardAccessRequestDocument, options);
}
export function useMirrorCardAccessRequestSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        MirrorCardAccessRequestQuery,
        MirrorCardAccessRequestQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    MirrorCardAccessRequestQuery,
    MirrorCardAccessRequestQueryVariables
  >(MirrorCardAccessRequestDocument, options);
}
export type MirrorCardAccessRequestQueryHookResult = ReturnType<
  typeof useMirrorCardAccessRequestQuery
>;
export type MirrorCardAccessRequestLazyQueryHookResult = ReturnType<
  typeof useMirrorCardAccessRequestLazyQuery
>;
export type MirrorCardAccessRequestSuspenseQueryHookResult = ReturnType<
  typeof useMirrorCardAccessRequestSuspenseQuery
>;
export type MirrorCardAccessRequestQueryResult = Apollo.QueryResult<
  MirrorCardAccessRequestQuery,
  MirrorCardAccessRequestQueryVariables
>;
