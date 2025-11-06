import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import type { tag } from '@trello/utility-types';
import * as Apollo from '@apollo/client';
import process from 'process';
export type __OpaqueBrandRef = typeof tag;
export type MirrorCardLastActivityFragment = (
  { __typename: 'Card' }
  & Pick<Types.Card, 'id' | 'dateLastActivity' | 'isTemplate'>
  & { pluginData: Array<(
    { __typename: 'PluginData' }
    & Pick<Types.PluginData, 'id' | 'idPlugin' | 'value'>
  )> }
);

export const MirrorCardLastActivityFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MirrorCardLastActivity' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Card' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'dateLastActivity' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'pluginData' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'idPlugin' } },
                { kind: 'Field', name: { kind: 'Name', value: 'value' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

interface UseMirrorCardLastActivityFragmentOptions
  extends Omit<
    Apollo.UseFragmentOptions<
      MirrorCardLastActivityFragment,
      Apollo.OperationVariables
    >,
    'fragment' | 'fragmentName' | 'from'
  > {
  from: (Apollo.StoreObject | Apollo.Reference) | null;
  returnPartialData?: boolean;
}

interface UseMirrorCardLastActivityFragmentResult
  extends Omit<
    Apollo.UseFragmentResult<MirrorCardLastActivityFragment>,
    'data'
  > {
  data?: MirrorCardLastActivityFragment;
}

export const useMirrorCardLastActivityFragment = ({
  from,
  returnPartialData,
  ...options
}: UseMirrorCardLastActivityFragmentOptions): UseMirrorCardLastActivityFragmentResult => {
  const result = Apollo.useFragment<MirrorCardLastActivityFragment>({
    ...options,
    fragment: MirrorCardLastActivityFragmentDoc,
    fragmentName: 'MirrorCardLastActivity',
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

  return { ...result, data: result.data as MirrorCardLastActivityFragment };
};
