import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type ClipboardWorkspaceAttachmentRestrictionsFragment = (
  { __typename: 'Organization' }
  & Pick<Types.Organization, 'id'>
  & { prefs: (
    { __typename: 'Organization_Prefs' }
    & Pick<Types.Organization_Prefs, 'attachmentRestrictions'>
  ) }
);

export const ClipboardWorkspaceAttachmentRestrictionsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ClipboardWorkspaceAttachmentRestrictions' },
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
            name: { kind: 'Name', value: 'prefs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'attachmentRestrictions' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseClipboardWorkspaceAttachmentRestrictionsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      ClipboardWorkspaceAttachmentRestrictionsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseClipboardWorkspaceAttachmentRestrictionsFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<ClipboardWorkspaceAttachmentRestrictionsFragment>,
    'data'
  > {
  data?: ClipboardWorkspaceAttachmentRestrictionsFragment;
}

export const useClipboardWorkspaceAttachmentRestrictionsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseClipboardWorkspaceAttachmentRestrictionsFragmentOptions): UseClipboardWorkspaceAttachmentRestrictionsFragmentResult => {
  const result =
    Apollo.useFragment<ClipboardWorkspaceAttachmentRestrictionsFragment>({
      ...options,
      fragment: ClipboardWorkspaceAttachmentRestrictionsFragmentDoc,
      fragmentName: 'ClipboardWorkspaceAttachmentRestrictions',
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
    data: result.data as ClipboardWorkspaceAttachmentRestrictionsFragment,
  };
};
