import { useMemo } from 'react';

// eslint-disable-next-line no-restricted-imports
import type { CustomAttributes } from '@atlaskit/feature-gate-js-client';
import { getMemberId } from '@trello/authentication';
import { isDesktop, isTouch } from '@trello/browser';
import { useCachedMemberEnterpriseData } from '@trello/business-logic-react/member';
import { bifrostTrack, client, locale } from '@trello/config';
import { idToDate } from '@trello/dates';
import { dangerouslyConvertPrivacyString } from '@trello/privacy';
import { useSharedState } from '@trello/shared-state';
import { workspaceState } from '@trello/workspace-state';

import { usePersonalProductivityCohortValue } from 'app/src/components/PersonalProductivityBeta';
import { useMemberCustomAttributesFragment } from './MemberCustomAttributesFragment.generated';

export const useFeatureGateClientCustomAttributes: () => CustomAttributes =
  () => {
    const trelloMemberId = getMemberId() || '';

    const [workspaceStateValue] = useSharedState(workspaceState);
    const { workspaceId } = workspaceStateValue;
    const { data: memberData } = useMemberCustomAttributesFragment({
      from: { id: trelloMemberId },
    });

    const enterpriseData = useCachedMemberEnterpriseData(trelloMemberId);

    const inEnterprise = enterpriseData.inEnterprise;

    const inRealEnterprise = enterpriseData.inRealEnterprise;

    const idEnterprise = enterpriseData.idEnterprise;

    const hasEnterpriseDomain = enterpriseData.hasEnterpriseDomain;

    const signupDate = trelloMemberId
      ? idToDate(trelloMemberId).getTime()
      : undefined;

    const isPremium = memberData?.premiumFeatures?.includes('isPremium');
    const isStandard = memberData?.premiumFeatures?.includes('isStandard');

    const emailDomain = dangerouslyConvertPrivacyString(
      memberData?.email,
    )?.split('@')[1];

    const isClaimable = memberData?.logins?.some((login) => login.claimable);
    const hasMultipleEmails = (memberData?.logins || []).length > 1;
    // TODO Fire Sentry error when over character limit go/j//TJC-1520
    // Limit to 100 idEnterprises to keep the custom attributes length under 4096 chars
    const idEnterprises = enterpriseData.idEnterprises.slice(0, 10);
    const premiumFeatures = memberData?.premiumFeatures;
    // Limit to 100 workspaceIds to keep the custom attributes length under 4096 chars
    const workspaceIds = memberData?.organizations
      ?.map(({ id }) => id)
      .slice(0, 100);

    const userCohortPersonalProductivity = usePersonalProductivityCohortValue();

    return useMemo(() => {
      const customAttributes = Object.entries({
        inEnterprise,
        version: client.version,
        locale,
        isDesktop: isDesktop(),
        isTouch: isTouch(),
        workspaceId,
        idEnterprise,
        idEnterprises,
        workspaceIds,
        signupDate,
        channel: bifrostTrack,
        isPremium,
        isStandard,
        emailDomain,
        userEmailDomain: emailDomain,
        isClaimable,
        hasMultipleEmails,
        premiumFeatures,
        userCohortPersonalProductivity,
        inRealEnterprise,
        hasEnterpriseDomain,
      });

      // Statsig custom attributes can't be null or undefined
      return customAttributes.reduce((result, [key, value]) => {
        if (value !== null && value !== undefined) {
          return { ...result, [key]: value };
        }
        return result;
      }, {});
    }, [
      emailDomain,
      hasMultipleEmails,
      idEnterprise,
      idEnterprises,
      inEnterprise,
      inRealEnterprise,
      isClaimable,
      isPremium,
      isStandard,
      hasEnterpriseDomain,
      premiumFeatures,
      signupDate,
      userCohortPersonalProductivity,
      workspaceId,
      workspaceIds,
    ]);
  };
