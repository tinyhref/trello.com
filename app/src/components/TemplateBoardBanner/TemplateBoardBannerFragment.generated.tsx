import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type TemplateBoardBannerFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'id' | 'closed' | 'name'>
  & {
    enterprise?: Types.Maybe<(
      { __typename: 'Enterprise' }
      & Pick<Types.Enterprise, 'id' | 'displayName'>
    )>,
    organization?: Types.Maybe<(
      { __typename: 'Organization' }
      & Pick<Types.Organization, 'id' | 'displayName'>
    )>,
    prefs?: Types.Maybe<(
      { __typename: 'Board_Prefs' }
      & Pick<Types.Board_Prefs, 'isTemplate' | 'permissionLevel'>
    )>,
  }
);

export const TemplateBoardBannerFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TemplateBoardBanner' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Board' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'enterprise' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'organization' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
              ],
            },
          },
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
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseTemplateBoardBannerFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      TemplateBoardBannerFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseTemplateBoardBannerFragmentResult
  extends Omit<Apollo.UseFragmentResult<TemplateBoardBannerFragment>, 'data'> {
  data?: TemplateBoardBannerFragment;
}

export const useTemplateBoardBannerFragment = ({
  from,
  returnPartialData,
  ...options
}: UseTemplateBoardBannerFragmentOptions): UseTemplateBoardBannerFragmentResult => {
  const result = Apollo.useFragment<TemplateBoardBannerFragment>({
    ...options,
    fragment: TemplateBoardBannerFragmentDoc,
    fragmentName: 'TemplateBoardBanner',
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

  return { ...result, data: result.data as TemplateBoardBannerFragment };
};
