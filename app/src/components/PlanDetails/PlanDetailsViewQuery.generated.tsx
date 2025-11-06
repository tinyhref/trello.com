import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const PlanDetailsViewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PlanDetailsView"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paidAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateFirstSubscription"}},{"kind":"Field","name":{"kind":"Name","value":"expirationDates"}},{"kind":"Field","name":{"kind":"Name","value":"previousSubscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dtCancelled"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriptionProductId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"standing"}},{"kind":"Field","name":{"kind":"Name","value":"trialExpiration"}},{"kind":"Field","name":{"kind":"Name","value":"trialType"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"PlanDetailsView","document":PlanDetailsViewDocument}} as const;
export type PlanDetailsViewQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID']['input'];
  orgId: Types.Scalars['ID']['input'];
}>;


export type PlanDetailsViewQuery = (
  { __typename: 'Query' }
  & {
    member?: Types.Maybe<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'id'>
    )>,
    organization?: Types.Maybe<(
      { __typename: 'Organization' }
      & Pick<Types.Organization, 'id'>
      & { paidAccount?: Types.Maybe<(
        { __typename: 'PaidAccount' }
        & Pick<
          Types.PaidAccount,
          | 'dateFirstSubscription'
          | 'expirationDates'
          | 'products'
          | 'standing'
          | 'trialExpiration'
          | 'trialType'
        >
        & { previousSubscription?: Types.Maybe<(
          { __typename: 'PreviousSubscription' }
          & Pick<Types.PreviousSubscription, 'dtCancelled' | 'ixSubscriptionProductId'>
        )> }
      )> }
    )>,
  }
);

/**
 * __usePlanDetailsViewQuery__
 *
 * To run a query within a React component, call `usePlanDetailsViewQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlanDetailsViewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlanDetailsViewQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function usePlanDetailsViewQuery(
  baseOptions: TrelloQueryHookOptions<
    PlanDetailsViewQuery,
    PlanDetailsViewQueryVariables
  > &
    (
      | { variables: PlanDetailsViewQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: PlanDetailsViewDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    PlanDetailsViewQuery,
    PlanDetailsViewQueryVariables
  >(PlanDetailsViewDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function usePlanDetailsViewLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    PlanDetailsViewQuery,
    PlanDetailsViewQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    PlanDetailsViewQuery,
    PlanDetailsViewQueryVariables
  >(PlanDetailsViewDocument, options);
}
export function usePlanDetailsViewSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        PlanDetailsViewQuery,
        PlanDetailsViewQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    PlanDetailsViewQuery,
    PlanDetailsViewQueryVariables
  >(PlanDetailsViewDocument, options);
}
export type PlanDetailsViewQueryHookResult = ReturnType<
  typeof usePlanDetailsViewQuery
>;
export type PlanDetailsViewLazyQueryHookResult = ReturnType<
  typeof usePlanDetailsViewLazyQuery
>;
export type PlanDetailsViewSuspenseQueryHookResult = ReturnType<
  typeof usePlanDetailsViewSuspenseQuery
>;
export type PlanDetailsViewQueryResult = Apollo.QueryResult<
  PlanDetailsViewQuery,
  PlanDetailsViewQueryVariables
>;
