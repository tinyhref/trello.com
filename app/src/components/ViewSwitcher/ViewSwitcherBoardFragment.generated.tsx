import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type ViewSwitcherBoardFragment = (
  { __typename: 'Board' }
  & Pick<
    Types.Board,
    | 'id'
    | 'closed'
    | 'enterpriseOwned'
    | 'idEnterprise'
    | 'idOrganization'
    | 'premiumFeatures'
  >
  & {
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
    prefs?: Types.Maybe<(
      { __typename: 'Board_Prefs' }
      & Pick<Types.Board_Prefs, 'isTemplate' | 'selfJoin'>
      & { switcherViews: Array<(
        { __typename: 'Board_Prefs_SwitcherView' }
        & Pick<Types.Board_Prefs_SwitcherView, 'enabled' | 'viewType'>
      )> }
    )>,
  }
);

export const ViewSwitcherBoardFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ViewSwitcherBoard' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Board' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'enterpriseOwned' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idEnterprise' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idOrganization' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'memberships' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'deactivated' } },
                { kind: 'Field', name: { kind: 'Name', value: 'idMember' } },
                { kind: 'Field', name: { kind: 'Name', value: 'memberType' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'orgMemberType' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'unconfirmed' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'prefs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'selfJoin' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'switcherViews' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'enabled' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'viewType' },
                      },
                    ],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'premiumFeatures' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseViewSwitcherBoardFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      ViewSwitcherBoardFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseViewSwitcherBoardFragmentResult
  extends Omit<Apollo.UseFragmentResult<ViewSwitcherBoardFragment>, 'data'> {
  data?: ViewSwitcherBoardFragment;
}

export const useViewSwitcherBoardFragment = ({
  from,
  returnPartialData,
  ...options
}: UseViewSwitcherBoardFragmentOptions): UseViewSwitcherBoardFragmentResult => {
  const result = Apollo.useFragment<ViewSwitcherBoardFragment>({
    ...options,
    fragment: ViewSwitcherBoardFragmentDoc,
    fragmentName: 'ViewSwitcherBoard',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'Board', ...from },
  });

  // Ensure that the fragment result is not typed as a DeepPartial.
  if (!result.complete && !returnPartialData) {
    if (process.env.NODE_ENV === 'development') {
      if (
        localStorage.getItem('HIDE_FRAGMENT_WARNINGS') === 'false' ||
        localStorage.getItem('HIDE_FRAGMENT_WARNINGS') === null
      ) {
        console.warn('Fragment data is incomplete.', result);
      }
    }
    return {
      ...result,
      data: undefined,
    };
  }

  return { ...result, data: result.data as ViewSwitcherBoardFragment };
};
