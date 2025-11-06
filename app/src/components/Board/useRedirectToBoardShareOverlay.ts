import { useEffect } from 'react';

import {
  addSearchParamsToLocation,
  getLocation,
  useSearchParams,
} from '@trello/router';
import { navigate } from '@trello/router/navigate';

export const useRedirectToBoardShareOverlay = (
  workspaceId?: string | null,
  enterpriseId?: string | null,
) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const inviteMemberId = searchParams.get('inviteMemberId');

    if (!inviteMemberId) {
      return;
    }

    if (!enterpriseId && !workspaceId) {
      return;
    }
    const location = addSearchParamsToLocation(getLocation(), {
      overlay: 'share',
    });
    navigate(`${location.pathname}${location.search}`, { trigger: false });
  }, [workspaceId, enterpriseId, searchParams]);
};
