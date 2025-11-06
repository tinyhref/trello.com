import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const TrelloPlannerCreateFieldsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TrelloPlannerCreateFields"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloMember","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"planner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"enabledCalendars"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryAccountId"}}]}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"TrelloPlannerCreateFields","document":TrelloPlannerCreateFieldsDocument}} as const;
export type TrelloPlannerCreateFieldsQueryVariables = Types.Exact<{
  nodeId: Types.Scalars['ID']['input'];
}>;


export type TrelloPlannerCreateFieldsQuery = (
  { __typename: 'Query' }
  & { trello: (
    { __typename: 'TrelloQueryApi' }
    & { member?: Types.Maybe<(
      { __typename: 'TrelloMember' }
      & Pick<Types.TrelloMember, 'id'>
      & { planner?: Types.Maybe<(
        { __typename: 'TrelloPlanner' }
        & Pick<Types.TrelloPlanner, 'id' | 'primaryAccountId'>
        & { accounts?: Types.Maybe<(
          { __typename: 'TrelloPlannerCalendarAccountConnection' }
          & { edges?: Types.Maybe<Array<(
            { __typename: 'TrelloPlannerCalendarAccountEdge' }
            & { node?: Types.Maybe<(
              { __typename: 'TrelloPlannerCalendarAccount' }
              & Pick<Types.TrelloPlannerCalendarAccount, 'id' | 'displayName'>
              & { enabledCalendars?: Types.Maybe<(
                { __typename: 'TrelloPlannerCalendarConnection' }
                & { edges?: Types.Maybe<Array<(
                  { __typename: 'TrelloPlannerCalendarEdge' }
                  & { node?: Types.Maybe<(
                    { __typename: 'TrelloPlannerCalendar' }
                    & Pick<Types.TrelloPlannerCalendar, 'id' | 'isPrimary'>
                  )> }
                )>> }
              )> }
            )> }
          )>> }
        )> }
      )> }
    )> }
  ) }
);

/**
 * __useTrelloPlannerCreateFieldsQuery__
 *
 * To run a query within a React component, call `useTrelloPlannerCreateFieldsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTrelloPlannerCreateFieldsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrelloPlannerCreateFieldsQuery({
 *   variables: {
 *      nodeId: // value for 'nodeId'
 *   },
 * });
 */
export function useTrelloPlannerCreateFieldsQuery(
  baseOptions: TrelloQueryHookOptions<
    TrelloPlannerCreateFieldsQuery,
    TrelloPlannerCreateFieldsQueryVariables
  > &
    (
      | { variables: TrelloPlannerCreateFieldsQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: TrelloPlannerCreateFieldsDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    TrelloPlannerCreateFieldsQuery,
    TrelloPlannerCreateFieldsQueryVariables
  >(TrelloPlannerCreateFieldsDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useTrelloPlannerCreateFieldsLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    TrelloPlannerCreateFieldsQuery,
    TrelloPlannerCreateFieldsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    TrelloPlannerCreateFieldsQuery,
    TrelloPlannerCreateFieldsQueryVariables
  >(TrelloPlannerCreateFieldsDocument, options);
}
export function useTrelloPlannerCreateFieldsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        TrelloPlannerCreateFieldsQuery,
        TrelloPlannerCreateFieldsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    TrelloPlannerCreateFieldsQuery,
    TrelloPlannerCreateFieldsQueryVariables
  >(TrelloPlannerCreateFieldsDocument, options);
}
export type TrelloPlannerCreateFieldsQueryHookResult = ReturnType<
  typeof useTrelloPlannerCreateFieldsQuery
>;
export type TrelloPlannerCreateFieldsLazyQueryHookResult = ReturnType<
  typeof useTrelloPlannerCreateFieldsLazyQuery
>;
export type TrelloPlannerCreateFieldsSuspenseQueryHookResult = ReturnType<
  typeof useTrelloPlannerCreateFieldsSuspenseQuery
>;
export type TrelloPlannerCreateFieldsQueryResult = Apollo.QueryResult<
  TrelloPlannerCreateFieldsQuery,
  TrelloPlannerCreateFieldsQueryVariables
>;
