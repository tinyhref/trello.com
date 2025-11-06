import { useContext } from 'react';

import { PlannerAccountIdContext } from './PlannerAccountIdContext';

export const usePlannerAccountId = () => {
  const accountId = useContext(PlannerAccountIdContext);

  // Normally, we would throw an error here if accountId is null. However, while we migrate to
  // multi-account functionality, we need to utilize this hook in cases where we're not wrapped
  // in a context provider. The consumer is responsible for handling falsy values for the time being.

  return accountId;
};
