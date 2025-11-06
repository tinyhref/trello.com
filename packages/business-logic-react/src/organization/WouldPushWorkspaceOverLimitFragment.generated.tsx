import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type WouldPushWorkspaceOverLimitFragment = (
  { __typename: 'Organization' }
  & Pick<Types.Organization, 'id' | 'offering'>
  & { limits: (
    { __typename: 'Organization_Limits' }
    & { orgs: (
      { __typename: 'Organization_Limits_Orgs' }
      & { usersPerFreeOrg: (
        { __typename: 'Limit' }
        & Pick<
          Types.Limit,
          | 'count'
          | 'disableAt'
          | 'status'
          | 'warnAt'
        >
      ) }
    ) }
  ) }
);

export const WouldPushWorkspaceOverLimitFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'WouldPushWorkspaceOverLimit' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Organization' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'limits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'orgs' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'usersPerFreeOrg' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'count' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'disableAt' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'status' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'warnAt' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'offering' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseWouldPushWorkspaceOverLimitFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      WouldPushWorkspaceOverLimitFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseWouldPushWorkspaceOverLimitFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<WouldPushWorkspaceOverLimitFragment>,
    'data'
  > {
  data?: WouldPushWorkspaceOverLimitFragment;
}

export const useWouldPushWorkspaceOverLimitFragment = ({
  from,
  returnPartialData,
  ...options
}: UseWouldPushWorkspaceOverLimitFragmentOptions): UseWouldPushWorkspaceOverLimitFragmentResult => {
  const result = Apollo.useFragment<WouldPushWorkspaceOverLimitFragment>({
    ...options,
    fragment: WouldPushWorkspaceOverLimitFragmentDoc,
    fragmentName: 'WouldPushWorkspaceOverLimit',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'Organization', ...from },
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

  return {
    ...result,
    data: result.data as WouldPushWorkspaceOverLimitFragment,
  };
};
