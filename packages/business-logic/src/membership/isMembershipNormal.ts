import type {
  BoardMembership,
  OrganizationMembership,
} from '@trello/model-types';

import { isMembershipType } from './isMembershipType';

export const isMembershipNormal = (
  membership:
    | Pick<BoardMembership[number], 'memberType'>
    | Pick<OrganizationMembership[number], 'memberType'>,
) => isMembershipType(membership, 'normal');
