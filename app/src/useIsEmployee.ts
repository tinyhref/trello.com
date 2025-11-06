import { useMemberId } from '@trello/authentication';
import { atlassianTeams } from '@trello/config';
import { useDynamicConfig } from '@trello/dynamic-config';

import { useIsEmployeeFragment } from './IsEmployeeFragment.generated';

/**
 * React hook to determine if the current user should be considered an employee, for the purposes of showing
 * internal-only UI elements.
 */
export const useIsEmployee = (): boolean => {
  const memberId = useMemberId();
  const { data } = useIsEmployeeFragment({
    from: { id: memberId },
  });

  const isOnAtlassianTeamDynamicConfig = useDynamicConfig<boolean>(
    'trello_web_atlassian_team',
  );

  const isProdHostname = window.location.hostname !== 'trello.com';

  const onAtlassianTeamWithAtlassianEmail = !!(
    data?.email?.endsWith('@atlassian.com') &&
    data?.idOrganizations?.some((idOrg) => atlassianTeams.includes(idOrg))
  );

  return (
    isOnAtlassianTeamDynamicConfig ||
    isProdHostname ||
    onAtlassianTeamWithAtlassianEmail
  );
};
