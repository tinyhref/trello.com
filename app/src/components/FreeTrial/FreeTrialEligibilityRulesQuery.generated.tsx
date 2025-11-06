import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const FreeTrialEligibilityRulesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FreeTrialEligibilityRules"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"confirmed"}},{"kind":"Field","name":{"kind":"Name","value":"enterprises"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"saml"},{"kind":"EnumValue","value":"member"},{"kind":"EnumValue","value":"memberUnconfirmed"},{"kind":"EnumValue","value":"owned"}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"offering"}}]}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"credits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"via"}}]}},{"kind":"Field","name":{"kind":"Name","value":"enterpriseJoinRequest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"offering"}},{"kind":"Field","name":{"kind":"Name","value":"paidAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"standing"}},{"kind":"Field","name":{"kind":"Name","value":"trialExpiration"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"FreeTrialEligibilityRules","document":FreeTrialEligibilityRulesDocument}} as const;
export type FreeTrialEligibilityRulesQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID']['input'];
}>;


export type FreeTrialEligibilityRulesQuery = (
  { __typename: 'Query' }
  & {
    member?: Types.Maybe<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'id' | 'confirmed' | 'idEnterprise'>
      & { enterprises: Array<(
        { __typename: 'Enterprise' }
        & Pick<Types.Enterprise, 'id' | 'displayName' | 'offering'>
      )> }
    )>,
    organization?: Types.Maybe<(
      { __typename: 'Organization' }
      & Pick<
        Types.Organization,
        | 'id'
        | 'name'
        | 'offering'
        | 'premiumFeatures'
      >
      & {
        credits: Array<(
          { __typename: 'Credit' }
          & Pick<
            Types.Credit,
            | 'id'
            | 'count'
            | 'type'
            | 'via'
          >
        )>,
        enterpriseJoinRequest?: Types.Maybe<(
          { __typename: 'EnterpriseJoinRequest' }
          & Pick<Types.EnterpriseJoinRequest, 'idEnterprise'>
        )>,
        memberships: Array<(
          { __typename: 'Organization_Membership' }
          & Pick<Types.Organization_Membership, 'id' | 'idMember' | 'memberType'>
        )>,
        paidAccount?: Types.Maybe<(
          { __typename: 'PaidAccount' }
          & Pick<Types.PaidAccount, 'standing' | 'trialExpiration'>
        )>,
      }
    )>,
  }
);

/**
 * __useFreeTrialEligibilityRulesQuery__
 *
 * To run a query within a React component, call `useFreeTrialEligibilityRulesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFreeTrialEligibilityRulesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFreeTrialEligibilityRulesQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useFreeTrialEligibilityRulesQuery(
  baseOptions: TrelloQueryHookOptions<
    FreeTrialEligibilityRulesQuery,
    FreeTrialEligibilityRulesQueryVariables
  > &
    (
      | { variables: FreeTrialEligibilityRulesQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: FreeTrialEligibilityRulesDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    FreeTrialEligibilityRulesQuery,
    FreeTrialEligibilityRulesQueryVariables
  >(FreeTrialEligibilityRulesDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useFreeTrialEligibilityRulesLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    FreeTrialEligibilityRulesQuery,
    FreeTrialEligibilityRulesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    FreeTrialEligibilityRulesQuery,
    FreeTrialEligibilityRulesQueryVariables
  >(FreeTrialEligibilityRulesDocument, options);
}
export function useFreeTrialEligibilityRulesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        FreeTrialEligibilityRulesQuery,
        FreeTrialEligibilityRulesQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    FreeTrialEligibilityRulesQuery,
    FreeTrialEligibilityRulesQueryVariables
  >(FreeTrialEligibilityRulesDocument, options);
}
export type FreeTrialEligibilityRulesQueryHookResult = ReturnType<
  typeof useFreeTrialEligibilityRulesQuery
>;
export type FreeTrialEligibilityRulesLazyQueryHookResult = ReturnType<
  typeof useFreeTrialEligibilityRulesLazyQuery
>;
export type FreeTrialEligibilityRulesSuspenseQueryHookResult = ReturnType<
  typeof useFreeTrialEligibilityRulesSuspenseQuery
>;
export type FreeTrialEligibilityRulesQueryResult = Apollo.QueryResult<
  FreeTrialEligibilityRulesQuery,
  FreeTrialEligibilityRulesQueryVariables
>;
