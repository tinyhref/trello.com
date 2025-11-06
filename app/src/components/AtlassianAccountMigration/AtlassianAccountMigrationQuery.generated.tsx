import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const AtlassianAccountMigrationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AtlassianAccountMigration"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"aaBlockSyncUntil"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"enterprises"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"saml"},{"kind":"EnumValue","value":"member"},{"kind":"EnumValue","value":"memberUnconfirmed"},{"kind":"EnumValue","value":"owned"}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ssoOnly"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"isAaMastered"}},{"kind":"Field","name":{"kind":"Name","value":"logins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"claimable"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nonPublic"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"twoFactor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"requiresAaOnboarding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"template"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"AtlassianAccountMigration","document":AtlassianAccountMigrationDocument}} as const;
export type AtlassianAccountMigrationQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID']['input'];
}>;


export type AtlassianAccountMigrationQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<
      Types.Member,
      | 'id'
      | 'aaBlockSyncUntil'
      | 'avatarUrl'
      | 'email'
      | 'fullName'
      | 'idEnterprise'
      | 'isAaMastered'
    >
    & {
      enterprises: Array<(
        { __typename: 'Enterprise' }
        & Pick<Types.Enterprise, 'id' | 'displayName'>
        & { prefs?: Types.Maybe<(
          { __typename: 'Enterprise_Prefs' }
          & Pick<Types.Enterprise_Prefs, 'ssoOnly'>
        )> }
      )>,
      logins: Array<(
        { __typename: 'Login' }
        & Pick<Types.Login, 'id' | 'claimable' | 'primary'>
      )>,
      nonPublic?: Types.Maybe<(
        { __typename: 'Member_NonPublic' }
        & Pick<Types.Member_NonPublic, 'avatarUrl' | 'fullName'>
      )>,
      prefs?: Types.Maybe<(
        { __typename: 'Member_Prefs' }
        & { twoFactor?: Types.Maybe<(
          { __typename: 'Member_Prefs_TwoFactor' }
          & Pick<Types.Member_Prefs_TwoFactor, 'enabled'>
        )> }
      )>,
      requiresAaOnboarding?: Types.Maybe<(
        { __typename: 'RequiresAaOnboarding' }
        & Pick<Types.RequiresAaOnboarding, 'template'>
        & { profile?: Types.Maybe<(
          { __typename: 'AaOnboardingProfile' }
          & Pick<Types.AaOnboardingProfile, 'avatarUrl' | 'fullName'>
        )> }
      )>,
    }
  )> }
);

/**
 * __useAtlassianAccountMigrationQuery__
 *
 * To run a query within a React component, call `useAtlassianAccountMigrationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAtlassianAccountMigrationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAtlassianAccountMigrationQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useAtlassianAccountMigrationQuery(
  baseOptions: TrelloQueryHookOptions<
    AtlassianAccountMigrationQuery,
    AtlassianAccountMigrationQueryVariables
  > &
    (
      | { variables: AtlassianAccountMigrationQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: AtlassianAccountMigrationDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    AtlassianAccountMigrationQuery,
    AtlassianAccountMigrationQueryVariables
  >(AtlassianAccountMigrationDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useAtlassianAccountMigrationLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    AtlassianAccountMigrationQuery,
    AtlassianAccountMigrationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    AtlassianAccountMigrationQuery,
    AtlassianAccountMigrationQueryVariables
  >(AtlassianAccountMigrationDocument, options);
}
export function useAtlassianAccountMigrationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        AtlassianAccountMigrationQuery,
        AtlassianAccountMigrationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    AtlassianAccountMigrationQuery,
    AtlassianAccountMigrationQueryVariables
  >(AtlassianAccountMigrationDocument, options);
}
export type AtlassianAccountMigrationQueryHookResult = ReturnType<
  typeof useAtlassianAccountMigrationQuery
>;
export type AtlassianAccountMigrationLazyQueryHookResult = ReturnType<
  typeof useAtlassianAccountMigrationLazyQuery
>;
export type AtlassianAccountMigrationSuspenseQueryHookResult = ReturnType<
  typeof useAtlassianAccountMigrationSuspenseQuery
>;
export type AtlassianAccountMigrationQueryResult = Apollo.QueryResult<
  AtlassianAccountMigrationQuery,
  AtlassianAccountMigrationQueryVariables
>;
