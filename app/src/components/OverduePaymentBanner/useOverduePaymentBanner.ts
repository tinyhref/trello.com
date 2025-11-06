import { useMessagesDismissed } from '@trello/business-logic-react/member';

import { getBannerMessageName } from './getBannerMessageName';
import { useOverdueWorkspace } from './useOverdueWorkspace';

export function useOverduePaymentBanner() {
  const overdueWorkspace = useOverdueWorkspace();
  const { isMessageDismissed } = useMessagesDismissed();
  const { id, paidAccount } = overdueWorkspace || {};

  if (!id || !paidAccount) {
    return {
      wouldRender: false,
    };
  }

  // there's an overdue workspace, so we need to check if the banner has been dismissed
  const bannerName = getBannerMessageName(id, paidAccount);

  return {
    wouldRender: !isMessageDismissed(bannerName),
  };
}
