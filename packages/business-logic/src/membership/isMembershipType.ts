import type {
  BoardMembership,
  OrganizationMembership,
} from '@trello/model-types';

type MembershipType =
  | BoardMembership[number]['memberType']
  | OrganizationMembership[number]['memberType'];

export const isMembershipType = (
  membership:
    | Pick<BoardMembership[number], 'memberType'>
    | Pick<OrganizationMembership[number], 'memberType'>,
  membershipType: MembershipType,
) => membership.memberType === membershipType;
