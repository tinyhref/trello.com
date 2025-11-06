import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const MemberEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MemberEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"aaId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"MemberEmail","document":MemberEmailDocument}} as const;
export type MemberEmailQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID']['input'];
}>;


export type MemberEmailQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'aaId' | 'email'>
  )> }
);

/**
 * __useMemberEmailQuery__
 *
 * To run a query within a React component, call `useMemberEmailQuery` and pass it any options that fit your needs.
 * When your component renders, `useMemberEmailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMemberEmailQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useMemberEmailQuery(
  baseOptions: TrelloQueryHookOptions<
    MemberEmailQuery,
    MemberEmailQueryVariables
  > &
    (
      | { variables: MemberEmailQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: MemberEmailDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<MemberEmailQuery, MemberEmailQueryVariables>(
    MemberEmailDocument,
    options,
  );
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useMemberEmailLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    MemberEmailQuery,
    MemberEmailQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MemberEmailQuery, MemberEmailQueryVariables>(
    MemberEmailDocument,
    options,
  );
}
export function useMemberEmailSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        MemberEmailQuery,
        MemberEmailQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<MemberEmailQuery, MemberEmailQueryVariables>(
    MemberEmailDocument,
    options,
  );
}
export type MemberEmailQueryHookResult = ReturnType<typeof useMemberEmailQuery>;
export type MemberEmailLazyQueryHookResult = ReturnType<
  typeof useMemberEmailLazyQuery
>;
export type MemberEmailSuspenseQueryHookResult = ReturnType<
  typeof useMemberEmailSuspenseQuery
>;
export type MemberEmailQueryResult = Apollo.QueryResult<
  MemberEmailQuery,
  MemberEmailQueryVariables
>;
