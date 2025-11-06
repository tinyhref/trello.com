import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const UpdateViewOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateViewOptions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idOrganizationView"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idView"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"viewOptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputOrganizationView_View_ViewOptions"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateViewInOrganizationView"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idOrganizationView"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idOrganizationView"}}},{"kind":"Argument","name":{"kind":"Name","value":"idView"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idView"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"view"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"viewOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"viewOptions"}}}]}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idMemberCreator"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}},{"kind":"Field","name":{"kind":"Name","value":"views"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cardFilter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"criteria"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateLastActivity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"end"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateType"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"start"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateType"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"due"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"end"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateType"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"start"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateType"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"dueComplete"}},{"kind":"Field","name":{"kind":"Name","value":"idBoards"}},{"kind":"Field","name":{"kind":"Name","value":"idLists"}},{"kind":"Field","name":{"kind":"Name","value":"idMembers"}},{"kind":"Field","name":{"kind":"Name","value":"labels"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"defaultViewType"}},{"kind":"Field","name":{"kind":"Name","value":"viewOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Calendar"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeHorizon"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"UpdateViewOptions","document":UpdateViewOptionsDocument}} as const;
export type UpdateViewOptionsMutationVariables = Types.Exact<{
  idOrganizationView: Types.Scalars['ID']['input'];
  idView: Types.Scalars['ID']['input'];
  traceId: Types.Scalars['String']['input'];
  viewOptions: Types.InputOrganizationView_View_ViewOptions;
}>;


export type UpdateViewOptionsMutation = (
  { __typename: 'Mutation' }
  & { updateViewInOrganizationView?: Types.Maybe<(
    { __typename: 'OrganizationView' }
    & Pick<
      Types.OrganizationView,
      | 'id'
      | 'idMemberCreator'
      | 'idOrganization'
      | 'name'
      | 'shortLink'
    >
    & {
      prefs: (
        { __typename: 'OrganizationView_Prefs' }
        & Pick<Types.OrganizationView_Prefs, 'permissionLevel'>
      ),
      views: Array<(
        { __typename: 'OrganizationView_View' }
        & Pick<Types.OrganizationView_View, 'id' | 'defaultViewType'>
        & {
          cardFilter: (
            { __typename: 'OrganizationView_View_CardFilter' }
            & { criteria: Array<(
              { __typename: 'OrganizationView_View_CardFilter_Criteria' }
              & Pick<
                Types.OrganizationView_View_CardFilter_Criteria,
                | 'dueComplete'
                | 'idBoards'
                | 'idLists'
                | 'idMembers'
                | 'labels'
                | 'sort'
              >
              & {
                dateLastActivity?: Types.Maybe<(
                  { __typename: 'CardFilter_Criteria_DateRange' }
                  & {
                    end?: Types.Maybe<(
                      { __typename: 'CardFilter_AdvancedDate' }
                      & Pick<Types.CardFilter_AdvancedDate, 'dateType' | 'value'>
                    )>,
                    start?: Types.Maybe<(
                      { __typename: 'CardFilter_AdvancedDate' }
                      & Pick<Types.CardFilter_AdvancedDate, 'dateType' | 'value'>
                    )>,
                  }
                )>,
                due?: Types.Maybe<(
                  { __typename: 'CardFilter_Criteria_DateRange' }
                  & {
                    end?: Types.Maybe<(
                      { __typename: 'CardFilter_AdvancedDate' }
                      & Pick<Types.CardFilter_AdvancedDate, 'dateType' | 'value'>
                    )>,
                    start?: Types.Maybe<(
                      { __typename: 'CardFilter_AdvancedDate' }
                      & Pick<Types.CardFilter_AdvancedDate, 'dateType' | 'value'>
                    )>,
                  }
                )>,
              }
            )> }
          ),
          viewOptions?: Types.Maybe<(
            { __typename: 'OrganizationView_View_ViewOptions' }
            & { Calendar?: Types.Maybe<(
              { __typename: 'OrganizationView_View_ViewOptions_Calendar' }
              & Pick<Types.OrganizationView_View_ViewOptions_Calendar, 'timeHorizon'>
            )> }
          )>,
        }
      )>,
    }
  )> }
);

export type UpdateViewOptionsMutationFn = Apollo.MutationFunction<
  UpdateViewOptionsMutation,
  UpdateViewOptionsMutationVariables
>;

/**
 * __useUpdateViewOptionsMutation__
 *
 * To run a mutation, you first call `useUpdateViewOptionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateViewOptionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateViewOptionsMutation, { data, loading, error }] = useUpdateViewOptionsMutation({
 *   variables: {
 *      idOrganizationView: // value for 'idOrganizationView'
 *      idView: // value for 'idView'
 *      traceId: // value for 'traceId'
 *      viewOptions: // value for 'viewOptions'
 *   },
 * });
 */
export function useUpdateViewOptionsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateViewOptionsMutation,
    UpdateViewOptionsMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateViewOptionsMutation,
    UpdateViewOptionsMutationVariables
  >(UpdateViewOptionsDocument, options);
}
export type UpdateViewOptionsMutationHookResult = ReturnType<
  typeof useUpdateViewOptionsMutation
>;
export type UpdateViewOptionsMutationResult =
  Apollo.MutationResult<UpdateViewOptionsMutation>;
export type UpdateViewOptionsMutationOptions = Apollo.BaseMutationOptions<
  UpdateViewOptionsMutation,
  UpdateViewOptionsMutationVariables
>;
