import { RequiresAaOnboardingTemplates } from '@trello/aa-migration';
import { useMemberId } from '@trello/authentication';

import { useAtlassianAccountOnboardingQuery } from './AtlassianAccountOnboardingQuery.generated';

interface Options {
  skip?: boolean;
}

export function useAtlassianManagedAccountOverlay({
  skip = false,
}: Options = {}) {
  const memberId = useMemberId();
  const { data } = useAtlassianAccountOnboardingQuery({
    variables: { memberId },
    skip,
    waitOn: ['MemberHeader'],
  });

  const me = data?.member;

  const { enterprise, profile, template } = me?.requiresAaOnboarding || {};

  const shouldRender = !!(
    enterprise &&
    profile &&
    template === RequiresAaOnboardingTemplates.NEWLY_MANAGED
  );

  return {
    me,
    hasBoards: !!me?.idBoards.length,
    shouldRender,
  };
}
