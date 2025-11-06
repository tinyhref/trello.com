import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const UpgradePromptRulesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UpgradePromptRules"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"confirmed"}},{"kind":"Field","name":{"kind":"Name","value":"enterprises"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"saml"},{"kind":"EnumValue","value":"member"},{"kind":"EnumValue","value":"memberUnconfirmed"},{"kind":"EnumValue","value":"owned"}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"offering"}}]}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"idEntitlement"}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"freeBoardsPerOrg"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"offering"}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"UpgradePromptRules","document":UpgradePromptRulesDocument}} as const;
export type UpgradePromptRulesQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID']['input'];
  orgId: Types.Scalars['ID']['input'];
}>;


export type UpgradePromptRulesQuery = (
  { __typename: 'Query' }
  & {
    member?: Types.Maybe<(
      { __typename: 'Member' }
      & Pick<
        Types.Member,
        | 'id'
        | 'confirmed'
        | 'idEnterprise'
        | 'oneTimeMessagesDismissed'
      >
      & { enterprises: Array<(
        { __typename: 'Enterprise' }
        & Pick<Types.Enterprise, 'id' | 'offering'>
      )> }
    )>,
    organization?: Types.Maybe<(
      { __typename: 'Organization' }
      & Pick<
        Types.Organization,
        | 'id'
        | 'idEnterprise'
        | 'idEntitlement'
        | 'name'
        | 'offering'
        | 'premiumFeatures'
      >
      & {
        limits: (
          { __typename: 'Organization_Limits' }
          & { orgs: (
            { __typename: 'Organization_Limits_Orgs' }
            & { freeBoardsPerOrg: (
              { __typename: 'Limit' }
              & Pick<Types.Limit, 'count'>
            ) }
          ) }
        ),
        memberships: Array<(
          { __typename: 'Organization_Membership' }
          & Pick<Types.Organization_Membership, 'id' | 'idMember'>
        )>,
      }
    )>,
  }
);

/**
 * __useUpgradePromptRulesQuery__
 *
 * To run a query within a React component, call `useUpgradePromptRulesQuery` and pass it any options that fit your needs.
 * When your component renders, `useUpgradePromptRulesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUpgradePromptRulesQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useUpgradePromptRulesQuery(
  baseOptions: TrelloQueryHookOptions<
    UpgradePromptRulesQuery,
    UpgradePromptRulesQueryVariables
  > &
    (
      | { variables: UpgradePromptRulesQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: UpgradePromptRulesDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    UpgradePromptRulesQuery,
    UpgradePromptRulesQueryVariables
  >(UpgradePromptRulesDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useUpgradePromptRulesLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    UpgradePromptRulesQuery,
    UpgradePromptRulesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    UpgradePromptRulesQuery,
    UpgradePromptRulesQueryVariables
  >(UpgradePromptRulesDocument, options);
}
export function useUpgradePromptRulesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        UpgradePromptRulesQuery,
        UpgradePromptRulesQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    UpgradePromptRulesQuery,
    UpgradePromptRulesQueryVariables
  >(UpgradePromptRulesDocument, options);
}
export type UpgradePromptRulesQueryHookResult = ReturnType<
  typeof useUpgradePromptRulesQuery
>;
export type UpgradePromptRulesLazyQueryHookResult = ReturnType<
  typeof useUpgradePromptRulesLazyQuery
>;
export type UpgradePromptRulesSuspenseQueryHookResult = ReturnType<
  typeof useUpgradePromptRulesSuspenseQuery
>;
export type UpgradePromptRulesQueryResult = Apollo.QueryResult<
  UpgradePromptRulesQuery,
  UpgradePromptRulesQueryVariables
>;
