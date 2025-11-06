import { getApiGatewayUrl } from '@trello/api-gateway';
import { Analytics } from '@trello/atlassian-analytics';
import { clientVersion } from '@trello/config';
import {
  ApiError,
  getApiError,
  getErrorTextFromFetchResponse,
  isFetchCancellationError,
} from '@trello/error-handling';
import { fetch } from '@trello/fetch';

import type { TraitName, TraitValue } from './traits';

export interface Attribute {
  name: TraitName;
  value: TraitValue;
}

export const fetchUserPersonalization = async (
  userId: string,
): Promise<{ attributes: Attribute[] | undefined }> => {
  const url = getApiGatewayUrl(
    `/tap-delivery/api/v3/personalization/user/${userId}`,
  );

  // Get feature gate value once at the beginning
  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': clientVersion,
      },
    });

    if (response.ok) {
      return response.json();
    } else {
      if (response.status === 401) {
        return { attributes: [] };
      }

      const errorMessage = await getErrorTextFromFetchResponse(response);

      throw getApiError(response.status, errorMessage);
    }
  } catch (error: Error | typeof ApiError) {
    if (error instanceof Error && isFetchCancellationError(error)) {
      // Return empty attributes for fetch cancellation errors
      return { attributes: undefined };
    }

    // we expect this is if the user's Aa is not valid
    Analytics.sendOperationalEvent({
      action: 'errored',
      actionSubject: 'fetchUserPersonalization',
      source: '@trello/atlassian-personalization',
      attributes: {
        errorMessage:
          error instanceof ApiError
            ? error.toString()
            : error instanceof Error
              ? error.message
              : 'Unknown error',
      },
    });

    // Re-throw other errors
    throw error;
  }
};
