import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const PersonalWorkspacePremiumFeaturesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PersonalWorkspacePremiumFeatures"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nodeId"}},{"kind":"Field","name":{"kind":"Name","value":"offering"}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}}]}},{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workspace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloWorkspace","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"offering"}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"PersonalWorkspacePremiumFeatures","document":PersonalWorkspacePremiumFeaturesDocument}} as const;
export type PersonalWorkspacePremiumFeaturesQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  nodeId: Types.Scalars['ID']['input'];
}>;


export type PersonalWorkspacePremiumFeaturesQuery = (
  { __typename: 'Query' }
  & {
    organization?: Types.Maybe<(
      { __typename: 'Organization' }
      & Pick<
        Types.Organization,
        | 'id'
        | 'nodeId'
        | 'offering'
        | 'premiumFeatures'
      >
    )>,
    trello: (
      { __typename: 'TrelloQueryApi' }
      & { workspace?: Types.Maybe<(
        { __typename: 'TrelloWorkspace' }
        & Pick<
          Types.TrelloWorkspace,
          | 'id'
          | 'objectId'
          | 'offering'
          | 'premiumFeatures'
        >
      )> }
    ),
  }
);

/**
 * __usePersonalWorkspacePremiumFeaturesQuery__
 *
 * To run a query within a React component, call `usePersonalWorkspacePremiumFeaturesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePersonalWorkspacePremiumFeaturesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePersonalWorkspacePremiumFeaturesQuery({
 *   variables: {
 *      id: // value for 'id'
 *      nodeId: // value for 'nodeId'
 *   },
 * });
 */
export function usePersonalWorkspacePremiumFeaturesQuery(
  baseOptions: TrelloQueryHookOptions<
    PersonalWorkspacePremiumFeaturesQuery,
    PersonalWorkspacePremiumFeaturesQueryVariables
  > &
    (
      | {
          variables: PersonalWorkspacePremiumFeaturesQueryVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: PersonalWorkspacePremiumFeaturesDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    PersonalWorkspacePremiumFeaturesQuery,
    PersonalWorkspacePremiumFeaturesQueryVariables
  >(PersonalWorkspacePremiumFeaturesDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function usePersonalWorkspacePremiumFeaturesLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    PersonalWorkspacePremiumFeaturesQuery,
    PersonalWorkspacePremiumFeaturesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    PersonalWorkspacePremiumFeaturesQuery,
    PersonalWorkspacePremiumFeaturesQueryVariables
  >(PersonalWorkspacePremiumFeaturesDocument, options);
}
export function usePersonalWorkspacePremiumFeaturesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        PersonalWorkspacePremiumFeaturesQuery,
        PersonalWorkspacePremiumFeaturesQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    PersonalWorkspacePremiumFeaturesQuery,
    PersonalWorkspacePremiumFeaturesQueryVariables
  >(PersonalWorkspacePremiumFeaturesDocument, options);
}
export type PersonalWorkspacePremiumFeaturesQueryHookResult = ReturnType<
  typeof usePersonalWorkspacePremiumFeaturesQuery
>;
export type PersonalWorkspacePremiumFeaturesLazyQueryHookResult = ReturnType<
  typeof usePersonalWorkspacePremiumFeaturesLazyQuery
>;
export type PersonalWorkspacePremiumFeaturesSuspenseQueryHookResult =
  ReturnType<typeof usePersonalWorkspacePremiumFeaturesSuspenseQuery>;
export type PersonalWorkspacePremiumFeaturesQueryResult = Apollo.QueryResult<
  PersonalWorkspacePremiumFeaturesQuery,
  PersonalWorkspacePremiumFeaturesQueryVariables
>;
