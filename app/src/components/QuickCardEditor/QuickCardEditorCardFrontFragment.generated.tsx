import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type QuickCardEditorCardFrontFragment = (
  { __typename: 'Card' }
  & Pick<
    Types.Card,
    | 'id'
    | 'cardRole'
    | 'closed'
    | 'due'
    | 'dueReminder'
    | 'isTemplate'
    | 'name'
    | 'pinned'
    | 'start'
    | 'url'
  >
  & {
    cover?: Types.Maybe<(
      { __typename: 'Card_Cover' }
      & Pick<
        Types.Card_Cover,
        | 'brightness'
        | 'color'
        | 'edgeColor'
        | 'idAttachment'
        | 'idPlugin'
        | 'idUploadedBackground'
        | 'sharedSourceUrl'
        | 'size'
      >
      & { scaled?: Types.Maybe<Array<(
        { __typename: 'Card_Cover_Scaled' }
        & Pick<
          Types.Card_Cover_Scaled,
          | 'id'
          | 'height'
          | 'scaled'
          | 'url'
          | 'width'
        >
      )>> }
    )>,
    stickers: Array<(
      { __typename: 'Sticker' }
      & Pick<Types.Sticker, 'id'>
    )>,
  }
);

export const QuickCardEditorCardFrontFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'QuickCardEditorCardFront' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'brightness' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'edgeColor' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'idAttachment' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'idPlugin' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'idUploadedBackground' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'scaled' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'height' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'scaled' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'url' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'width' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'sharedSourceUrl' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'size' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'due' } },
          { kind: 'Field', name: { kind: 'Name', value: 'dueReminder' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'pinned' } },
          { kind: 'Field', name: { kind: 'Name', value: 'start' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'stickers' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseQuickCardEditorCardFrontFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      QuickCardEditorCardFrontFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseQuickCardEditorCardFrontFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<QuickCardEditorCardFrontFragment>,
    'data'
  > {
  data?: QuickCardEditorCardFrontFragment;
}

export const useQuickCardEditorCardFrontFragment = ({
  from,
  returnPartialData,
  ...options
}: UseQuickCardEditorCardFrontFragmentOptions): UseQuickCardEditorCardFrontFragmentResult => {
  const result = Apollo.useFragment<QuickCardEditorCardFrontFragment>({
    ...options,
    fragment: QuickCardEditorCardFrontFragmentDoc,
    fragmentName: 'QuickCardEditorCardFront',
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

  return { ...result, data: result.data as QuickCardEditorCardFrontFragment };
};
