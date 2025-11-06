import { useMemberId } from '@trello/authentication';

import { useSandboxEnterpriseFragment } from './SandboxEnterpriseFragment.generated';
import { useBoardEnterpriseId } from './useBoardEnterpriseId';

export const useSandboxEnterpriseBanner = () => {
  const memberId = useMemberId();

  const { data: member } = useSandboxEnterpriseFragment({
    from: { id: memberId },
    optimistic: true,
  });

  // If the member has any sandbox enterprises, then we need to see if the current board is under a sandbox enterprise.
  const enterpriseId = useBoardEnterpriseId();

  // Get the enterprise from the user's list of enterprises that matches the current board's enterprise id.
  const enterprise = member?.enterprises?.find(({ id }) => id === enterpriseId);

  const sandbox = enterprise?.sandbox;

  return {
    wouldRender: sandbox,
  };
};
