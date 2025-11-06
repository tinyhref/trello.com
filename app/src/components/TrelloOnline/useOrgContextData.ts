import { sendErrorEvent } from '@trello/error-reporting';

import { useOrganizationContextDataQuery } from './OrganizationContextDataQuery.generated';

export const useOrgContextData = (orgId: string | null) => {
  const { data, error } = useOrganizationContextDataQuery(
    orgId
      ? { variables: { orgId }, waitOn: ['None'] }
      : { skip: true, waitOn: ['None'] },
  );

  if (error)
    sendErrorEvent(error, {
      tags: { ownershipArea: 'trello-web-eng' },
    });

  return data;
};
