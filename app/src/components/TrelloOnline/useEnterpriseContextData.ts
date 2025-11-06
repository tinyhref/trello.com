import { sendErrorEvent } from '@trello/error-reporting';

import { useEnterpriseContextDataQuery } from './EnterpriseContextDataQuery.generated';

export const useEnterpriseContextData = (orgId: string | null) => {
  const { data, error } = useEnterpriseContextDataQuery(
    orgId
      ? { variables: { orgId }, waitOn: ['None'] }
      : { skip: true, waitOn: ['None'] },
  );

  if (error) {
    sendErrorEvent(error, {
      tags: { ownershipArea: 'trello-enterprise' },
    });
  }

  return data;
};
