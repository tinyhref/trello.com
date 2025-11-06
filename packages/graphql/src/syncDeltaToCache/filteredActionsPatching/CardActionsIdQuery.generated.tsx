import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const CardActionsIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CardActionsId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Action_Type"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cardActions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"CardActionsId","document":CardActionsIdDocument}} as const;
export type CardActionsIdQueryVariables = Types.Exact<{
  cardId: Types.Scalars['ID']['input'];
  filter: Array<Types.Action_Type> | Types.Action_Type;
  limit: Types.Scalars['Int']['input'];
}>;


export type CardActionsIdQuery = (
  { __typename: 'Query' }
  & { cardActions: Array<(
    { __typename: 'Action' }
    & Pick<Types.Action, 'id'>
  )> }
);

/**
 * __useCardActionsIdQuery__
 *
 * To run a query within a React component, call `useCardActionsIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useCardActionsIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCardActionsIdQuery({
 *   variables: {
 *      cardId: // value for 'cardId'
 *      filter: // value for 'filter'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useCardActionsIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    CardActionsIdQuery,
    CardActionsIdQueryVariables
  > &
    (
      | { variables: CardActionsIdQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CardActionsIdQuery, CardActionsIdQueryVariables>(
    CardActionsIdDocument,
    options,
  );
}
export function useCardActionsIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    CardActionsIdQuery,
    CardActionsIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CardActionsIdQuery, CardActionsIdQueryVariables>(
    CardActionsIdDocument,
    options,
  );
}
export function useCardActionsIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        CardActionsIdQuery,
        CardActionsIdQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    CardActionsIdQuery,
    CardActionsIdQueryVariables
  >(CardActionsIdDocument, options);
}
export type CardActionsIdQueryHookResult = ReturnType<
  typeof useCardActionsIdQuery
>;
export type CardActionsIdLazyQueryHookResult = ReturnType<
  typeof useCardActionsIdLazyQuery
>;
export type CardActionsIdSuspenseQueryHookResult = ReturnType<
  typeof useCardActionsIdSuspenseQuery
>;
export type CardActionsIdQueryResult = Apollo.QueryResult<
  CardActionsIdQuery,
  CardActionsIdQueryVariables
>;
