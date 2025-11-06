const encodedErrorRegex = /https:\/\/go.apollo.dev\/c\/err#(.*)$/;
/**
 * See {@link @apollo/client/invariantErrorCodes.js} for details.
 */
const MISSING_FIELD_MESSAGE_ID = 12;

const isMissingFieldError = (message: string = ''): boolean => {
  /**
   * This path will be hit in non-production environments
   * (see {@link loadErrorMessagesForApolloClient}):
   */
  if (message.startsWith('Missing field')) {
    return true;
  }

  // This path will be hit in production environments:
  try {
    const encodedErrorRegexMatches = message.match(encodedErrorRegex);
    if (encodedErrorRegexMatches?.[1]) {
      const encodedError = encodedErrorRegexMatches[1];
      const decodedError = JSON.parse(decodeURIComponent(encodedError));

      if (decodedError?.message === MISSING_FIELD_MESSAGE_ID) {
        return true;
      }
    }
  } catch (e) {
    return false;
  }

  return false;
};

/**
 * During filter patching, we can safely ignore "Missing field" errors thrown by
 * Apollo client. These happen because we are using one query that includes
 * aliases for the possible filters. But if we don't have existing data for
 * those filters, we don't want to write new data to the cache. So instead,
 * we only write part of the data, and as a result Apollo complains.
 */
export function muteMissingFieldErrors(): () => void {
  const consoleError = console.error;

  console.error = function (message, ...args) {
    if (isMissingFieldError(message)) {
      return;
    }

    consoleError.apply(console, [message, ...args]);
  };

  // Restore the global console.error method.
  return () => {
    console.error = consoleError;
  };
}
