import { useMemberId } from '@trello/authentication';
import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';

import { createBannerDismissalKey } from './createBannerDismissalKey';
import { useEnterpriseNotificationsQuery } from './EnterpriseNotificationsQuery.generated';

export type EnterpriseBanner = {
  enterpriseId: string;
  enterpriseName: string;
  id?: string;
  message: string;
};

/**
 * Retrieve a list of notifications from the enterprises that the member is a part of.
 * @returns A list of enterprise notifications that are available for display.
 */
export const useUndismissedEnterpriseBanners = (): {
  loading: boolean;
  banners: EnterpriseBanner[];
} => {
  const { isOneTimeMessageDismissed } = useOneTimeMessagesDismissed();
  const memberId = useMemberId();
  const { data, loading } = useEnterpriseNotificationsQuery({
    variables: { memberId },
    waitOn: ['MemberHeader'],
  });

  const member = data?.member;
  const enterprises = member?.enterprises ?? [];
  const enterprisesWithBanners = enterprises.filter((enterprise) => {
    const notifications = enterprise?.prefs?.notifications;
    return notifications?.banners && notifications.banners.length > 0;
  });

  const allBanners = enterprisesWithBanners
    .map((enterprise) => {
      const enterpriseId = enterprise.id;
      const enterpriseName = enterprise.displayName;
      const banners = enterprise?.prefs?.notifications?.banners;

      // Add the enterpriseId to each banner
      const bannersToReturn: EnterpriseBanner[] =
        banners?.map((banner) => ({
          ...banner,
          id: banner.id ?? undefined,
          enterpriseId,
          enterpriseName,
        })) ?? [];

      return bannersToReturn;
    })
    .flat();

  const unDismissedBanners = allBanners.filter((banner) => {
    return !isOneTimeMessageDismissed(
      createBannerDismissalKey(banner.enterpriseId, banner.id),
    );
  });

  return {
    loading,
    banners: unDismissedBanners,
  };
};
