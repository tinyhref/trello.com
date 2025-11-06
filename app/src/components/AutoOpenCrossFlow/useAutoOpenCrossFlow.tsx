import { useMemo } from 'react';

import { useMemberId } from '@trello/authentication';
import { useHasValidAaSession } from '@trello/heartbeat/session';
import { TrelloStorage } from '@trello/storage';

import { useAutoOpenCrossFlowMemberFragment } from './AutoOpenCrossFlowMemberFragment.generated';

const AUTO_OPEN_CFFE_STORAGE_KEY = 'autoOpenCFFE';

export function useAutoOpenCrossFlow() {
  const [hasValidAaSession] = useHasValidAaSession();

  const memberId = useMemberId();
  const { data: member } = useAutoOpenCrossFlowMemberFragment({
    from: { id: memberId },
  });

  //Auto open Trello crossFlow if user is
  //returning from login to validate AA session
  const hasStorageKey = useMemo(
    () => TrelloStorage.get(AUTO_OPEN_CFFE_STORAGE_KEY),
    [],
  );

  const shouldAutoOpenCrossFlow =
    hasStorageKey && hasValidAaSession && member?.confirmed;

  return {
    wouldRender: shouldAutoOpenCrossFlow || false,
  };
}
