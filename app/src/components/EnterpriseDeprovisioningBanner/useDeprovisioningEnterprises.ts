import { useMemberId } from '@trello/authentication';

import { useEnterprisesWithStandingQuery } from './EnterprisesWithStandingQuery.generated';
import { useMemberEnterprisesWithAdminQuery } from './MemberEnterprisesWithAdminQuery.generated';
import { useDeprovisioningDismissal } from './useDeprovisioningDismissal';

/**
 * This hook is used to retrieve the list of enterprises that a member is admin of
 * that is scheduled for deprovisioning.
 * @returns The list of enterprises that a member is admin of that is scheduled for deprovisioning
 */
export const useDeprovisioningEnterprises = () => {
  // Get member data
  const memberId = useMemberId();
  const { data: memberData, loading: memberLoading } =
    useMemberEnterprisesWithAdminQuery({
      variables: { memberId },
      waitOn: ['MemberHeader'],
    });

  // Is this a confirmed member?
  const member = memberData?.member;
  const isConfirmedMember = member?.confirmed;
  const isMemberAdminOfAnyEnterprises =
    member && member.idEnterprisesAdmin && member.idEnterprisesAdmin.length > 0;

  // Start with member's enterprises
  const enterprises = memberData?.member?.enterprises ?? [];

  // Filter enterprises by:
  // - Is the member an admin?
  // - Is the enterprise not a sandbox?
  // - Have we already checked the enterprises's standing within the last hour?
  // - Have we already shown this banner for the enterprises within the last hour?
  // - Has the user already dismissed this banner for the enterprise within the last 24 hours?
  const { isDismissed } = useDeprovisioningDismissal();
  const candidateEnterprises = enterprises.filter((enterprise) => {
    const enterpriseId = enterprise.id;
    const isMemberAnAdmin =
      isMemberAdminOfAnyEnterprises &&
      member.idEnterprisesAdmin.includes(enterprise.id);
    return (
      isConfirmedMember &&
      isMemberAnAdmin &&
      !enterprise.sandbox &&
      !isDismissed(enterpriseId)
    );
  });

  // Get enterprise standing data for the remaining enterprises (this is a more expensive operation, and so we're doing it after clearing the other checks)
  const { data: enterprisesData } = useEnterprisesWithStandingQuery({
    variables: {
      enterpriseIds: candidateEnterprises.map((enterprise) => enterprise.id),
    },
    skip: memberLoading || candidateEnterprises.length === 0,
    waitOn: ['None'],
  });

  // Filter enterprises by the ones that have `enterpriseStanding` greater than 0?
  return (
    enterprisesData?.enterprises?.filter(
      (enterprise) =>
        enterprise &&
        enterprise.paidAccount &&
        !!enterprise.paidAccount.enterpriseStanding,
    ) ?? []
  );
};
