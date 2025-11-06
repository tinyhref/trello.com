import { useMemo } from 'react';

import { useMemberId } from '@trello/authentication';
import { useMessagesDismissed } from '@trello/business-logic-react/member';

import { getSeatCapThreshold } from './getSeatCapThreshold';
import { useMemberOrganizationsQuery } from './MemberOrganizationsQuery.generated';
import { useOwnedBillablePremiumOrganizations } from './useOwnedBillablePremiumOrganizations';

export const usePremiumPOSeatCapBanner = (): {
  wouldRender: boolean;
} => {
  const { isMessageDismissedSince } = useMessagesDismissed();

  const memberId = useMemberId();
  const { data } = useMemberOrganizationsQuery({
    variables: { memberId },
    waitOn: ['MemberHeader'],
  });
  const billablePremiumOrganizations = useOwnedBillablePremiumOrganizations(
    data?.member,
  );

  // If any of the billable premium organizations are below the seat cap threshold
  // and the message has not been dismissed in the last 30 days, we should render the banner
  const wouldRender = useMemo(
    () =>
      billablePremiumOrganizations.some((organization) => {
        const availableLicenses = organization.availableLicenseCount;
        const maxMembers = organization.maximumLicenseCount;
        if (
          typeof availableLicenses === 'undefined' ||
          availableLicenses === null ||
          !maxMembers
        ) {
          return false;
        }

        const threshold = getSeatCapThreshold(maxMembers);
        const enterpriseId = organization.idEnterprise;

        return (
          availableLicenses <= threshold &&
          !isMessageDismissedSince(
            `enterprise-license-banner-${enterpriseId}`,
            30,
          )
        );
      }),
    [billablePremiumOrganizations, isMessageDismissedSince],
  );

  return {
    wouldRender,
  };
};
