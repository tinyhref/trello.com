import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type WorkspaceUserLimitFragment = (
  { __typename: 'Organization' }
  & Pick<Types.Organization, 'id' | 'name' | 'offering'>
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

export const WorkspaceUserLimitFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'WorkspaceUserLimit' },
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
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'offering' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseWorkspaceUserLimitFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      WorkspaceUserLimitFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseWorkspaceUserLimitFragmentResult
  extends Omit<Apollo.UseFragmentResult<WorkspaceUserLimitFragment>, 'data'> {
  data?: WorkspaceUserLimitFragment;
}

export const useWorkspaceUserLimitFragment = ({
  from,
  returnPartialData,
  ...options
}: UseWorkspaceUserLimitFragmentOptions): UseWorkspaceUserLimitFragmentResult => {
  const result = Apollo.useFragment<WorkspaceUserLimitFragment>({
    ...options,
    fragment: WorkspaceUserLimitFragmentDoc,
    fragmentName: 'WorkspaceUserLimit',
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

  return { ...result, data: result.data as WorkspaceUserLimitFragment };
};
