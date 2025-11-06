import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type CardFrontFragment = (
  { __typename: 'Card' }
  & Pick<
    Types.Card,
    | 'id'
    | 'cardRole'
    | 'closed'
    | 'mirrorSourceId'
    | 'name'
    | 'pinned'
    | 'url'
  >
  & { cover?: Types.Maybe<(
    { __typename: 'Card_Cover' }
    & Pick<
      Types.Card_Cover,
      | 'color'
      | 'idAttachment'
      | 'idPlugin'
      | 'idUploadedBackground'
      | 'size'
    >
  )> }
);

export const CardFrontFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CardFront' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Card' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'cardRole' } },
          { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'cover' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'idAttachment' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'idPlugin' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'idUploadedBackground' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'size' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'mirrorSourceId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'pinned' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseCardFrontFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<CardFrontFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseCardFrontFragmentResult
  extends Omit<Apollo.UseFragmentResult<CardFrontFragment>, 'data'> {
  data?: CardFrontFragment;
}

export const useCardFrontFragment = ({
  from,
  returnPartialData,
  ...options
}: UseCardFrontFragmentOptions): UseCardFrontFragmentResult => {
  const result = Apollo.useFragment<CardFrontFragment>({
    ...options,
    fragment: CardFrontFragmentDoc,
    fragmentName: 'CardFront',
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

  return { ...result, data: result.data as CardFrontFragment };
};
