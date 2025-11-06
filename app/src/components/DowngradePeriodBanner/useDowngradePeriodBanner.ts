import { isMemberLoggedIn, useMemberId } from '@trello/authentication';
import { useOrganizationMembershipType } from '@trello/business-logic-react/organization';
import { useWorkspace } from '@trello/workspaces';

import { useDowngradePeriodBannerMemberFragment } from './DowngradePeriodBannerMemberFragment.generated';

export function useDowngradePeriodBanner() {
  const memberId = useMemberId();
  const { workspaceId } = useWorkspace();

  const orgMembershipType = useOrganizationMembershipType({
    idMember: memberId,
    idOrganization: workspaceId,
  });

  const { data: member } = useDowngradePeriodBannerMemberFragment({
    from: { id: memberId },
  });

  const wouldRender =
    // We only show this banner to workspace admins as workspace members do not
    // have access to the organization.paidAccount field
    isMemberLoggedIn() && member?.confirmed && orgMembershipType === 'admin';

  return {
    wouldRender,
  };
}
