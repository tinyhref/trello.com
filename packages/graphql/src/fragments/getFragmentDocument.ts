import type { DocumentNode } from 'graphql';
import { Kind } from 'graphql';

import type { CheckItemFullFragmentDoc } from './CheckItemFullFragment.generated';
import type { CurrentBoardFullCardFragmentDoc } from './CurrentBoardFullCardFragment.generated';
import type { CurrentBoardFullListFragmentDoc } from './CurrentBoardFullListFragment.generated';
import { fragmentRegistry } from './fragmentRegistry';

/**
 * Used when you need to do readFragment or writeFragment, passing in the
 * fragment document. You should register your fragment and add an override
 * here to retrieve it.
 * @param fragmentName The name of the fragment inside of your .graphql file
 */
export function getFragmentDocument(
  fragmentName: 'CurrentBoardFullCard',
): typeof CurrentBoardFullCardFragmentDoc;
export function getFragmentDocument(
  fragmentName: 'CurrentBoardFullList',
): typeof CurrentBoardFullListFragmentDoc;
export function getFragmentDocument(
  fragmentName: 'CheckItemFull',
): typeof CheckItemFullFragmentDoc;

export function getFragmentDocument(fragmentName: string): DocumentNode {
  const fragment = fragmentRegistry.lookup(fragmentName);

  if (!fragment) {
    throw new Error(
      `${fragmentName} not found. Make sure to add it to @trello/graphql/src/fragments and register it in the fragmentRegistry.`,
    );
  }

  return {
    kind: Kind.DOCUMENT,
    definitions: [fragment],
  };
}
