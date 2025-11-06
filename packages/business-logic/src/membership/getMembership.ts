import type { Board, Organization } from '@trello/model-types';

type Model = Board | Organization;

export const getMembership = <
  TInputMemberships extends Pick<Model['memberships'][number], 'idMember'>[],
>(
  memberships: TInputMemberships,
  memberId: string,
): TInputMemberships[number] | undefined => {
  // There are cases where `memberships` are returning null
  // and are not caught by typescript
  // TODO investigate how model.memberships can be null and why
  // typescript is not catching these errors
  if (!memberships) {
    return;
  }

  return memberships.find((membership) => membership.idMember === memberId);
};
