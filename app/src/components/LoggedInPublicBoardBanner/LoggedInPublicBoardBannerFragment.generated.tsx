import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type LoggedInPublicBoardBannerFragment = (
  { __typename: 'Board' }
  & Pick<Types.Board, 'id' | 'closed'>
  & { prefs?: Types.Maybe<(
    { __typename: 'Board_Prefs' }
    & Pick<Types.Board_Prefs, 'isTemplate' | 'permissionLevel'>
  )> }
);

export const LoggedInPublicBoardBannerFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'LoggedInPublicBoardBanner' },
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

interface UseLoggedInPublicBoardBannerFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      LoggedInPublicBoardBannerFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseLoggedInPublicBoardBannerFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<LoggedInPublicBoardBannerFragment>,
    'data'
  > {
  data?: LoggedInPublicBoardBannerFragment;
}

export const useLoggedInPublicBoardBannerFragment = ({
  from,
  returnPartialData,
  ...options
}: UseLoggedInPublicBoardBannerFragmentOptions): UseLoggedInPublicBoardBannerFragmentResult => {
  const result = Apollo.useFragment<LoggedInPublicBoardBannerFragment>({
    ...options,
    fragment: LoggedInPublicBoardBannerFragmentDoc,
    fragmentName: 'LoggedInPublicBoardBanner',
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

  return { ...result, data: result.data as LoggedInPublicBoardBannerFragment };
};
