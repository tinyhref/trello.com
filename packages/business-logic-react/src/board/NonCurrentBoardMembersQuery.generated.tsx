import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const NonCurrentBoardMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NonCurrentBoardMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"activityBlocked"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"bioData"}},{"kind":"Field","name":{"kind":"Name","value":"confirmed"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"idMemberReferrer"}},{"kind":"Field","name":{"kind":"Name","value":"idPremOrgsAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"nonPublic"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nonPublicAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deactivated"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"orgMemberType"}},{"kind":"Field","name":{"kind":"Name","value":"unconfirmed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deactivated"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"unconfirmed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"offering"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canInvite"}},{"kind":"Field","name":{"kind":"Name","value":"invitations"}},{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"NonCurrentBoardMembers","document":NonCurrentBoardMembersDocument}} as const;
export type NonCurrentBoardMembersQueryVariables = Types.Exact<{
  idBoard: Types.Scalars['ID']['input'];
}>;


export type NonCurrentBoardMembersQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id' | 'idEnterprise' | 'idOrganization'>
    & {
      members: Array<(
        { __typename: 'Member' }
        & Pick<
          Types.Member,
          | 'id'
          | 'activityBlocked'
          | 'avatarUrl'
          | 'bio'
          | 'bioData'
          | 'confirmed'
          | 'fullName'
          | 'idEnterprise'
          | 'idMemberReferrer'
          | 'idPremOrgsAdmin'
          | 'initials'
          | 'memberType'
          | 'nonPublicAvailable'
          | 'url'
          | 'username'
        >
        & { nonPublic?: Types.Maybe<(
          { __typename: 'Member_NonPublic' }
          & Pick<Types.Member_NonPublic, 'avatarUrl' | 'fullName' | 'initials'>
        )> }
      )>,
      memberships: Array<(
        { __typename: 'Board_Membership' }
        & Pick<
          Types.Board_Membership,
          | 'id'
          | 'deactivated'
          | 'idMember'
          | 'memberType'
          | 'orgMemberType'
          | 'unconfirmed'
        >
      )>,
      organization?: Types.Maybe<(
        { __typename: 'Organization' }
        & Pick<Types.Organization, 'id' | 'offering'>
        & { memberships: Array<(
          { __typename: 'Organization_Membership' }
          & Pick<
            Types.Organization_Membership,
            | 'id'
            | 'deactivated'
            | 'idMember'
            | 'memberType'
            | 'unconfirmed'
          >
        )> }
      )>,
      prefs?: Types.Maybe<(
        { __typename: 'Board_Prefs' }
        & Pick<Types.Board_Prefs, 'canInvite' | 'invitations' | 'permissionLevel'>
      )>,
    }
  )> }
);

/**
 * __useNonCurrentBoardMembersQuery__
 *
 * To run a query within a React component, call `useNonCurrentBoardMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useNonCurrentBoardMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNonCurrentBoardMembersQuery({
 *   variables: {
 *      idBoard: // value for 'idBoard'
 *   },
 * });
 */
export function useNonCurrentBoardMembersQuery(
  baseOptions: TrelloQueryHookOptions<
    NonCurrentBoardMembersQuery,
    NonCurrentBoardMembersQueryVariables
  > &
    (
      | { variables: NonCurrentBoardMembersQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: NonCurrentBoardMembersDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    NonCurrentBoardMembersQuery,
    NonCurrentBoardMembersQueryVariables
  >(NonCurrentBoardMembersDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useNonCurrentBoardMembersLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    NonCurrentBoardMembersQuery,
    NonCurrentBoardMembersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    NonCurrentBoardMembersQuery,
    NonCurrentBoardMembersQueryVariables
  >(NonCurrentBoardMembersDocument, options);
}
export function useNonCurrentBoardMembersSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        NonCurrentBoardMembersQuery,
        NonCurrentBoardMembersQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    NonCurrentBoardMembersQuery,
    NonCurrentBoardMembersQueryVariables
  >(NonCurrentBoardMembersDocument, options);
}
export type NonCurrentBoardMembersQueryHookResult = ReturnType<
  typeof useNonCurrentBoardMembersQuery
>;
export type NonCurrentBoardMembersLazyQueryHookResult = ReturnType<
  typeof useNonCurrentBoardMembersLazyQuery
>;
export type NonCurrentBoardMembersSuspenseQueryHookResult = ReturnType<
  typeof useNonCurrentBoardMembersSuspenseQuery
>;
export type NonCurrentBoardMembersQueryResult = Apollo.QueryResult<
  NonCurrentBoardMembersQuery,
  NonCurrentBoardMembersQueryVariables
>;
