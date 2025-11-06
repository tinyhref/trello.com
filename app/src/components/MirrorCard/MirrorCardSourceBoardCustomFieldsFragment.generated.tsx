import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type MirrorCardSourceBoardCustomFieldsFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'id'>
  & { customFields: Array<(
    { __typename: 'CustomField' }
    & Pick<Types.CustomField, 'id'>
  )> }
);

export const MirrorCardSourceBoardCustomFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MirrorCardSourceBoardCustomFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Board' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'customFields' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseMirrorCardSourceBoardCustomFieldsFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      MirrorCardSourceBoardCustomFieldsFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseMirrorCardSourceBoardCustomFieldsFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<MirrorCardSourceBoardCustomFieldsFragment>,
    'data'
  > {
  data?: MirrorCardSourceBoardCustomFieldsFragment;
}

export const useMirrorCardSourceBoardCustomFieldsFragment = ({
  from,
  returnPartialData,
  ...options
}: UseMirrorCardSourceBoardCustomFieldsFragmentOptions): UseMirrorCardSourceBoardCustomFieldsFragmentResult => {
  const result = Apollo.useFragment<MirrorCardSourceBoardCustomFieldsFragment>({
    ...options,
    fragment: MirrorCardSourceBoardCustomFieldsFragmentDoc,
    fragmentName: 'MirrorCardSourceBoardCustomFields',
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

  return {
    ...result,
    data: result.data as MirrorCardSourceBoardCustomFieldsFragment,
  };
};
