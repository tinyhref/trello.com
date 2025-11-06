import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type IsSubscribedToCardFragment = (
  { __typename: 'Card' }
  & Pick<Types.Card, 'id' | 'subscribed'>
);

export const IsSubscribedToCardFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'IsSubscribedToCard' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Card' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'subscribed' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseIsSubscribedToCardFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      IsSubscribedToCardFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseIsSubscribedToCardFragmentResult
  extends Omit<Apollo.UseFragmentResult<IsSubscribedToCardFragment>, 'data'> {
  data?: IsSubscribedToCardFragment;
}

export const useIsSubscribedToCardFragment = ({
  from,
  returnPartialData,
  ...options
}: UseIsSubscribedToCardFragmentOptions): UseIsSubscribedToCardFragmentResult => {
  const result = Apollo.useFragment<IsSubscribedToCardFragment>({
    ...options,
    fragment: IsSubscribedToCardFragmentDoc,
    fragmentName: 'IsSubscribedToCard',
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

  return { ...result, data: result.data as IsSubscribedToCardFragment };
};
