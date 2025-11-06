import type { Member } from '@trello/model-types';

/**
 * Checks the following requirements to validate whether a user is considered to be a Paid Managed Enterprise Member:
 * A user is considered a Paid Managed Enterprise Member if all of the
 * following are true:
 *
 * - The user has a confirmed email
 * - The user has an `idEnterprise` (this designates them as managed)
 * - The user has a license for that enterprise
 */
export const isPaidManagedEnterpriseMember = ({
  confirmed = false,
  idEnterprise = null,
  enterpriseLicenses,
}: {
  confirmed?: Member['confirmed'];
  idEnterprise?: string | null;
  enterpriseLicenses?:
    | Pick<Member['enterpriseLicenses'][number], 'idEnterprise' | 'type'>[]
    | null;
}): boolean => {
  if (!confirmed || !idEnterprise || !enterpriseLicenses) {
    return false;
  }
  return Boolean(
    enterpriseLicenses.filter((license) => {
      return license.type === 'team' && license.idEnterprise === idEnterprise;
    }).length > 0,
  );
};
