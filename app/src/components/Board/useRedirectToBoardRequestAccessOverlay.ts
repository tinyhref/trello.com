import { useEffect } from 'react';

import { isDesktop, isTouch } from '@trello/browser';
import {
  addSearchParamsToLocation,
  getLocation,
  useSearchParams,
} from '@trello/router';
import { navigate } from '@trello/router/navigate';

export const useRedirectToBoardRequestAccessOverlay = (
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
    if (!isDesktop() && !isTouch()) {
      // Navigate to request access overlay
      const location = addSearchParamsToLocation(getLocation(), {
        overlay: 'request-access',
      });
      navigate(`${location.pathname}${location.search}`, { trigger: false });
    }
  }, [enterpriseId, searchParams, workspaceId]);
};
