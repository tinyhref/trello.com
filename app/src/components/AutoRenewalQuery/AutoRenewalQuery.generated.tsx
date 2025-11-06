import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const AutoRenewalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AutoRenewal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paidAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"billingDates"}},{"kind":"Field","name":{"kind":"Name","value":"canRenew"}},{"kind":"Field","name":{"kind":"Name","value":"expirationDates"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriber"}},{"kind":"Field","name":{"kind":"Name","value":"paidProduct"}},{"kind":"Field","name":{"kind":"Name","value":"previousSubscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dtCancelled"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriptionProductId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productOverride"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"autoUpgrade"}},{"kind":"Field","name":{"kind":"Name","value":"dateEnd"}},{"kind":"Field","name":{"kind":"Name","value":"dateStart"}},{"kind":"Field","name":{"kind":"Name","value":"product"}}]}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"standing"}},{"kind":"Field","name":{"kind":"Name","value":"trialExpiration"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"AutoRenewal","document":AutoRenewalDocument}} as const;
export type AutoRenewalQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID']['input'];
}>;


export type AutoRenewalQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id' | 'premiumFeatures'>
    & { paidAccount?: Types.Maybe<(
      { __typename: 'PaidAccount' }
      & Pick<
        Types.PaidAccount,
        | 'billingDates'
        | 'canRenew'
        | 'expirationDates'
        | 'ixSubscriber'
        | 'paidProduct'
        | 'products'
        | 'standing'
        | 'trialExpiration'
      >
      & {
        previousSubscription?: Types.Maybe<(
          { __typename: 'PreviousSubscription' }
          & Pick<Types.PreviousSubscription, 'dtCancelled' | 'ixSubscriptionProductId'>
        )>,
        productOverride?: Types.Maybe<(
          { __typename: 'ProductOverride' }
          & Pick<
            Types.ProductOverride,
            | 'autoUpgrade'
            | 'dateEnd'
            | 'dateStart'
            | 'product'
          >
        )>,
      }
    )> }
  )> }
);

/**
 * __useAutoRenewalQuery__
 *
 * To run a query within a React component, call `useAutoRenewalQuery` and pass it any options that fit your needs.
 * When your component renders, `useAutoRenewalQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAutoRenewalQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useAutoRenewalQuery(
  baseOptions: TrelloQueryHookOptions<
    AutoRenewalQuery,
    AutoRenewalQueryVariables
  > &
    (
      | { variables: AutoRenewalQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: AutoRenewalDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<AutoRenewalQuery, AutoRenewalQueryVariables>(
    AutoRenewalDocument,
    options,
  );
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useAutoRenewalLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    AutoRenewalQuery,
    AutoRenewalQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<AutoRenewalQuery, AutoRenewalQueryVariables>(
    AutoRenewalDocument,
    options,
  );
}
export function useAutoRenewalSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        AutoRenewalQuery,
        AutoRenewalQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<AutoRenewalQuery, AutoRenewalQueryVariables>(
    AutoRenewalDocument,
    options,
  );
}
export type AutoRenewalQueryHookResult = ReturnType<typeof useAutoRenewalQuery>;
export type AutoRenewalLazyQueryHookResult = ReturnType<
  typeof useAutoRenewalLazyQuery
>;
export type AutoRenewalSuspenseQueryHookResult = ReturnType<
  typeof useAutoRenewalSuspenseQuery
>;
export type AutoRenewalQueryResult = Apollo.QueryResult<
  AutoRenewalQuery,
  AutoRenewalQueryVariables
>;
