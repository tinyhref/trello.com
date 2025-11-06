import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const ChecklistCheckItemsPatcherDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ChecklistCheckItemsPatcher"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checklist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"checkItems"},"name":{"kind":"Name","value":"checkItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"checkItemsAll"},"name":{"kind":"Name","value":"checkItems"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"all"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"checkItemsDue"},"name":{"kind":"Name","value":"checkItems"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"due"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"ChecklistCheckItemsPatcher","document":ChecklistCheckItemsPatcherDocument}} as const;
export type ChecklistCheckItemsPatcherQueryVariables = Types.Exact<{
  parentId: Types.Scalars['ID']['input'];
}>;


export type ChecklistCheckItemsPatcherQuery = (
  { __typename: 'Query' }
  & { checklist?: Types.Maybe<(
    { __typename: 'Checklist' }
    & Pick<Types.Checklist, 'id'>
    & {
      checkItems: Array<(
        { __typename: 'CheckItem' }
        & Pick<Types.CheckItem, 'id'>
      )>,
      checkItemsAll: Array<(
        { __typename: 'CheckItem' }
        & Pick<Types.CheckItem, 'id'>
      )>,
      checkItemsDue: Array<(
        { __typename: 'CheckItem' }
        & Pick<Types.CheckItem, 'id'>
      )>,
    }
  )> }
);

/**
 * __useChecklistCheckItemsPatcherQuery__
 *
 * To run a query within a React component, call `useChecklistCheckItemsPatcherQuery` and pass it any options that fit your needs.
 * When your component renders, `useChecklistCheckItemsPatcherQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChecklistCheckItemsPatcherQuery({
 *   variables: {
 *      parentId: // value for 'parentId'
 *   },
 * });
 */
export function useChecklistCheckItemsPatcherQuery(
  baseOptions: Apollo.QueryHookOptions<
    ChecklistCheckItemsPatcherQuery,
    ChecklistCheckItemsPatcherQueryVariables
  > &
    (
      | { variables: ChecklistCheckItemsPatcherQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    ChecklistCheckItemsPatcherQuery,
    ChecklistCheckItemsPatcherQueryVariables
  >(ChecklistCheckItemsPatcherDocument, options);
}
export function useChecklistCheckItemsPatcherLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ChecklistCheckItemsPatcherQuery,
    ChecklistCheckItemsPatcherQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    ChecklistCheckItemsPatcherQuery,
    ChecklistCheckItemsPatcherQueryVariables
  >(ChecklistCheckItemsPatcherDocument, options);
}
export function useChecklistCheckItemsPatcherSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        ChecklistCheckItemsPatcherQuery,
        ChecklistCheckItemsPatcherQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    ChecklistCheckItemsPatcherQuery,
    ChecklistCheckItemsPatcherQueryVariables
  >(ChecklistCheckItemsPatcherDocument, options);
}
export type ChecklistCheckItemsPatcherQueryHookResult = ReturnType<
  typeof useChecklistCheckItemsPatcherQuery
>;
export type ChecklistCheckItemsPatcherLazyQueryHookResult = ReturnType<
  typeof useChecklistCheckItemsPatcherLazyQuery
>;
export type ChecklistCheckItemsPatcherSuspenseQueryHookResult = ReturnType<
  typeof useChecklistCheckItemsPatcherSuspenseQuery
>;
export type ChecklistCheckItemsPatcherQueryResult = Apollo.QueryResult<
  ChecklistCheckItemsPatcherQuery,
  ChecklistCheckItemsPatcherQueryVariables
>;
