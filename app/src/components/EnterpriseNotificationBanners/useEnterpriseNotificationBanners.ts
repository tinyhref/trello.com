import { useUndismissedEnterpriseBanners } from './useUndismissedEnterpriseBanners';

export const useEnterpriseNotificationBanners = (): {
  wouldRender: boolean;
} => {
  const { banners, loading } = useUndismissedEnterpriseBanners();
  const wouldRender = !loading && banners.length > 0;

  return {
    wouldRender,
  };
};
