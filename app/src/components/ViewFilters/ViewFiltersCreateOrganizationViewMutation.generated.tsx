import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const ViewFiltersCreateOrganizationViewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ViewFiltersCreateOrganizationView"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idOrganization"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"prefs"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputOrganizationView_Prefs"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"views"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputOrganizationView_View"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOrganizationView"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idOrganization"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idOrganization"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"prefs"},"value":{"kind":"Variable","name":{"kind":"Name","value":"prefs"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"views"},"value":{"kind":"Variable","name":{"kind":"Name","value":"views"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"ViewFiltersCreateOrganizationView","document":ViewFiltersCreateOrganizationViewDocument}} as const;
export type ViewFiltersCreateOrganizationViewMutationVariables = Types.Exact<{
  idOrganization: Types.Scalars['ID']['input'];
  name: Types.Scalars['String']['input'];
  prefs: Types.InputOrganizationView_Prefs;
  traceId: Types.Scalars['String']['input'];
  views: Array<Types.InputOrganizationView_View> | Types.InputOrganizationView_View;
}>;


export type ViewFiltersCreateOrganizationViewMutation = (
  { __typename: 'Mutation' }
  & { createOrganizationView?: Types.Maybe<(
    { __typename: 'OrganizationView' }
    & Pick<Types.OrganizationView, 'id' | 'name' | 'shortLink'>
  )> }
);

export type ViewFiltersCreateOrganizationViewMutationFn =
  Apollo.MutationFunction<
    ViewFiltersCreateOrganizationViewMutation,
    ViewFiltersCreateOrganizationViewMutationVariables
  >;

/**
 * __useViewFiltersCreateOrganizationViewMutation__
 *
 * To run a mutation, you first call `useViewFiltersCreateOrganizationViewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useViewFiltersCreateOrganizationViewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [viewFiltersCreateOrganizationViewMutation, { data, loading, error }] = useViewFiltersCreateOrganizationViewMutation({
 *   variables: {
 *      idOrganization: // value for 'idOrganization'
 *      name: // value for 'name'
 *      prefs: // value for 'prefs'
 *      traceId: // value for 'traceId'
 *      views: // value for 'views'
 *   },
 * });
 */
export function useViewFiltersCreateOrganizationViewMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ViewFiltersCreateOrganizationViewMutation,
    ViewFiltersCreateOrganizationViewMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ViewFiltersCreateOrganizationViewMutation,
    ViewFiltersCreateOrganizationViewMutationVariables
  >(ViewFiltersCreateOrganizationViewDocument, options);
}
export type ViewFiltersCreateOrganizationViewMutationHookResult = ReturnType<
  typeof useViewFiltersCreateOrganizationViewMutation
>;
export type ViewFiltersCreateOrganizationViewMutationResult =
  Apollo.MutationResult<ViewFiltersCreateOrganizationViewMutation>;
export type ViewFiltersCreateOrganizationViewMutationOptions =
  Apollo.BaseMutationOptions<
    ViewFiltersCreateOrganizationViewMutation,
    ViewFiltersCreateOrganizationViewMutationVariables
  >;
