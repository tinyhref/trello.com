import type {
  BoardMembership,
  OrganizationMembership,
} from '@trello/model-types';

import { isMembershipType } from './isMembershipType';

type Membership = BoardMembership | OrganizationMembership;

export const isMembershipAdmin = (
  membership: Pick<Membership[number], 'memberType'>,
) => isMembershipType(membership, 'admin');
