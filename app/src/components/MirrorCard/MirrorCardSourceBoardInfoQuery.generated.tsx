import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const MirrorCardSourceBoardInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MirrorCardSourceBoardInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customFields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"display"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cardFront"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pos"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"all"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"MirrorCardSourceBoardInfo","document":MirrorCardSourceBoardInfoDocument}} as const;
export type MirrorCardSourceBoardInfoQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type MirrorCardSourceBoardInfoQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
    & {
      customFields: Array<(
        { __typename: 'CustomField' }
        & Pick<
          Types.CustomField,
          | 'id'
          | 'name'
          | 'pos'
          | 'type'
        >
        & {
          display: (
            { __typename: 'CustomField_Display' }
            & Pick<Types.CustomField_Display, 'cardFront'>
          ),
          options?: Types.Maybe<Array<(
            { __typename: 'CustomField_Option' }
            & Pick<Types.CustomField_Option, 'id' | 'color' | 'pos'>
            & { value: (
              { __typename: 'CustomField_Option_Value' }
              & Pick<Types.CustomField_Option_Value, 'text'>
            ) }
          )>>,
        }
      )>,
      labels: Array<(
        { __typename: 'Label' }
        & Pick<
          Types.Label,
          | 'id'
          | 'color'
          | 'idBoard'
          | 'name'
        >
      )>,
      limits: (
        { __typename: 'Board_Limits' }
        & { labels: (
          { __typename: 'Board_Limits_Labels' }
          & { perBoard: (
            { __typename: 'Limit' }
            & Pick<Types.Limit, 'disableAt' | 'status'>
          ) }
        ) }
      ),
    }
  )> }
);

/**
 * __useMirrorCardSourceBoardInfoQuery__
 *
 * To run a query within a React component, call `useMirrorCardSourceBoardInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useMirrorCardSourceBoardInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMirrorCardSourceBoardInfoQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMirrorCardSourceBoardInfoQuery(
  baseOptions: TrelloQueryHookOptions<
    MirrorCardSourceBoardInfoQuery,
    MirrorCardSourceBoardInfoQueryVariables
  > &
    (
      | { variables: MirrorCardSourceBoardInfoQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: MirrorCardSourceBoardInfoDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    MirrorCardSourceBoardInfoQuery,
    MirrorCardSourceBoardInfoQueryVariables
  >(MirrorCardSourceBoardInfoDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useMirrorCardSourceBoardInfoLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    MirrorCardSourceBoardInfoQuery,
    MirrorCardSourceBoardInfoQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    MirrorCardSourceBoardInfoQuery,
    MirrorCardSourceBoardInfoQueryVariables
  >(MirrorCardSourceBoardInfoDocument, options);
}
export function useMirrorCardSourceBoardInfoSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        MirrorCardSourceBoardInfoQuery,
        MirrorCardSourceBoardInfoQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    MirrorCardSourceBoardInfoQuery,
    MirrorCardSourceBoardInfoQueryVariables
  >(MirrorCardSourceBoardInfoDocument, options);
}
export type MirrorCardSourceBoardInfoQueryHookResult = ReturnType<
  typeof useMirrorCardSourceBoardInfoQuery
>;
export type MirrorCardSourceBoardInfoLazyQueryHookResult = ReturnType<
  typeof useMirrorCardSourceBoardInfoLazyQuery
>;
export type MirrorCardSourceBoardInfoSuspenseQueryHookResult = ReturnType<
  typeof useMirrorCardSourceBoardInfoSuspenseQuery
>;
export type MirrorCardSourceBoardInfoQueryResult = Apollo.QueryResult<
  MirrorCardSourceBoardInfoQuery,
  MirrorCardSourceBoardInfoQueryVariables
>;
