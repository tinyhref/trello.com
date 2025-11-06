import { useMemberId } from '@trello/authentication';
import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';

import { useMandatoryTransferDateFragment } from './MandatoryTransferDateFragment.generated';

export const useAccountTransferRequiredBanner = (): {
  wouldRender: boolean;
} => {
  const memberId = useMemberId();
  const { isOneTimeMessageDismissed } = useOneTimeMessagesDismissed();
  const { data: member } = useMandatoryTransferDateFragment({
    from: { id: memberId },
    optimistic: true,
  });

  const wouldRender =
    !!member?.enterpriseWithRequiredConversion?.prefs?.mandatoryTransferDate &&
    !isOneTimeMessageDismissed('AccountTransferRequired');

  return {
    wouldRender,
  };
};
