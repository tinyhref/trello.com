import { Analytics } from '@trello/atlassian-analytics';

export const syncError = function (
  err: Error,
  {
    isUsingSocket,
    syncErrorAlreadyReported,
  }: { isUsingSocket: boolean; syncErrorAlreadyReported: boolean },
) {
  if (!syncErrorAlreadyReported) {
    // We get back an error message that will contain something like
    // "ixSinceUpdate too high: 2 > 1 (...id...)"
    // "ixSinceUpdate too low. 1 < 2 (...id...)"
    const parts =
      /too (low|high)[.:]\s+(\d+)\s[<>]\s(\d+)/.exec(err.message) || [];
    const [, lowOrHigh, value1, value2] = parts;

    Analytics.sendOperationalEvent({
      action: 'errored',
      actionSubject: 'syncError',
      source: `network:${isUsingSocket ? 'socket' : 'ajax'}`,
      attributes: {
        type: isUsingSocket ? 'socket' : 'ajax',
        queueLength:
          parts !== null
            ? lowOrHigh === 'high'
              ? 'tooHigh'
              : 'tooLow'
            : 'unknown',
        delta:
          parts !== null
            ? Math.abs(parseInt(value1, 10) - parseInt(value2, 10))
            : undefined,
      },
    });
  }
};
