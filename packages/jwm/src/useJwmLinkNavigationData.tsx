import { useMemo } from 'react';

import { useMemberId } from '@trello/authentication';

import { getJwmEntityNavigationUrl } from './getJwmEntityNavigationUrl';
import { useJwmLinkFragment } from './JwmLinkFragment.generated';
import { useMemberEmailFragment } from './MemberEmailFragment.generated';
import { shouldHideLinkingDetails } from './shouldHideLinkingDetails';
import { useIsInstanceMember } from './useIsInstanceMember';

export type JwmLinkNavData =
  | {
      jwmSiteUrl: string;
      jwmProjectsUrl: string;
      showJoinButton: boolean;
    }
  | {
      jwmSiteUrl: undefined;
      jwmProjectsUrl: undefined;
      showJoinButton: false;
    };

/**
 * Will return the correct url for JWM navigation links depending on the user's instance permissions
 * Also returns a boolean to indicate if the join button should be rendered beside the navigation link
 */
export const useJwmLinkNavigationData = (orgId?: string): JwmLinkNavData => {
  const memberId = useMemberId();
  const { data: memberData } = useMemberEmailFragment({
    from: { id: memberId },
    variables: { memberId },
  });
  const email = memberData?.email || undefined;

  const { data } = useJwmLinkFragment({
    from: { id: orgId },
    variables: { orgId },
  });
  const cloudId = data?.jwmLink?.idCloud;
  const entityUrl = data?.jwmLink?.entityUrl || undefined;
  const online = !data?.jwmLink?.inaccessible;

  const { loading, isInstanceMember } = useIsInstanceMember(cloudId);

  const hideLinkingDetails = shouldHideLinkingDetails(orgId);

  const linkData: JwmLinkNavData = useMemo(() => {
    if (!entityUrl || !online || hideLinkingDetails) {
      return {
        jwmSiteUrl: undefined,
        jwmSiteJoinedUrl: undefined,
        showJoinButton: false,
      };
    } else {
      // Don't show the join button until it's confirmed they are not a member (loading is finished)
      const showJoinButton = !loading && !isInstanceMember;

      const { jwmYourWorkUrl, jwmProjectsUrl } = getJwmEntityNavigationUrl({
        entityUrl,
        email,
      });
      return {
        // TODO there shouldn't be a deicison made here, but in the consumer instead
        jwmSiteUrl: showJoinButton ? jwmYourWorkUrl : jwmProjectsUrl,
        jwmProjectsUrl,
        showJoinButton,
      };
    }
  }, [entityUrl, online, hideLinkingDetails, loading, isInstanceMember, email]);

  return linkData;
};
