import type { FunctionComponent } from 'react';

import { useNativeBoardQuickloadAndSubscription } from 'app/src/components/App/useNativeBoardQuickloadAndSubscription';
import { BoardName } from './BoardName';
import type { BoardNameProps } from './BoardName.types';
import { NativeBoardName } from './NativeBoardName';

type BoardNameEntryProps = BoardNameProps & {
  /** The ari-based board id from the native gql schema */
  nativeBoardId?: string;
};

/**
 * This component is only needed while we're transitioning from the old BoardName using
 * client-side graphql data to the new BoardName using native (server-side) graphql data.
 * Once we fully shift to the new version, this component will be removed, and `NativeBoardName`
 * can be renamed to `BoardName`.
 * @param boardId - Legacy board Id of the board that we're currently rendering
 * @param nativeBoardId - The ari-based board id from the native gql schema
 * @returns The board name component based on the current migration status
 */
export const BoardNameEntry: FunctionComponent<BoardNameEntryProps> = ({
  boardId,
  nativeBoardId,
}) => {
  const isNativeQuickloadAndSubscriptionsEnabled =
    useNativeBoardQuickloadAndSubscription();

  return isNativeQuickloadAndSubscriptionsEnabled && nativeBoardId ? (
    <NativeBoardName boardId={nativeBoardId} />
  ) : (
    <BoardName boardId={boardId} />
  );
};
