import type { Member } from '@trello/model-types';

/**
 * Checks if a user has a Paid Enterprise License.
 * A user is considered to have a license when:
 *  - The type of license is "team"
 */
export const isPaidLicensedEnterpriseMember = (member: {
  enterpriseLicenses?:
    | Pick<Member['enterpriseLicenses'][number], 'type'>[]
    | null;
}): boolean => {
  if (!member.enterpriseLicenses) {
    return false;
  }
  return Boolean(
    member.enterpriseLicenses.filter((license) => {
      return license.type === 'team';
    }).length > 0,
  );
};
