import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const OrganizationBoardsPatcherDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrganizationBoardsPatcher"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"boardsClosed"},"name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"closed"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"boardsOpen"},"name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"OrganizationBoardsPatcher","document":OrganizationBoardsPatcherDocument}} as const;
export type OrganizationBoardsPatcherQueryVariables = Types.Exact<{
  parentId: Types.Scalars['ID']['input'];
}>;


export type OrganizationBoardsPatcherQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id'>
    & {
      boards: Array<(
        { __typename: 'Board' }
        & Pick<Types.Board, 'id'>
      )>,
      boardsClosed: Array<(
        { __typename: 'Board' }
        & Pick<Types.Board, 'id'>
      )>,
      boardsOpen: Array<(
        { __typename: 'Board' }
        & Pick<Types.Board, 'id'>
      )>,
    }
  )> }
);

/**
 * __useOrganizationBoardsPatcherQuery__
 *
 * To run a query within a React component, call `useOrganizationBoardsPatcherQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationBoardsPatcherQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationBoardsPatcherQuery({
 *   variables: {
 *      parentId: // value for 'parentId'
 *   },
 * });
 */
export function useOrganizationBoardsPatcherQuery(
  baseOptions: Apollo.QueryHookOptions<
    OrganizationBoardsPatcherQuery,
    OrganizationBoardsPatcherQueryVariables
  > &
    (
      | { variables: OrganizationBoardsPatcherQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    OrganizationBoardsPatcherQuery,
    OrganizationBoardsPatcherQueryVariables
  >(OrganizationBoardsPatcherDocument, options);
}
export function useOrganizationBoardsPatcherLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OrganizationBoardsPatcherQuery,
    OrganizationBoardsPatcherQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    OrganizationBoardsPatcherQuery,
    OrganizationBoardsPatcherQueryVariables
  >(OrganizationBoardsPatcherDocument, options);
}
export function useOrganizationBoardsPatcherSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        OrganizationBoardsPatcherQuery,
        OrganizationBoardsPatcherQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    OrganizationBoardsPatcherQuery,
    OrganizationBoardsPatcherQueryVariables
  >(OrganizationBoardsPatcherDocument, options);
}
export type OrganizationBoardsPatcherQueryHookResult = ReturnType<
  typeof useOrganizationBoardsPatcherQuery
>;
export type OrganizationBoardsPatcherLazyQueryHookResult = ReturnType<
  typeof useOrganizationBoardsPatcherLazyQuery
>;
export type OrganizationBoardsPatcherSuspenseQueryHookResult = ReturnType<
  typeof useOrganizationBoardsPatcherSuspenseQuery
>;
export type OrganizationBoardsPatcherQueryResult = Apollo.QueryResult<
  OrganizationBoardsPatcherQuery,
  OrganizationBoardsPatcherQueryVariables
>;
