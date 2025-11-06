import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type ColorBlindSupportFragment = (
  { __typename: 'Member' }
  & { prefs?: Types.Maybe<(
    { __typename: 'Member_Prefs' }
    & Pick<Types.Member_Prefs, 'colorBlind'>
  )> }
);

export const ColorBlindSupportFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ColorBlindSupport' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Member' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'prefs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'colorBlind' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseColorBlindSupportFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      ColorBlindSupportFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseColorBlindSupportFragmentResult
  extends Omit<Apollo.UseFragmentResult<ColorBlindSupportFragment>, 'data'> {
  data?: ColorBlindSupportFragment;
}

export const useColorBlindSupportFragment = ({
  from,
  returnPartialData,
  ...options
}: UseColorBlindSupportFragmentOptions): UseColorBlindSupportFragmentResult => {
  const result = Apollo.useFragment<ColorBlindSupportFragment>({
    ...options,
    fragment: ColorBlindSupportFragmentDoc,
    fragmentName: 'ColorBlindSupport',
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

  return { ...result, data: result.data as ColorBlindSupportFragment };
};
