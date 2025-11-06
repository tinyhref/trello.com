import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type CheckItemFullFragment = (
  { __typename: 'CheckItem' }
  & Pick<
    Types.CheckItem,
    | 'id'
    | 'due'
    | 'dueReminder'
    | 'idChecklist'
    | 'idMember'
    | 'name'
    | 'nameData'
    | 'pos'
    | 'state'
  >
);

export const CheckItemFullFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CheckItemFull' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'CheckItem' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'due' } },
          { kind: 'Field', name: { kind: 'Name', value: 'dueReminder' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idChecklist' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idMember' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nameData' } },
          { kind: 'Field', name: { kind: 'Name', value: 'pos' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseCheckItemFullFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<CheckItemFullFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseCheckItemFullFragmentResult
  extends Omit<Apollo.UseFragmentResult<CheckItemFullFragment>, 'data'> {
  data?: CheckItemFullFragment;
}

export const useCheckItemFullFragment = ({
  from,
  returnPartialData,
  ...options
}: UseCheckItemFullFragmentOptions): UseCheckItemFullFragmentResult => {
  const result = Apollo.useFragment<CheckItemFullFragment>({
    ...options,
    fragment: CheckItemFullFragmentDoc,
    fragmentName: 'CheckItemFull',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'CheckItem', ...from },
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

  return { ...result, data: result.data as CheckItemFullFragment };
};
