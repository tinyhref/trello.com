import { useEffect, useState } from 'react';

import { useMemberId } from '@trello/authentication';

import { useMyOneTimeMessagesDismissedFragment } from './MyOneTimeMessagesDismissedFragment.generated';
import { oneTimeMessagesDismissedState } from './oneTimeMessagesDismissedState';

export const useInitializeOneTimeMessagesDismissedState = () => {
  const memberId = useMemberId();

  const { data: oneTimeMessagesDismissedData, complete } =
    useMyOneTimeMessagesDismissedFragment({
      from: { id: memberId },
      optimistic: false,
    });

  const [isStateInitialized, setIsStateInitialized] = useState(false);

  useEffect(() => {
    if (complete && !isStateInitialized) {
      oneTimeMessagesDismissedState.setValue({
        oneTimeMessagesDismissed:
          oneTimeMessagesDismissedData?.oneTimeMessagesDismissed || [],
        complete,
      });
      setIsStateInitialized(true);
    }
  }, [isStateInitialized, complete, oneTimeMessagesDismissedData]);
};
