import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const RenewalPriceQuotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RenewalPriceQuotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"renewalPriceQuotes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accountId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"annual"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cBillableCollaboratorConversions"}},{"kind":"Field","name":{"kind":"Name","value":"cBillableCollaborators"}},{"kind":"Field","name":{"kind":"Name","value":"cTeamMembers"}},{"kind":"Field","name":{"kind":"Name","value":"dtBilling"}},{"kind":"Field","name":{"kind":"Name","value":"dtPricingAdjustmentExpiration"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriptionDiscountType"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriptionProduct"}},{"kind":"Field","name":{"kind":"Name","value":"nPricingAdjustment"}},{"kind":"Field","name":{"kind":"Name","value":"nSubscriptionPeriodMonths"}},{"kind":"Field","name":{"kind":"Name","value":"nSubtotal"}},{"kind":"Field","name":{"kind":"Name","value":"nSubtotalPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"nTax"}},{"kind":"Field","name":{"kind":"Name","value":"nTaxPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"nTaxRate"}},{"kind":"Field","name":{"kind":"Name","value":"nTotal"}},{"kind":"Field","name":{"kind":"Name","value":"nTotalPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"sTaxRegion"}}]}},{"kind":"Field","name":{"kind":"Name","value":"monthly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cBillableCollaboratorConversions"}},{"kind":"Field","name":{"kind":"Name","value":"cBillableCollaborators"}},{"kind":"Field","name":{"kind":"Name","value":"cTeamMembers"}},{"kind":"Field","name":{"kind":"Name","value":"dtBilling"}},{"kind":"Field","name":{"kind":"Name","value":"dtPricingAdjustmentExpiration"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriptionDiscountType"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriptionProduct"}},{"kind":"Field","name":{"kind":"Name","value":"nPricingAdjustment"}},{"kind":"Field","name":{"kind":"Name","value":"nSubscriptionPeriodMonths"}},{"kind":"Field","name":{"kind":"Name","value":"nSubtotal"}},{"kind":"Field","name":{"kind":"Name","value":"nSubtotalPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"nTax"}},{"kind":"Field","name":{"kind":"Name","value":"nTaxPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"nTaxRate"}},{"kind":"Field","name":{"kind":"Name","value":"nTotal"}},{"kind":"Field","name":{"kind":"Name","value":"nTotalPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"sTaxRegion"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nAnnualPercentageSavings"}},{"kind":"Field","name":{"kind":"Name","value":"nAnnualSavings"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"RenewalPriceQuotes","document":RenewalPriceQuotesDocument}} as const;
export type RenewalPriceQuotesQueryVariables = Types.Exact<{
  accountId: Types.Scalars['ID']['input'];
}>;


export type RenewalPriceQuotesQuery = (
  { __typename: 'Query' }
  & { renewalPriceQuotes: (
    { __typename: 'PriceQuoteInfo' }
    & Pick<Types.PriceQuoteInfo, 'nAnnualPercentageSavings' | 'nAnnualSavings'>
    & {
      annual?: Types.Maybe<(
        { __typename: 'PriceQuote' }
        & Pick<
          Types.PriceQuote,
          | 'cBillableCollaboratorConversions'
          | 'cBillableCollaborators'
          | 'cTeamMembers'
          | 'dtBilling'
          | 'dtPricingAdjustmentExpiration'
          | 'ixSubscriptionDiscountType'
          | 'ixSubscriptionProduct'
          | 'nPricingAdjustment'
          | 'nSubscriptionPeriodMonths'
          | 'nSubtotal'
          | 'nSubtotalPerUser'
          | 'nTax'
          | 'nTaxPerUser'
          | 'nTaxRate'
          | 'nTotal'
          | 'nTotalPerUser'
          | 'sTaxRegion'
        >
      )>,
      monthly?: Types.Maybe<(
        { __typename: 'PriceQuote' }
        & Pick<
          Types.PriceQuote,
          | 'cBillableCollaboratorConversions'
          | 'cBillableCollaborators'
          | 'cTeamMembers'
          | 'dtBilling'
          | 'dtPricingAdjustmentExpiration'
          | 'ixSubscriptionDiscountType'
          | 'ixSubscriptionProduct'
          | 'nPricingAdjustment'
          | 'nSubscriptionPeriodMonths'
          | 'nSubtotal'
          | 'nSubtotalPerUser'
          | 'nTax'
          | 'nTaxPerUser'
          | 'nTaxRate'
          | 'nTotal'
          | 'nTotalPerUser'
          | 'sTaxRegion'
        >
      )>,
    }
  ) }
);

/**
 * __useRenewalPriceQuotesQuery__
 *
 * To run a query within a React component, call `useRenewalPriceQuotesQuery` and pass it any options that fit your needs.
 * When your component renders, `useRenewalPriceQuotesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRenewalPriceQuotesQuery({
 *   variables: {
 *      accountId: // value for 'accountId'
 *   },
 * });
 */
export function useRenewalPriceQuotesQuery(
  baseOptions: TrelloQueryHookOptions<
    RenewalPriceQuotesQuery,
    RenewalPriceQuotesQueryVariables
  > &
    (
      | { variables: RenewalPriceQuotesQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: RenewalPriceQuotesDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    RenewalPriceQuotesQuery,
    RenewalPriceQuotesQueryVariables
  >(RenewalPriceQuotesDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useRenewalPriceQuotesLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    RenewalPriceQuotesQuery,
    RenewalPriceQuotesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    RenewalPriceQuotesQuery,
    RenewalPriceQuotesQueryVariables
  >(RenewalPriceQuotesDocument, options);
}
export function useRenewalPriceQuotesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        RenewalPriceQuotesQuery,
        RenewalPriceQuotesQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    RenewalPriceQuotesQuery,
    RenewalPriceQuotesQueryVariables
  >(RenewalPriceQuotesDocument, options);
}
export type RenewalPriceQuotesQueryHookResult = ReturnType<
  typeof useRenewalPriceQuotesQuery
>;
export type RenewalPriceQuotesLazyQueryHookResult = ReturnType<
  typeof useRenewalPriceQuotesLazyQuery
>;
export type RenewalPriceQuotesSuspenseQueryHookResult = ReturnType<
  typeof useRenewalPriceQuotesSuspenseQuery
>;
export type RenewalPriceQuotesQueryResult = Apollo.QueryResult<
  RenewalPriceQuotesQuery,
  RenewalPriceQuotesQueryVariables
>;
