import type { Member } from '@trello/model-types';

export const isPremOrganizationAdmin = (
  member: {
    idPremOrgsAdmin?: Member['idPremOrgsAdmin'] | null;
  },
  idOrganization: string,
): boolean => {
  return !!member.idPremOrgsAdmin?.includes(idOrganization);
};
