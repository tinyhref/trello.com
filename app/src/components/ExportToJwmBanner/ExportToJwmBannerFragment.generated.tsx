import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type ExportToJwmBannerFragment = (
  { __typename: 'Organization' }
  & Pick<Types.Organization, 'id' | 'creationMethod'>
  & { jwmLink?: Types.Maybe<(
    { __typename: 'JwmWorkspaceLink' }
    & Pick<Types.JwmWorkspaceLink, 'entityUrl' | 'idCloud' | 'inaccessible'>
  )> }
);

export const ExportToJwmBannerFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ExportToJwmBanner' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Organization' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'creationMethod' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'jwmLink' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'entityUrl' } },
                { kind: 'Field', name: { kind: 'Name', value: 'idCloud' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'inaccessible' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseExportToJwmBannerFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      ExportToJwmBannerFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseExportToJwmBannerFragmentResult
  extends Omit<Apollo.UseFragmentResult<ExportToJwmBannerFragment>, 'data'> {
  data?: ExportToJwmBannerFragment;
}

export const useExportToJwmBannerFragment = ({
  from,
  returnPartialData,
  ...options
}: UseExportToJwmBannerFragmentOptions): UseExportToJwmBannerFragmentResult => {
  const result = Apollo.useFragment<ExportToJwmBannerFragment>({
    ...options,
    fragment: ExportToJwmBannerFragmentDoc,
    fragmentName: 'ExportToJwmBanner',
    from:
      !from || !(from as Apollo.StoreObject)?.id
        ? null
        : { __typename: 'Organization', ...from },
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

  return { ...result, data: result.data as ExportToJwmBannerFragment };
};
