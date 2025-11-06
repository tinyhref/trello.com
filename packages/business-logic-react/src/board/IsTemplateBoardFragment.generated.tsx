import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type IsTemplateBoardFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'premiumFeatures'>
  & { prefs?: Types.Maybe<(
    { __typename: 'Board_Prefs' }
    & Pick<Types.Board_Prefs, 'isTemplate' | 'permissionLevel'>
  )> }
);

export const IsTemplateBoardFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'IsTemplateBoard' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Board' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'permissionLevel' },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'premiumFeatures' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseIsTemplateBoardFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      IsTemplateBoardFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseIsTemplateBoardFragmentResult
  extends Omit<Apollo.UseFragmentResult<IsTemplateBoardFragment>, 'data'> {
  data?: IsTemplateBoardFragment;
}

export const useIsTemplateBoardFragment = ({
  from,
  returnPartialData,
  ...options
}: UseIsTemplateBoardFragmentOptions): UseIsTemplateBoardFragmentResult => {
  const result = Apollo.useFragment<IsTemplateBoardFragment>({
    ...options,
    fragment: IsTemplateBoardFragmentDoc,
    fragmentName: 'IsTemplateBoard',
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

  return { ...result, data: result.data as IsTemplateBoardFragment };
};
