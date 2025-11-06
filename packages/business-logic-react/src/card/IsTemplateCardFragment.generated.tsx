import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type IsTemplateCardFragment = (
  { __typename: 'Card' }
  & Pick<Types.Card, 'isTemplate'>
);

export const IsTemplateCardFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'IsTemplateCard' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Card' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseIsTemplateCardFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      IsTemplateCardFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseIsTemplateCardFragmentResult
  extends Omit<Apollo.UseFragmentResult<IsTemplateCardFragment>, 'data'> {
  data?: IsTemplateCardFragment;
}

export const useIsTemplateCardFragment = ({
  from,
  returnPartialData,
  ...options
}: UseIsTemplateCardFragmentOptions): UseIsTemplateCardFragmentResult => {
  const result = Apollo.useFragment<IsTemplateCardFragment>({
    ...options,
    fragment: IsTemplateCardFragmentDoc,
    fragmentName: 'IsTemplateCard',
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

  return { ...result, data: result.data as IsTemplateCardFragment };
};
