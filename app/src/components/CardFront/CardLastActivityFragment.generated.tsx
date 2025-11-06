import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type CardLastActivityFragment = (
  { __typename: 'Card' }
  & Pick<Types.Card, 'id' | 'dateLastActivity' | 'isTemplate'>
  & { pluginData: Array<(
    { __typename: 'PluginData' }
    & Pick<Types.PluginData, 'id' | 'idPlugin' | 'value'>
  )> }
);

export const CardLastActivityFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CardLastActivity' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Card' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'dateLastActivity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'pluginData' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'idPlugin' } },
                { kind: 'Field', name: { kind: 'Name', value: 'value' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseCardLastActivityFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      CardLastActivityFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseCardLastActivityFragmentResult
  extends Omit<Apollo.UseFragmentResult<CardLastActivityFragment>, 'data'> {
  data?: CardLastActivityFragment;
}

export const useCardLastActivityFragment = ({
  from,
  returnPartialData,
  ...options
}: UseCardLastActivityFragmentOptions): UseCardLastActivityFragmentResult => {
  const result = Apollo.useFragment<CardLastActivityFragment>({
    ...options,
    fragment: CardLastActivityFragmentDoc,
    fragmentName: 'CardLastActivity',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'Card', ...from },
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

  return { ...result, data: result.data as CardLastActivityFragment };
};
