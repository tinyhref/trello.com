import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const NuSkuTeamBillingViewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NuSkuTeamBillingView"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"confirmed"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"logins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"billableCollaboratorCount"}},{"kind":"Field","name":{"kind":"Name","value":"billableMemberCount"}},{"kind":"Field","name":{"kind":"Name","value":"credits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"enterprise"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idAdmins"}}]}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deactivated"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"unconfirmed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"paidAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"billingDates"}},{"kind":"Field","name":{"kind":"Name","value":"expirationDates"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceDetails"}},{"kind":"Field","name":{"kind":"Name","value":"previousSubscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dtCancelled"}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriptionProductId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"standing"}}]}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"standardVariation"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"NuSkuTeamBillingView","document":NuSkuTeamBillingViewDocument}} as const;
export type NuSkuTeamBillingViewQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID']['input'];
  orgId: Types.Scalars['ID']['input'];
}>;


export type NuSkuTeamBillingViewQuery = (
  { __typename: 'Query' }
  & {
    member?: Types.Maybe<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'id' | 'confirmed' | 'email'>
      & { logins: Array<(
        { __typename: 'Login' }
        & Pick<Types.Login, 'id' | 'primary'>
      )> }
    )>,
    organization?: Types.Maybe<(
      { __typename: 'Organization' }
      & Pick<
        Types.Organization,
        | 'id'
        | 'billableCollaboratorCount'
        | 'billableMemberCount'
        | 'displayName'
        | 'idEnterprise'
        | 'name'
        | 'products'
        | 'standardVariation'
      >
      & {
        credits: Array<(
          { __typename: 'Credit' }
          & Pick<Types.Credit, 'id' | 'type'>
        )>,
        enterprise?: Types.Maybe<(
          { __typename: 'Enterprise' }
          & Pick<Types.Enterprise, 'id' | 'idAdmins'>
        )>,
        memberships: Array<(
          { __typename: 'Organization_Membership' }
          & Pick<
            Types.Organization_Membership,
            | 'id'
            | 'deactivated'
            | 'idMember'
            | 'memberType'
            | 'unconfirmed'
          >
        )>,
        paidAccount?: Types.Maybe<(
          { __typename: 'PaidAccount' }
          & Pick<
            Types.PaidAccount,
            | 'billingDates'
            | 'expirationDates'
            | 'invoiceDetails'
            | 'products'
            | 'standing'
          >
          & { previousSubscription?: Types.Maybe<(
            { __typename: 'PreviousSubscription' }
            & Pick<Types.PreviousSubscription, 'dtCancelled' | 'ixSubscriptionProductId'>
          )> }
        )>,
      }
    )>,
  }
);

/**
 * __useNuSkuTeamBillingViewQuery__
 *
 * To run a query within a React component, call `useNuSkuTeamBillingViewQuery` and pass it any options that fit your needs.
 * When your component renders, `useNuSkuTeamBillingViewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNuSkuTeamBillingViewQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useNuSkuTeamBillingViewQuery(
  baseOptions: TrelloQueryHookOptions<
    NuSkuTeamBillingViewQuery,
    NuSkuTeamBillingViewQueryVariables
  > &
    (
      | { variables: NuSkuTeamBillingViewQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: NuSkuTeamBillingViewDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    NuSkuTeamBillingViewQuery,
    NuSkuTeamBillingViewQueryVariables
  >(NuSkuTeamBillingViewDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useNuSkuTeamBillingViewLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    NuSkuTeamBillingViewQuery,
    NuSkuTeamBillingViewQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    NuSkuTeamBillingViewQuery,
    NuSkuTeamBillingViewQueryVariables
  >(NuSkuTeamBillingViewDocument, options);
}
export function useNuSkuTeamBillingViewSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        NuSkuTeamBillingViewQuery,
        NuSkuTeamBillingViewQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    NuSkuTeamBillingViewQuery,
    NuSkuTeamBillingViewQueryVariables
  >(NuSkuTeamBillingViewDocument, options);
}
export type NuSkuTeamBillingViewQueryHookResult = ReturnType<
  typeof useNuSkuTeamBillingViewQuery
>;
export type NuSkuTeamBillingViewLazyQueryHookResult = ReturnType<
  typeof useNuSkuTeamBillingViewLazyQuery
>;
export type NuSkuTeamBillingViewSuspenseQueryHookResult = ReturnType<
  typeof useNuSkuTeamBillingViewSuspenseQuery
>;
export type NuSkuTeamBillingViewQueryResult = Apollo.QueryResult<
  NuSkuTeamBillingViewQuery,
  NuSkuTeamBillingViewQueryVariables
>;
