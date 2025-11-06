import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const MoveCardPopoverDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MoveCardPopover"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"visible"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cardRole"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"idList"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}}]}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"openPerBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalPerBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"checklists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"lists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"openPerList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalPerList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"MoveCardPopover","document":MoveCardPopoverDocument}} as const;
export type MoveCardPopoverQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID']['input'];
}>;


export type MoveCardPopoverQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
    & {
      cards: Array<(
        { __typename: 'Card' }
        & Pick<
          Types.Card,
          | 'id'
          | 'cardRole'
          | 'closed'
          | 'idList'
          | 'pos'
        >
      )>,
      limits: (
        { __typename: 'Board_Limits' }
        & {
          attachments: (
            { __typename: 'Board_Limits_Attachments' }
            & { perBoard: (
              { __typename: 'Limit' }
              & Pick<Types.Limit, 'status'>
            ) }
          ),
          cards: (
            { __typename: 'Board_Limits_Cards' }
            & {
              openPerBoard: (
                { __typename: 'Limit' }
                & Pick<Types.Limit, 'status'>
              ),
              totalPerBoard: (
                { __typename: 'Limit' }
                & Pick<Types.Limit, 'status'>
              ),
            }
          ),
          checklists: (
            { __typename: 'Board_Limits_Checklists' }
            & { perBoard: (
              { __typename: 'Limit' }
              & Pick<Types.Limit, 'status'>
            ) }
          ),
          labels: (
            { __typename: 'Board_Limits_Labels' }
            & { perBoard: (
              { __typename: 'Limit' }
              & Pick<Types.Limit, 'disableAt' | 'status'>
            ) }
          ),
        }
      ),
      lists: Array<(
        { __typename: 'List' }
        & Pick<Types.List, 'id' | 'name' | 'type'>
        & { limits: (
          { __typename: 'List_Limits' }
          & { cards: (
            { __typename: 'List_Limits_Cards' }
            & {
              openPerList: (
                { __typename: 'Limit' }
                & Pick<Types.Limit, 'status'>
              ),
              totalPerList: (
                { __typename: 'Limit' }
                & Pick<Types.Limit, 'status'>
              ),
            }
          ) }
        ) }
      )>,
    }
  )> }
);

/**
 * __useMoveCardPopoverQuery__
 *
 * To run a query within a React component, call `useMoveCardPopoverQuery` and pass it any options that fit your needs.
 * When your component renders, `useMoveCardPopoverQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMoveCardPopoverQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useMoveCardPopoverQuery(
  baseOptions: TrelloQueryHookOptions<
    MoveCardPopoverQuery,
    MoveCardPopoverQueryVariables
  > &
    (
      | { variables: MoveCardPopoverQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: MoveCardPopoverDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    MoveCardPopoverQuery,
    MoveCardPopoverQueryVariables
  >(MoveCardPopoverDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useMoveCardPopoverLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    MoveCardPopoverQuery,
    MoveCardPopoverQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    MoveCardPopoverQuery,
    MoveCardPopoverQueryVariables
  >(MoveCardPopoverDocument, options);
}
export function useMoveCardPopoverSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        MoveCardPopoverQuery,
        MoveCardPopoverQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    MoveCardPopoverQuery,
    MoveCardPopoverQueryVariables
  >(MoveCardPopoverDocument, options);
}
export type MoveCardPopoverQueryHookResult = ReturnType<
  typeof useMoveCardPopoverQuery
>;
export type MoveCardPopoverLazyQueryHookResult = ReturnType<
  typeof useMoveCardPopoverLazyQuery
>;
export type MoveCardPopoverSuspenseQueryHookResult = ReturnType<
  typeof useMoveCardPopoverSuspenseQuery
>;
export type MoveCardPopoverQueryResult = Apollo.QueryResult<
  MoveCardPopoverQuery,
  MoveCardPopoverQueryVariables
>;
