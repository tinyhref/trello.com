import { useCallback } from 'react';

import { useMemberId } from '@trello/authentication';
import { useSharedState } from '@trello/shared-state';

import { useAddOneTimeMessageDismissedMutation } from './AddOneTimeMessageDismissedMutation.generated';
import { oneTimeMessagesDismissedState } from './oneTimeMessagesDismissedState';

export const useOneTimeMessagesDismissed = () => {
  const memberId = useMemberId();

  const [{ oneTimeMessagesDismissed, complete }, setOneTimeMessagesDismissed] =
    useSharedState(oneTimeMessagesDismissedState);

  const [addOneTimeMessageDismissed] = useAddOneTimeMessageDismissedMutation();

  // This was added due to an issue where this hook was being called too early,
  // causing a temporary flash before all data was loaded. We want to assume messages
  // are dismissed by default (true) because UX is better for things to appear into view
  // than for things to flash and then disappear.
  const isOneTimeMessageDismissed = useCallback(
    (messageId: string) =>
      complete
        ? oneTimeMessagesDismissed.some((message) => message === messageId)
        : true,
    [oneTimeMessagesDismissed, complete],
  );

  const dismissOneTimeMessage = useCallback(
    async (
      messageId: string,
      options: { optimistic?: boolean } = { optimistic: true },
    ) => {
      // get current state values to avoid closure issues
      const currentOneTimeMessagesDismissed =
        oneTimeMessagesDismissedState.value?.oneTimeMessagesDismissed || [];
      const currentComplete =
        oneTimeMessagesDismissedState.value?.complete || false;

      // if message is already dismissed, do nothing
      if (
        currentComplete &&
        currentOneTimeMessagesDismissed.some((message) => message === messageId)
      ) {
        return;
      }

      const newOneTimeMessagesDismissed =
        currentOneTimeMessagesDismissed.concat(messageId);

      setOneTimeMessagesDismissed({
        oneTimeMessagesDismissed: newOneTimeMessagesDismissed,
      });

      return addOneTimeMessageDismissed({
        variables: {
          memberId: memberId || 'me',
          messageId,
        },
        optimisticResponse: options?.optimistic
          ? {
              __typename: 'Mutation',
              addOneTimeMessagesDismissed: {
                id: memberId || 'me',
                oneTimeMessagesDismissed: newOneTimeMessagesDismissed,
                __typename: 'Member',
              },
            }
          : undefined,
      });
    },
    [addOneTimeMessageDismissed, memberId, setOneTimeMessagesDismissed],
  );

  return {
    oneTimeMessagesDismissed,
    dismissOneTimeMessage,
    isOneTimeMessageDismissed,
  };
};
