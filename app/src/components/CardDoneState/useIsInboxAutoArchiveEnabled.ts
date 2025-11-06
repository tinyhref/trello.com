import { useBoardId } from '@trello/id-context';

import { useIsInboxBoard } from 'app/src/components/Inbox';
import { useBoardAutoArchivePrefFragment } from './BoardAutoArchivePrefFragment.generated';

export const useIsInboxAutoArchiveEnabled: () => boolean = () => {
  const isInboxBoard = useIsInboxBoard();
  const boardId = useBoardId();

  const { data: boardAutoArchivePref } = useBoardAutoArchivePrefFragment({
    from: { id: boardId },
  });

  const autoArchiveBoardPref = boardAutoArchivePref?.prefs?.autoArchive;

  return Boolean(isInboxBoard && autoArchiveBoardPref);
};
