import { isMemberLoggedIn, useMemberId } from '@trello/authentication';
import { useIsMemberOfOrganization } from '@trello/business-logic-react/organization';
import { useWorkspace } from '@trello/workspaces';

import { useFreeTrialBannerMemberFragment } from './FreeTrialBannerMemberFragment.generated';

export function useFreeTrialBanner() {
  const memberId = useMemberId();
  const { workspaceId } = useWorkspace();

  const { data } = useFreeTrialBannerMemberFragment({
    from: { id: memberId },
  });

  const isMemberOfOrganization = useIsMemberOfOrganization({
    idMember: memberId,
    idOrganization: workspaceId,
  });

  const wouldRender =
    isMemberLoggedIn() && data?.confirmed && isMemberOfOrganization;

  return {
    wouldRender,
  };
}
