import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const PatchMemberDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PatchMemberData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"bioData"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprisesAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprisesImplicitAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"idPremOrgsAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"nonPublic"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"PatchMemberData","document":PatchMemberDataDocument}} as const;
export type PatchMemberDataQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID']['input'];
}>;


export type PatchMemberDataQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<
      Types.Member,
      | 'id'
      | 'bio'
      | 'bioData'
      | 'idEnterprise'
      | 'idEnterprisesAdmin'
      | 'idEnterprisesImplicitAdmin'
      | 'idPremOrgsAdmin'
      | 'url'
    >
    & { nonPublic?: Types.Maybe<(
      { __typename: 'Member_NonPublic' }
      & Pick<Types.Member_NonPublic, 'avatarUrl' | 'fullName' | 'initials'>
    )> }
  )> }
);

/**
 * __usePatchMemberDataQuery__
 *
 * To run a query within a React component, call `usePatchMemberDataQuery` and pass it any options that fit your needs.
 * When your component renders, `usePatchMemberDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePatchMemberDataQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function usePatchMemberDataQuery(
  baseOptions: TrelloQueryHookOptions<
    PatchMemberDataQuery,
    PatchMemberDataQueryVariables
  > &
    (
      | { variables: PatchMemberDataQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: PatchMemberDataDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    PatchMemberDataQuery,
    PatchMemberDataQueryVariables
  >(PatchMemberDataDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function usePatchMemberDataLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    PatchMemberDataQuery,
    PatchMemberDataQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    PatchMemberDataQuery,
    PatchMemberDataQueryVariables
  >(PatchMemberDataDocument, options);
}
export function usePatchMemberDataSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        PatchMemberDataQuery,
        PatchMemberDataQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    PatchMemberDataQuery,
    PatchMemberDataQueryVariables
  >(PatchMemberDataDocument, options);
}
export type PatchMemberDataQueryHookResult = ReturnType<
  typeof usePatchMemberDataQuery
>;
export type PatchMemberDataLazyQueryHookResult = ReturnType<
  typeof usePatchMemberDataLazyQuery
>;
export type PatchMemberDataSuspenseQueryHookResult = ReturnType<
  typeof usePatchMemberDataSuspenseQuery
>;
export type PatchMemberDataQueryResult = Apollo.QueryResult<
  PatchMemberDataQuery,
  PatchMemberDataQueryVariables
>;
