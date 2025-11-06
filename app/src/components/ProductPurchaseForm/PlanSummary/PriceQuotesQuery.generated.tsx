import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const PriceQuotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PriceQuotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"country"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PIIString"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeUnconfirmed"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isVatRegistered"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postalCode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PIIString"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"product"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"promoCode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stateTaxId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taxId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newSubscriptionPriceQuotes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accountId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}}},{"kind":"Argument","name":{"kind":"Name","value":"country"},"value":{"kind":"Variable","name":{"kind":"Name","value":"country"}}},{"kind":"Argument","name":{"kind":"Name","value":"includeUnconfirmed"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeUnconfirmed"}}},{"kind":"Argument","name":{"kind":"Name","value":"isVatRegistered"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isVatRegistered"}}},{"kind":"Argument","name":{"kind":"Name","value":"postalCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postalCode"}}},{"kind":"Argument","name":{"kind":"Name","value":"product"},"value":{"kind":"Variable","name":{"kind":"Name","value":"product"}}},{"kind":"Argument","name":{"kind":"Name","value":"promoCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"promoCode"}}},{"kind":"Argument","name":{"kind":"Name","value":"stateTaxId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stateTaxId"}}},{"kind":"Argument","name":{"kind":"Name","value":"taxId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taxId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"annual"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cBillableCollaborators"}},{"kind":"Field","name":{"kind":"Name","value":"cTeamMembers"}},{"kind":"Field","name":{"kind":"Name","value":"dtBilling"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriptionDiscountType"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriptionProduct"}},{"kind":"Field","name":{"kind":"Name","value":"nPricingAdjustment"}},{"kind":"Field","name":{"kind":"Name","value":"nSubscriptionPeriodMonths"}},{"kind":"Field","name":{"kind":"Name","value":"nSubtotal"}},{"kind":"Field","name":{"kind":"Name","value":"nSubtotalPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"nTax"}},{"kind":"Field","name":{"kind":"Name","value":"nTaxPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"nTaxRate"}},{"kind":"Field","name":{"kind":"Name","value":"nTotal"}},{"kind":"Field","name":{"kind":"Name","value":"nTotalPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"sTaxRegion"}}]}},{"kind":"Field","name":{"kind":"Name","value":"monthly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cBillableCollaborators"}},{"kind":"Field","name":{"kind":"Name","value":"cTeamMembers"}},{"kind":"Field","name":{"kind":"Name","value":"dtBilling"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriptionDiscountType"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriptionProduct"}},{"kind":"Field","name":{"kind":"Name","value":"nPricingAdjustment"}},{"kind":"Field","name":{"kind":"Name","value":"nSubscriptionPeriodMonths"}},{"kind":"Field","name":{"kind":"Name","value":"nSubtotal"}},{"kind":"Field","name":{"kind":"Name","value":"nSubtotalPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"nTax"}},{"kind":"Field","name":{"kind":"Name","value":"nTaxPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"nTaxRate"}},{"kind":"Field","name":{"kind":"Name","value":"nTotal"}},{"kind":"Field","name":{"kind":"Name","value":"nTotalPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"sTaxRegion"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nAnnualPercentageSavings"}},{"kind":"Field","name":{"kind":"Name","value":"nAnnualSavings"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"PriceQuotes","document":PriceQuotesDocument}} as const;
export type PriceQuotesQueryVariables = Types.Exact<{
  accountId: Types.Scalars['ID']['input'];
  country: Types.Scalars['PIIString']['input'];
  includeUnconfirmed?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  isVatRegistered?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  postalCode?: Types.InputMaybe<Types.Scalars['PIIString']['input']>;
  product: Types.Scalars['Int']['input'];
  promoCode?: Types.InputMaybe<Types.Scalars['String']['input']>;
  stateTaxId?: Types.InputMaybe<Types.Scalars['String']['input']>;
  taxId?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type PriceQuotesQuery = (
  { __typename: 'Query' }
  & { newSubscriptionPriceQuotes: (
    { __typename: 'PriceQuoteInfo' }
    & Pick<Types.PriceQuoteInfo, 'nAnnualPercentageSavings' | 'nAnnualSavings'>
    & {
      annual?: Types.Maybe<(
        { __typename: 'PriceQuote' }
        & Pick<
          Types.PriceQuote,
          | 'cBillableCollaborators'
          | 'cTeamMembers'
          | 'dtBilling'
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
          | 'cBillableCollaborators'
          | 'cTeamMembers'
          | 'dtBilling'
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
 * __usePriceQuotesQuery__
 *
 * To run a query within a React component, call `usePriceQuotesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePriceQuotesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePriceQuotesQuery({
 *   variables: {
 *      accountId: // value for 'accountId'
 *      country: // value for 'country'
 *      includeUnconfirmed: // value for 'includeUnconfirmed'
 *      isVatRegistered: // value for 'isVatRegistered'
 *      postalCode: // value for 'postalCode'
 *      product: // value for 'product'
 *      promoCode: // value for 'promoCode'
 *      stateTaxId: // value for 'stateTaxId'
 *      taxId: // value for 'taxId'
 *   },
 * });
 */
export function usePriceQuotesQuery(
  baseOptions: TrelloQueryHookOptions<
    PriceQuotesQuery,
    PriceQuotesQueryVariables
  > &
    (
      | { variables: PriceQuotesQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: PriceQuotesDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<PriceQuotesQuery, PriceQuotesQueryVariables>(
    PriceQuotesDocument,
    options,
  );
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function usePriceQuotesLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    PriceQuotesQuery,
    PriceQuotesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<PriceQuotesQuery, PriceQuotesQueryVariables>(
    PriceQuotesDocument,
    options,
  );
}
export function usePriceQuotesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        PriceQuotesQuery,
        PriceQuotesQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<PriceQuotesQuery, PriceQuotesQueryVariables>(
    PriceQuotesDocument,
    options,
  );
}
export type PriceQuotesQueryHookResult = ReturnType<typeof usePriceQuotesQuery>;
export type PriceQuotesLazyQueryHookResult = ReturnType<
  typeof usePriceQuotesLazyQuery
>;
export type PriceQuotesSuspenseQueryHookResult = ReturnType<
  typeof usePriceQuotesSuspenseQuery
>;
export type PriceQuotesQueryResult = Apollo.QueryResult<
  PriceQuotesQuery,
  PriceQuotesQueryVariables
>;
