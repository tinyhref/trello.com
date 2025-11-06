import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type ConfirmEmailModalMemberFragment = (
  { __typename: 'Member' }
  & Pick<Types.Member, 'id' | 'confirmed' | 'email'>
);

export const ConfirmEmailModalMemberFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ConfirmEmailModalMember' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Member' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'confirmed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'email' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseConfirmEmailModalMemberFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      ConfirmEmailModalMemberFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseConfirmEmailModalMemberFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<ConfirmEmailModalMemberFragment>,
    'data'
  > {
  data?: ConfirmEmailModalMemberFragment;
}

export const useConfirmEmailModalMemberFragment = ({
  from,
  returnPartialData,
  ...options
}: UseConfirmEmailModalMemberFragmentOptions): UseConfirmEmailModalMemberFragmentResult => {
  const result = Apollo.useFragment<ConfirmEmailModalMemberFragment>({
    ...options,
    fragment: ConfirmEmailModalMemberFragmentDoc,
    fragmentName: 'ConfirmEmailModalMember',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'Member', ...from },
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

  return { ...result, data: result.data as ConfirmEmailModalMemberFragment };
};
