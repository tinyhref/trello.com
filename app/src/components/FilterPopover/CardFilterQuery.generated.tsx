import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const CardFilterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CardFilter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"boardPlugins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idPlugin"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"visible"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cardRole"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"customFieldItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idCustomField"}},{"kind":"Field","name":{"kind":"Name","value":"idValue"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checked"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"dateLastActivity"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"dueComplete"}},{"kind":"Field","name":{"kind":"Name","value":"dueReminder"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"idList"}},{"kind":"Field","name":{"kind":"Name","value":"idMembers"}},{"kind":"Field","name":{"kind":"Name","value":"idShort"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mirrorSourceId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customFields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"CardFilter","document":CardFilterDocument}} as const;
export type CardFilterQueryVariables = Types.Exact<{
  idBoard: Types.Scalars['ID']['input'];
}>;


export type CardFilterQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id' | 'shortLink'>
    & {
      boardPlugins: Array<(
        { __typename: 'BoardPlugin' }
        & Pick<Types.BoardPlugin, 'id' | 'idPlugin'>
      )>,
      cards: Array<(
        { __typename: 'Card' }
        & Pick<
          Types.Card,
          | 'id'
          | 'cardRole'
          | 'closed'
          | 'dateLastActivity'
          | 'due'
          | 'dueComplete'
          | 'dueReminder'
          | 'idBoard'
          | 'idList'
          | 'idMembers'
          | 'idShort'
          | 'isTemplate'
          | 'mirrorSourceId'
          | 'name'
          | 'pos'
          | 'start'
          | 'url'
        >
        & {
          customFieldItems: Array<(
            { __typename: 'CustomFieldItem' }
            & Pick<Types.CustomFieldItem, 'id' | 'idCustomField' | 'idValue'>
            & { value?: Types.Maybe<(
              { __typename: 'CustomFieldItem_Value' }
              & Pick<
                Types.CustomFieldItem_Value,
                | 'checked'
                | 'date'
                | 'number'
                | 'text'
              >
            )> }
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
        }
      )>,
      customFields: Array<(
        { __typename: 'CustomField' }
        & Pick<Types.CustomField, 'id' | 'name' | 'type'>
        & { options?: Types.Maybe<Array<(
          { __typename: 'CustomField_Option' }
          & Pick<Types.CustomField_Option, 'id' | 'color'>
          & { value: (
            { __typename: 'CustomField_Option_Value' }
            & Pick<Types.CustomField_Option_Value, 'text'>
          ) }
        )>> }
      )>,
    }
  )> }
);

/**
 * __useCardFilterQuery__
 *
 * To run a query within a React component, call `useCardFilterQuery` and pass it any options that fit your needs.
 * When your component renders, `useCardFilterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCardFilterQuery({
 *   variables: {
 *      idBoard: // value for 'idBoard'
 *   },
 * });
 */
export function useCardFilterQuery(
  baseOptions: TrelloQueryHookOptions<
    CardFilterQuery,
    CardFilterQueryVariables
  > &
    (
      | { variables: CardFilterQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: CardFilterDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<CardFilterQuery, CardFilterQueryVariables>(
    CardFilterDocument,
    options,
  );
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useCardFilterLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    CardFilterQuery,
    CardFilterQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CardFilterQuery, CardFilterQueryVariables>(
    CardFilterDocument,
    options,
  );
}
export function useCardFilterSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<CardFilterQuery, CardFilterQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<CardFilterQuery, CardFilterQueryVariables>(
    CardFilterDocument,
    options,
  );
}
export type CardFilterQueryHookResult = ReturnType<typeof useCardFilterQuery>;
export type CardFilterLazyQueryHookResult = ReturnType<
  typeof useCardFilterLazyQuery
>;
export type CardFilterSuspenseQueryHookResult = ReturnType<
  typeof useCardFilterSuspenseQuery
>;
export type CardFilterQueryResult = Apollo.QueryResult<
  CardFilterQuery,
  CardFilterQueryVariables
>;
