import { useMemberId } from '@trello/authentication';
import { isProblem } from '@trello/paid-account';

import { useOverduePaymentBannerFragment } from './OverduePaymentBannerFragment.generated';

export const useOverdueWorkspace = () => {
  const memberId = useMemberId();
  const { data: memberData } = useOverduePaymentBannerFragment({
    from: { id: memberId },
    variables: { memberId },
  });

  return memberData?.organizations?.find(
    (organization) =>
      organization.paidAccount &&
      isProblem(organization.paidAccount?.standing) &&
      !organization.paidAccount?.needsCreditCardUpdate,
  );
};
