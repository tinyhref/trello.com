import { useDeprovisioningEnterprises } from './useDeprovisioningEnterprises';

export const useEnterpriseDeprovisioningBanner = (): {
  wouldRender: boolean;
} => {
  const deprovisioningEnterprises = useDeprovisioningEnterprises();

  const wouldRender =
    !!deprovisioningEnterprises && deprovisioningEnterprises.length > 0;

  return {
    wouldRender,
  };
};
