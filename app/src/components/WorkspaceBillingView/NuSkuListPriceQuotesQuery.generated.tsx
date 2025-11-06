import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const NuSkuListPriceQuotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NuSkuListPriceQuotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeUnconfirmed"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"product"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newSubscriptionListPriceQuotes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accountId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}},{"kind":"Argument","name":{"kind":"Name","value":"includeUnconfirmed"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeUnconfirmed"}}},{"kind":"Argument","name":{"kind":"Name","value":"product"},"value":{"kind":"Variable","name":{"kind":"Name","value":"product"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"base"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"annual"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cBillableCollaborators"}},{"kind":"Field","name":{"kind":"Name","value":"cTeamMembers"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriptionProduct"}},{"kind":"Field","name":{"kind":"Name","value":"nSubtotal"}},{"kind":"Field","name":{"kind":"Name","value":"nSubtotalPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"nTax"}},{"kind":"Field","name":{"kind":"Name","value":"nTotal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"monthly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cBillableCollaborators"}},{"kind":"Field","name":{"kind":"Name","value":"cTeamMembers"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriptionProduct"}},{"kind":"Field","name":{"kind":"Name","value":"nSubtotal"}},{"kind":"Field","name":{"kind":"Name","value":"nSubtotalPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"nTax"}},{"kind":"Field","name":{"kind":"Name","value":"nTotal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nAnnualPercentageSavings"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subscriber"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"annual"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cBillableCollaborators"}},{"kind":"Field","name":{"kind":"Name","value":"cTeamMembers"}},{"kind":"Field","name":{"kind":"Name","value":"dtPricingAdjustmentExpiration"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriptionProduct"}},{"kind":"Field","name":{"kind":"Name","value":"nPricingAdjustment"}},{"kind":"Field","name":{"kind":"Name","value":"nSubtotal"}},{"kind":"Field","name":{"kind":"Name","value":"nSubtotalPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"nTax"}},{"kind":"Field","name":{"kind":"Name","value":"nTotal"}},{"kind":"Field","name":{"kind":"Name","value":"sTaxRegion"}}]}},{"kind":"Field","name":{"kind":"Name","value":"monthly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cBillableCollaborators"}},{"kind":"Field","name":{"kind":"Name","value":"cTeamMembers"}},{"kind":"Field","name":{"kind":"Name","value":"dtPricingAdjustmentExpiration"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriptionProduct"}},{"kind":"Field","name":{"kind":"Name","value":"nPricingAdjustment"}},{"kind":"Field","name":{"kind":"Name","value":"nSubtotal"}},{"kind":"Field","name":{"kind":"Name","value":"nSubtotalPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"nTax"}},{"kind":"Field","name":{"kind":"Name","value":"nTotal"}},{"kind":"Field","name":{"kind":"Name","value":"sTaxRegion"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nAnnualPercentageSavings"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"NuSkuListPriceQuotes","document":NuSkuListPriceQuotesDocument}} as const;
export type NuSkuListPriceQuotesQueryVariables = Types.Exact<{
  includeUnconfirmed?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  orgId: Types.Scalars['ID']['input'];
  product: Types.Scalars['Int']['input'];
}>;


export type NuSkuListPriceQuotesQuery = (
  { __typename: 'Query' }
  & { newSubscriptionListPriceQuotes: (
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
  ) }
);

/**
 * __useNuSkuListPriceQuotesQuery__
 *
 * To run a query within a React component, call `useNuSkuListPriceQuotesQuery` and pass it any options that fit your needs.
 * When your component renders, `useNuSkuListPriceQuotesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNuSkuListPriceQuotesQuery({
 *   variables: {
 *      includeUnconfirmed: // value for 'includeUnconfirmed'
 *      orgId: // value for 'orgId'
 *      product: // value for 'product'
 *   },
 * });
 */
export function useNuSkuListPriceQuotesQuery(
  baseOptions: TrelloQueryHookOptions<
    NuSkuListPriceQuotesQuery,
    NuSkuListPriceQuotesQueryVariables
  > &
    (
      | { variables: NuSkuListPriceQuotesQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: NuSkuListPriceQuotesDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    NuSkuListPriceQuotesQuery,
    NuSkuListPriceQuotesQueryVariables
  >(NuSkuListPriceQuotesDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useNuSkuListPriceQuotesLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    NuSkuListPriceQuotesQuery,
    NuSkuListPriceQuotesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    NuSkuListPriceQuotesQuery,
    NuSkuListPriceQuotesQueryVariables
  >(NuSkuListPriceQuotesDocument, options);
}
export function useNuSkuListPriceQuotesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        NuSkuListPriceQuotesQuery,
        NuSkuListPriceQuotesQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    NuSkuListPriceQuotesQuery,
    NuSkuListPriceQuotesQueryVariables
  >(NuSkuListPriceQuotesDocument, options);
}
export type NuSkuListPriceQuotesQueryHookResult = ReturnType<
  typeof useNuSkuListPriceQuotesQuery
>;
export type NuSkuListPriceQuotesLazyQueryHookResult = ReturnType<
  typeof useNuSkuListPriceQuotesLazyQuery
>;
export type NuSkuListPriceQuotesSuspenseQueryHookResult = ReturnType<
  typeof useNuSkuListPriceQuotesSuspenseQuery
>;
export type NuSkuListPriceQuotesQueryResult = Apollo.QueryResult<
  NuSkuListPriceQuotesQuery,
  NuSkuListPriceQuotesQueryVariables
>;
