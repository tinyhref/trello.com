import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type SandboxBoardEnterpriseFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'id'>
  & { enterprise?: Types.Maybe<(
    { __typename: 'Enterprise' }
    & Pick<Types.Enterprise, 'id'>
  )> }
);

export const SandboxBoardEnterpriseFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'SandboxBoardEnterprise' },
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
            name: { kind: 'Name', value: 'enterprise' },
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

interface UseSandboxBoardEnterpriseFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      SandboxBoardEnterpriseFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseSandboxBoardEnterpriseFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<SandboxBoardEnterpriseFragment>,
    'data'
  > {
  data?: SandboxBoardEnterpriseFragment;
}

export const useSandboxBoardEnterpriseFragment = ({
  from,
  returnPartialData,
  ...options
}: UseSandboxBoardEnterpriseFragmentOptions): UseSandboxBoardEnterpriseFragmentResult => {
  const result = Apollo.useFragment<SandboxBoardEnterpriseFragment>({
    ...options,
    fragment: SandboxBoardEnterpriseFragmentDoc,
    fragmentName: 'SandboxBoardEnterprise',
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

  return { ...result, data: result.data as SandboxBoardEnterpriseFragment };
};
