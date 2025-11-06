import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const AddListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"datasourceFilter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"datasourceLink"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pos"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"datasourceFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"datasourceFilter"}}},{"kind":"Argument","name":{"kind":"Name","value":"datasourceLink"},"value":{"kind":"Variable","name":{"kind":"Name","value":"datasourceLink"}}},{"kind":"Argument","name":{"kind":"Name","value":"idBoard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"pos"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pos"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CurrentBoardFullList"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CurrentBoardFullList"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"List"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"creationMethod"}},{"kind":"Field","name":{"kind":"Name","value":"datasource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filter"}},{"kind":"Field","name":{"kind":"Name","value":"handler"}},{"kind":"Field","name":{"kind":"Name","value":"link"}}]}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"openPerList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalPerList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}},{"kind":"Field","name":{"kind":"Name","value":"softLimit"}},{"kind":"Field","name":{"kind":"Name","value":"subscribed"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"AddList","document":AddListDocument}} as const;
export type AddListMutationVariables = Types.Exact<{
  datasourceFilter?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  datasourceLink?: Types.InputMaybe<Types.Scalars['String']['input']>;
  idBoard: Types.Scalars['ID']['input'];
  name: Types.Scalars['String']['input'];
  pos: Types.Scalars['Float']['input'];
  traceId: Types.Scalars['String']['input'];
  type?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type AddListMutation = (
  { __typename: 'Mutation' }
  & { createList?: Types.Maybe<(
    { __typename: 'List' }
    & Pick<
      Types.List,
      | 'id'
      | 'closed'
      | 'color'
      | 'creationMethod'
      | 'idBoard'
      | 'name'
      | 'pos'
      | 'softLimit'
      | 'subscribed'
      | 'type'
    >
    & {
      datasource?: Types.Maybe<(
        { __typename: 'List_DataSource' }
        & Pick<Types.List_DataSource, 'filter' | 'handler' | 'link'>
      )>,
      limits: (
        { __typename: 'List_Limits' }
        & { cards: (
          { __typename: 'List_Limits_Cards' }
          & {
            openPerList: (
              { __typename: 'Limit' }
              & Pick<
                Types.Limit,
                | 'count'
                | 'disableAt'
                | 'status'
                | 'warnAt'
              >
            ),
            totalPerList: (
              { __typename: 'Limit' }
              & Pick<
                Types.Limit,
                | 'count'
                | 'disableAt'
                | 'status'
                | 'warnAt'
              >
            ),
          }
        ) }
      ),
    }
  )> }
);

export type AddListMutationFn = Apollo.MutationFunction<
  AddListMutation,
  AddListMutationVariables
>;

/**
 * __useAddListMutation__
 *
 * To run a mutation, you first call `useAddListMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddListMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addListMutation, { data, loading, error }] = useAddListMutation({
 *   variables: {
 *      datasourceFilter: // value for 'datasourceFilter'
 *      datasourceLink: // value for 'datasourceLink'
 *      idBoard: // value for 'idBoard'
 *      name: // value for 'name'
 *      pos: // value for 'pos'
 *      traceId: // value for 'traceId'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useAddListMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AddListMutation,
    AddListMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<AddListMutation, AddListMutationVariables>(
    AddListDocument,
    options,
  );
}
export type AddListMutationHookResult = ReturnType<typeof useAddListMutation>;
export type AddListMutationResult = Apollo.MutationResult<AddListMutation>;
export type AddListMutationOptions = Apollo.BaseMutationOptions<
  AddListMutation,
  AddListMutationVariables
>;
