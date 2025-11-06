import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const AddGuestMemberDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AddGuestMemberDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalPerMember"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"nonPublic"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"AddGuestMemberDetails","document":AddGuestMemberDetailsDocument}} as const;
export type AddGuestMemberDetailsQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type AddGuestMemberDetailsQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'fullName' | 'username'>
    & {
      limits: (
        { __typename: 'Member_Limits' }
        & { orgs: (
          { __typename: 'Member_Limits_Orgs' }
          & { totalPerMember: (
            { __typename: 'Limit' }
            & Pick<Types.Limit, 'status'>
          ) }
        ) }
      ),
      nonPublic?: Types.Maybe<(
        { __typename: 'Member_NonPublic' }
        & Pick<Types.Member_NonPublic, 'fullName'>
      )>,
    }
  )> }
);

/**
 * __useAddGuestMemberDetailsQuery__
 *
 * To run a query within a React component, call `useAddGuestMemberDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAddGuestMemberDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAddGuestMemberDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAddGuestMemberDetailsQuery(
  baseOptions: TrelloQueryHookOptions<
    AddGuestMemberDetailsQuery,
    AddGuestMemberDetailsQueryVariables
  > &
    (
      | { variables: AddGuestMemberDetailsQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: AddGuestMemberDetailsDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    AddGuestMemberDetailsQuery,
    AddGuestMemberDetailsQueryVariables
  >(AddGuestMemberDetailsDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useAddGuestMemberDetailsLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    AddGuestMemberDetailsQuery,
    AddGuestMemberDetailsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    AddGuestMemberDetailsQuery,
    AddGuestMemberDetailsQueryVariables
  >(AddGuestMemberDetailsDocument, options);
}
export function useAddGuestMemberDetailsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        AddGuestMemberDetailsQuery,
        AddGuestMemberDetailsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    AddGuestMemberDetailsQuery,
    AddGuestMemberDetailsQueryVariables
  >(AddGuestMemberDetailsDocument, options);
}
export type AddGuestMemberDetailsQueryHookResult = ReturnType<
  typeof useAddGuestMemberDetailsQuery
>;
export type AddGuestMemberDetailsLazyQueryHookResult = ReturnType<
  typeof useAddGuestMemberDetailsLazyQuery
>;
export type AddGuestMemberDetailsSuspenseQueryHookResult = ReturnType<
  typeof useAddGuestMemberDetailsSuspenseQuery
>;
export type AddGuestMemberDetailsQueryResult = Apollo.QueryResult<
  AddGuestMemberDetailsQuery,
  AddGuestMemberDetailsQueryVariables
>;
