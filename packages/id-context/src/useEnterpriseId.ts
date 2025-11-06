import { useContext } from 'react';

import { EnterpriseIdContext } from './EnterpriseIdContext';

export const useEnterpriseId = () => {
  const enterpriseId = useContext(EnterpriseIdContext);

  return enterpriseId;
};
