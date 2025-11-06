import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type LabelNameFragment = (
  { __typename: 'Label' }
  & Pick<Types.Label, 'id' | 'name'>
);

export const LabelNameFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'LabelName' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Label' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseLabelNameFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<LabelNameFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseLabelNameFragmentResult
  extends Omit<Apollo.UseFragmentResult<LabelNameFragment>, 'data'> {
  data?: LabelNameFragment;
}

export const useLabelNameFragment = ({
  from,
  returnPartialData,
  ...options
}: UseLabelNameFragmentOptions): UseLabelNameFragmentResult => {
  const result = Apollo.useFragment<LabelNameFragment>({
    ...options,
    fragment: LabelNameFragmentDoc,
    fragmentName: 'LabelName',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'Label', ...from },
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

  return { ...result, data: result.data as LabelNameFragment };
};
