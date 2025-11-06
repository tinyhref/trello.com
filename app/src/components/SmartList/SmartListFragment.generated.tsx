import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type SmartListFragment = (
  { __typename: 'List' }
  & Pick<Types.List, 'id' | 'name' | 'type'>
  & { datasource?: Types.Maybe<(
    { __typename: 'List_DataSource' }
    & Pick<Types.List_DataSource, 'filter' | 'link'>
  )> }
);

export const SmartListFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'SmartList' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'List' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'datasource' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'filter' } },
                { kind: 'Field', name: { kind: 'Name', value: 'link' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseSmartListFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<SmartListFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseSmartListFragmentResult
  extends Omit<Apollo.UseFragmentResult<SmartListFragment>, 'data'> {
  data?: SmartListFragment;
}

export const useSmartListFragment = ({
  from,
  returnPartialData,
  ...options
}: UseSmartListFragmentOptions): UseSmartListFragmentResult => {
  const result = Apollo.useFragment<SmartListFragment>({
    ...options,
    fragment: SmartListFragmentDoc,
    fragmentName: 'SmartList',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'List', ...from },
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

  return { ...result, data: result.data as SmartListFragment };
};
