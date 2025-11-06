import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const BoardActionsIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardActionsId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Action_Type"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boardActions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"actions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"BoardActionsId","document":BoardActionsIdDocument}} as const;
export type BoardActionsIdQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID']['input'];
  filter: Array<Types.Action_Type> | Types.Action_Type;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  page?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type BoardActionsIdQuery = (
  { __typename: 'Query' }
  & { boardActions?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
    & { actions: Array<(
      { __typename: 'Action' }
      & Pick<Types.Action, 'id'>
    )> }
  )> }
);

/**
 * __useBoardActionsIdQuery__
 *
 * To run a query within a React component, call `useBoardActionsIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardActionsIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardActionsIdQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *      filter: // value for 'filter'
 *      limit: // value for 'limit'
 *      page: // value for 'page'
 *   },
 * });
 */
export function useBoardActionsIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    BoardActionsIdQuery,
    BoardActionsIdQueryVariables
  > &
    (
      | { variables: BoardActionsIdQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<BoardActionsIdQuery, BoardActionsIdQueryVariables>(
    BoardActionsIdDocument,
    options,
  );
}
export function useBoardActionsIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    BoardActionsIdQuery,
    BoardActionsIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<BoardActionsIdQuery, BoardActionsIdQueryVariables>(
    BoardActionsIdDocument,
    options,
  );
}
export function useBoardActionsIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        BoardActionsIdQuery,
        BoardActionsIdQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    BoardActionsIdQuery,
    BoardActionsIdQueryVariables
  >(BoardActionsIdDocument, options);
}
export type BoardActionsIdQueryHookResult = ReturnType<
  typeof useBoardActionsIdQuery
>;
export type BoardActionsIdLazyQueryHookResult = ReturnType<
  typeof useBoardActionsIdLazyQuery
>;
export type BoardActionsIdSuspenseQueryHookResult = ReturnType<
  typeof useBoardActionsIdSuspenseQuery
>;
export type BoardActionsIdQueryResult = Apollo.QueryResult<
  BoardActionsIdQuery,
  BoardActionsIdQueryVariables
>;
