import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const ListPricesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListPrices"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeUnconfirmed"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"product"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newSubscriptionListPriceQuotes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accountId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}}},{"kind":"Argument","name":{"kind":"Name","value":"includeUnconfirmed"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeUnconfirmed"}}},{"kind":"Argument","name":{"kind":"Name","value":"product"},"value":{"kind":"Variable","name":{"kind":"Name","value":"product"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"annual"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cBillableCollaborators"}},{"kind":"Field","name":{"kind":"Name","value":"cTeamMembers"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriptionProduct"}},{"kind":"Field","name":{"kind":"Name","value":"nSubtotal"}},{"kind":"Field","name":{"kind":"Name","value":"nSubtotalPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"nTax"}},{"kind":"Field","name":{"kind":"Name","value":"nTotal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"monthly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cBillableCollaborators"}},{"kind":"Field","name":{"kind":"Name","value":"cTeamMembers"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriptionProduct"}},{"kind":"Field","name":{"kind":"Name","value":"nSubtotal"}},{"kind":"Field","name":{"kind":"Name","value":"nSubtotalPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"nTax"}},{"kind":"Field","name":{"kind":"Name","value":"nTotal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nAnnualPercentageSavings"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subscriber"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"annual"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cBillableCollaborators"}},{"kind":"Field","name":{"kind":"Name","value":"cTeamMembers"}},{"kind":"Field","name":{"kind":"Name","value":"dtPricingAdjustmentExpiration"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriptionProduct"}},{"kind":"Field","name":{"kind":"Name","value":"nPricingAdjustment"}},{"kind":"Field","name":{"kind":"Name","value":"nSubtotal"}},{"kind":"Field","name":{"kind":"Name","value":"nSubtotalPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"nTax"}},{"kind":"Field","name":{"kind":"Name","value":"nTotal"}},{"kind":"Field","name":{"kind":"Name","value":"sTaxRegion"}}]}},{"kind":"Field","name":{"kind":"Name","value":"monthly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cBillableCollaborators"}},{"kind":"Field","name":{"kind":"Name","value":"cTeamMembers"}},{"kind":"Field","name":{"kind":"Name","value":"dtPricingAdjustmentExpiration"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriptionProduct"}},{"kind":"Field","name":{"kind":"Name","value":"nPricingAdjustment"}},{"kind":"Field","name":{"kind":"Name","value":"nSubtotal"}},{"kind":"Field","name":{"kind":"Name","value":"nSubtotalPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"nTax"}},{"kind":"Field","name":{"kind":"Name","value":"nTotal"}},{"kind":"Field","name":{"kind":"Name","value":"sTaxRegion"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nAnnualPercentageSavings"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"unconfirmed"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"ListPrices","document":ListPricesDocument}} as const;
export type ListPricesQueryVariables = Types.Exact<{
  accountId: Types.Scalars['ID']['input'];
  includeUnconfirmed?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  product: Types.Scalars['Int']['input'];
}>;


export type ListPricesQuery = (
  { __typename: 'Query' }
  & {
    newSubscriptionListPriceQuotes: (
      { __typename: 'ListPriceQuoteInfo' }
      & {
        base: (
          { __typename: 'PriceQuoteInfo' }
          & Pick<Types.PriceQuoteInfo, 'nAnnualPercentageSavings'>
          & {
            annual?: Types.Maybe<(
              { __typename: 'PriceQuote' }
              & Pick<
                Types.PriceQuote,
                | 'cBillableCollaborators'
                | 'cTeamMembers'
                | 'ixSubscriptionProduct'
                | 'nSubtotal'
                | 'nSubtotalPerUser'
                | 'nTax'
                | 'nTotal'
              >
            )>,
            monthly?: Types.Maybe<(
              { __typename: 'PriceQuote' }
              & Pick<
                Types.PriceQuote,
                | 'cBillableCollaborators'
                | 'cTeamMembers'
                | 'ixSubscriptionProduct'
                | 'nSubtotal'
                | 'nSubtotalPerUser'
                | 'nTax'
                | 'nTotal'
              >
            )>,
          }
        ),
        subscriber: (
          { __typename: 'PriceQuoteInfo' }
          & Pick<Types.PriceQuoteInfo, 'nAnnualPercentageSavings'>
          & {
            annual?: Types.Maybe<(
              { __typename: 'PriceQuote' }
              & Pick<
                Types.PriceQuote,
                | 'cBillableCollaborators'
                | 'cTeamMembers'
                | 'dtPricingAdjustmentExpiration'
                | 'ixSubscriptionProduct'
                | 'nPricingAdjustment'
                | 'nSubtotal'
                | 'nSubtotalPerUser'
                | 'nTax'
                | 'nTotal'
                | 'sTaxRegion'
              >
            )>,
            monthly?: Types.Maybe<(
              { __typename: 'PriceQuote' }
              & Pick<
                Types.PriceQuote,
                | 'cBillableCollaborators'
                | 'cTeamMembers'
                | 'dtPricingAdjustmentExpiration'
                | 'ixSubscriptionProduct'
                | 'nPricingAdjustment'
                | 'nSubtotal'
                | 'nSubtotalPerUser'
                | 'nTax'
                | 'nTotal'
                | 'sTaxRegion'
              >
            )>,
          }
        ),
      }
    ),
    organization?: Types.Maybe<(
      { __typename: 'Organization' }
      & Pick<Types.Organization, 'id'>
      & { memberships: Array<(
        { __typename: 'Organization_Membership' }
        & Pick<Types.Organization_Membership, 'id' | 'unconfirmed'>
      )> }
    )>,
  }
);

/**
 * __useListPricesQuery__
 *
 * To run a query within a React component, call `useListPricesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListPricesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListPricesQuery({
 *   variables: {
 *      accountId: // value for 'accountId'
 *      includeUnconfirmed: // value for 'includeUnconfirmed'
 *      product: // value for 'product'
 *   },
 * });
 */
export function useListPricesQuery(
  baseOptions: TrelloQueryHookOptions<
    ListPricesQuery,
    ListPricesQueryVariables
  > &
    (
      | { variables: ListPricesQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: ListPricesDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<ListPricesQuery, ListPricesQueryVariables>(
    ListPricesDocument,
    options,
  );
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useListPricesLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    ListPricesQuery,
    ListPricesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ListPricesQuery, ListPricesQueryVariables>(
    ListPricesDocument,
    options,
  );
}
export function useListPricesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<ListPricesQuery, ListPricesQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<ListPricesQuery, ListPricesQueryVariables>(
    ListPricesDocument,
    options,
  );
}
export type ListPricesQueryHookResult = ReturnType<typeof useListPricesQuery>;
export type ListPricesLazyQueryHookResult = ReturnType<
  typeof useListPricesLazyQuery
>;
export type ListPricesSuspenseQueryHookResult = ReturnType<
  typeof useListPricesSuspenseQuery
>;
export type ListPricesQueryResult = Apollo.QueryResult<
  ListPricesQuery,
  ListPricesQueryVariables
>;
