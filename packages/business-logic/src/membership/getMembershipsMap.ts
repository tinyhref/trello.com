import type { Board, Organization } from '@trello/model-types';

type Model = Board | Organization;

export type MembershipsMap<
  TMemberships extends Pick<
    Model['memberships'][number],
    'idMember' | 'memberType'
  >[],
> = Map<string, TMemberships[number]>;

/**
 * Builds a Map of idMember to membership
 * @param memberships Array of memberships from board or organization
 * @returns Map
 */
export const getMembershipsMap = <
  TMemberships extends Pick<
    Model['memberships'][number],
    'idMember' | 'memberType'
  >[],
>(
  memberships: TMemberships,
): MembershipsMap<TMemberships> => {
  const membershipsMap = new Map();

  memberships.forEach((membership) =>
    membershipsMap.set(membership.idMember, membership),
  );

  return membershipsMap;
};
