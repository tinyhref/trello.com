import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const CardChecklistsPatcherDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CardChecklistsPatcher"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"checklists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"checklistsAll"},"name":{"kind":"Name","value":"checklists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"all"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"checklistsDue"},"name":{"kind":"Name","value":"checklists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"due"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"CardChecklistsPatcher","document":CardChecklistsPatcherDocument}} as const;
export type CardChecklistsPatcherQueryVariables = Types.Exact<{
  parentId: Types.Scalars['ID']['input'];
}>;


export type CardChecklistsPatcherQuery = (
  { __typename: 'Query' }
  & { card?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id'>
    & {
      checklists: Array<(
        { __typename: 'Checklist' }
        & Pick<Types.Checklist, 'id'>
      )>,
      checklistsAll: Array<(
        { __typename: 'Checklist' }
        & Pick<Types.Checklist, 'id'>
      )>,
      checklistsDue: Array<(
        { __typename: 'Checklist' }
        & Pick<Types.Checklist, 'id'>
      )>,
    }
  )> }
);

/**
 * __useCardChecklistsPatcherQuery__
 *
 * To run a query within a React component, call `useCardChecklistsPatcherQuery` and pass it any options that fit your needs.
 * When your component renders, `useCardChecklistsPatcherQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCardChecklistsPatcherQuery({
 *   variables: {
 *      parentId: // value for 'parentId'
 *   },
 * });
 */
export function useCardChecklistsPatcherQuery(
  baseOptions: Apollo.QueryHookOptions<
    CardChecklistsPatcherQuery,
    CardChecklistsPatcherQueryVariables
  > &
    (
      | { variables: CardChecklistsPatcherQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    CardChecklistsPatcherQuery,
    CardChecklistsPatcherQueryVariables
  >(CardChecklistsPatcherDocument, options);
}
export function useCardChecklistsPatcherLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    CardChecklistsPatcherQuery,
    CardChecklistsPatcherQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    CardChecklistsPatcherQuery,
    CardChecklistsPatcherQueryVariables
  >(CardChecklistsPatcherDocument, options);
}
export function useCardChecklistsPatcherSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        CardChecklistsPatcherQuery,
        CardChecklistsPatcherQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    CardChecklistsPatcherQuery,
    CardChecklistsPatcherQueryVariables
  >(CardChecklistsPatcherDocument, options);
}
export type CardChecklistsPatcherQueryHookResult = ReturnType<
  typeof useCardChecklistsPatcherQuery
>;
export type CardChecklistsPatcherLazyQueryHookResult = ReturnType<
  typeof useCardChecklistsPatcherLazyQuery
>;
export type CardChecklistsPatcherSuspenseQueryHookResult = ReturnType<
  typeof useCardChecklistsPatcherSuspenseQuery
>;
export type CardChecklistsPatcherQueryResult = Apollo.QueryResult<
  CardChecklistsPatcherQuery,
  CardChecklistsPatcherQueryVariables
>;
