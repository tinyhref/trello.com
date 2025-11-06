import { useJwmLinkFragment } from './JwmLinkFragment.generated';
import { shouldHideLinkingDetails } from './shouldHideLinkingDetails';

/**
 * Will return jwmLink data for the given organization if it has a linked JWM instance.
 */
export const useJwmLinkOrganization = (workspaceId?: string) => {
  const { data } = useJwmLinkFragment({
    from: { id: workspaceId },
    variables: { orgId: workspaceId },
  });

  const hideLinkingDetails = shouldHideLinkingDetails(workspaceId);

  if (!data?.jwmLink || hideLinkingDetails) {
    return null;
  }

  return data.jwmLink;
};
