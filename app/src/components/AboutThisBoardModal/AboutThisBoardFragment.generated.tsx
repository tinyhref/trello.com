import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type AboutThisBoardFragment = (
  { __typename: 'Board' }
  & Pick<
    Types.Board,
    | 'id'
    | 'closed'
    | 'desc'
    | 'descData'
    | 'idMemberCreator'
    | 'idOrganization'
    | 'premiumFeatures'
  >
  & {
    boardPlugins: Array<(
      { __typename: 'BoardPlugin' }
      & Pick<Types.BoardPlugin, 'id' | 'idPlugin'>
    )>,
    prefs?: Types.Maybe<(
      { __typename: 'Board_Prefs' }
      & Pick<Types.Board_Prefs, 'isTemplate' | 'permissionLevel'>
    )>,
  }
);

export const AboutThisBoardFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AboutThisBoard' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Board' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'boardPlugins' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'idPlugin' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'closed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'desc' } },
          { kind: 'Field', name: { kind: 'Name', value: 'descData' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idMemberCreator' } },
          { kind: 'Field', name: { kind: 'Name', value: 'idOrganization' } },
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

interface UseAboutThisBoardFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      AboutThisBoardFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseAboutThisBoardFragmentResult
  extends Omit<Apollo.UseFragmentResult<AboutThisBoardFragment>, 'data'> {
  data?: AboutThisBoardFragment;
}

export const useAboutThisBoardFragment = ({
  from,
  returnPartialData,
  ...options
}: UseAboutThisBoardFragmentOptions): UseAboutThisBoardFragmentResult => {
  const result = Apollo.useFragment<AboutThisBoardFragment>({
    ...options,
    fragment: AboutThisBoardFragmentDoc,
    fragmentName: 'AboutThisBoard',
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

  return { ...result, data: result.data as AboutThisBoardFragment };
};
