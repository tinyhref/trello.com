import { useMemberId } from '@trello/authentication';

import { useColorBlindSupportFragment } from './ColorBlindSupportFragment.generated';

/**
 * Readonly representation of whether the user has color blind prefs enabled.
 */
export const useIsColorBlind = () => {
  const memberId = useMemberId();
  const { data } = useColorBlindSupportFragment({
    from: { id: memberId },
    optimistic: true,
  });

  return data?.prefs?.colorBlind ?? false;
};
