import { differenceInDays, differenceInHours } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';

import { useMemberId } from '@trello/authentication';

import { useAddMessageDismissedMutation } from './AddMessageDismissedMutation.generated';
import { useMyMessagesDismissedFragment } from './MyMessagesDismissedFragment.generated';

export const useMessagesDismissed = () => {
  const memberId = useMemberId();
  const [optimisticallyDismissedMessages, setOptimisticallyDismissedMessages] =
    useState<string[]>([]);

  const { data, complete } = useMyMessagesDismissedFragment({
    from: { id: memberId },
  });

  const [addMessageDismissed] = useAddMessageDismissedMutation();

  /**
   * The messages that have been dismissed by the current member
   */
  const messagesDismissed = useMemo(
    () => data?.messagesDismissed ?? [],
    [data?.messagesDismissed],
  );

  /**
   * Dismiss a message by name
   * @param name The name of the message to dismiss
   * @param options Options for dismissing the message
   * @param options.optimistic If `true`, the message will be dismissed optimistically before the mutation completes
   */
  const dismissMessage = useCallback(
    async (
      name: string,
      options: { optimistic?: boolean } = { optimistic: true },
    ) => {
      try {
        if (options.optimistic) {
          setOptimisticallyDismissedMessages(
            optimisticallyDismissedMessages.concat([name]),
          );
        }

        await addMessageDismissed({
          variables: {
            memberId: memberId || 'me',
            name,
            lastDismissed: new Date().toISOString(),
          },
        });
      } finally {
        setOptimisticallyDismissedMessages(
          optimisticallyDismissedMessages.filter(
            (messageName) => messageName !== name,
          ),
        );
      }
    },
    [
      addMessageDismissed,
      memberId,
      optimisticallyDismissedMessages,
      setOptimisticallyDismissedMessages,
    ],
  );

  /**
   * Was the given message previously dismissed?
   * @param name The name of the message to check
   * @returns `true` if the message was previously dismissed
   */
  const isMessageDismissed = useCallback(
    (name: string) =>
      complete
        ? messagesDismissed.some((message) => message.name === name) ||
          optimisticallyDismissedMessages.some(
            (messageName) => messageName === name,
          )
        : true,
    [messagesDismissed, optimisticallyDismissedMessages, complete],
  );

  /**
   * Has the message been dismissed within the given time period?
   * @param name The name of the message to check
   * @param quantity The number of days or hours in the time period you want to check for
   * @param unitOfMeasure The unit of measure for the time period you want to check for
   * @example `isMessageDismissedSince('some-message', 30) // true if 'some-message' was dismissed within the last 30 days`
   * @returns `true` if the message was dismissed within the given number of days or hours
   */
  const isMessageDismissedSince = useCallback(
    (name: string, quantity: number, unitOfMeasure: 'day' | 'hour' = 'day') => {
      const dismissedMessage = messagesDismissed.find(
        (message) => message.name === name,
      );

      if (!dismissedMessage) {
        return false;
      }

      // If we know that the message was previously dismissed, check to see if it was dismissed within the given time period
      const lastDismissed = dismissedMessage.lastDismissed;
      const diff =
        unitOfMeasure === 'day'
          ? differenceInDays(new Date(), new Date(lastDismissed))
          : differenceInHours(new Date(), new Date(lastDismissed));
      return diff < quantity;
    },
    [messagesDismissed],
  );

  return {
    messagesDismissed,
    dismissMessage,
    isMessageDismissed,
    isMessageDismissedSince,
  };
};
