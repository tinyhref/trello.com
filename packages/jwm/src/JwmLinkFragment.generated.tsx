import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type JwmLinkFragment = (
  { __typename: 'Organization' }
  & Pick<Types.Organization, 'id' | 'creationMethod'>
  & { jwmLink?: Types.Maybe<(
    { __typename: 'JwmWorkspaceLink' }
    & Pick<
      Types.JwmWorkspaceLink,
      | 'crossflowTouchpoint'
      | 'entityUrl'
      | 'idCloud'
      | 'inaccessible'
    >
  )> }
);

export const JwmLinkFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'JwmLink' },
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
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'crossflowTouchpoint' },
                },
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

interface UseJwmLinkFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<JwmLinkFragment, Apollo.OperationVariables>,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseJwmLinkFragmentResult
  extends Omit<Apollo.UseFragmentResult<JwmLinkFragment>, 'data'> {
  data?: JwmLinkFragment;
}

export const useJwmLinkFragment = ({
  from,
  returnPartialData,
  ...options
}: UseJwmLinkFragmentOptions): UseJwmLinkFragmentResult => {
  const result = Apollo.useFragment<JwmLinkFragment>({
    ...options,
    fragment: JwmLinkFragmentDoc,
    fragmentName: 'JwmLink',
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

  return { ...result, data: result.data as JwmLinkFragment };
};
