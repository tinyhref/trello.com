import { useCallback } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { useMessagesDismissed } from '@trello/business-logic-react/member';
import { getScreenFromUrl } from '@trello/marketing-screens';

const DISMISSAL_KEY_PREFIX = 'enterprise-deprovisioning-banner';

type UseDeprovisioningDismissal = () => {
  dismiss: (enterpriseId: string) => void;
  isDismissed: (enterpriseId: string) => boolean;
};

/**
 * Wraps the dismissedSince function to make it easier to use for the enterprise deprovisioning banner.
 * The main dismissal is based on a 24 hour check.
 * Dismiss includes a call to Analytics to track the dismissal.
 * @returns dismiss and isDismissed functions
 */
export const useDeprovisioningDismissal: UseDeprovisioningDismissal = () => {
  const { isMessageDismissedSince, dismissMessage } = useMessagesDismissed();

  // Standard dismissal (24 hours check)
  const dismiss = useCallback(
    (enterpriseId: string) => {
      Analytics.sendDismissedComponentEvent({
        componentType: 'banner',
        componentName: 'enterpriseDeprovisioningBanner',
        source: getScreenFromUrl(),
        containers: {
          enterprise: {
            id: enterpriseId,
          },
        },
      });
      return dismissMessage(`${DISMISSAL_KEY_PREFIX}-${enterpriseId}`);
    },
    [dismissMessage],
  );
  const isDismissed = useCallback(
    (enterpriseId: string) =>
      isMessageDismissedSince(
        `${DISMISSAL_KEY_PREFIX}-${enterpriseId}`,
        24,
        'hour',
      ),
    [isMessageDismissedSince],
  );

  return {
    dismiss,
    isDismissed,
  };
};
