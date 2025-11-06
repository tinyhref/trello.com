import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type CollaboratorAvatarFragment = (
  { __typename: 'Collaborator' }
  & Pick<
    Types.Collaborator,
    | 'id'
    | 'avatarUrl'
    | 'fullName'
    | 'initials'
    | 'username'
  >
  & { nonPublic?: Types.Maybe<(
    { __typename: 'Member_NonPublic' }
    & Pick<Types.Member_NonPublic, 'avatarUrl' | 'fullName' | 'initials'>
  )> }
);

export const CollaboratorAvatarFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CollaboratorAvatar' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Collaborator' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'avatarUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'initials' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'nonPublic' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'avatarUrl' } },
                { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'initials' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'username' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseCollaboratorAvatarFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      CollaboratorAvatarFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseCollaboratorAvatarFragmentResult
  extends Omit<Apollo.UseFragmentResult<CollaboratorAvatarFragment>, 'data'> {
  data?: CollaboratorAvatarFragment;
}

export const useCollaboratorAvatarFragment = ({
  from,
  returnPartialData,
  ...options
}: UseCollaboratorAvatarFragmentOptions): UseCollaboratorAvatarFragmentResult => {
  const result = Apollo.useFragment<CollaboratorAvatarFragment>({
    ...options,
    fragment: CollaboratorAvatarFragmentDoc,
    fragmentName: 'CollaboratorAvatar',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'Collaborator', ...from },
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

  return { ...result, data: result.data as CollaboratorAvatarFragment };
};
