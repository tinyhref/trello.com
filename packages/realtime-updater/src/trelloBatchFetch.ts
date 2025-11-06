import {
  getApiError,
  getErrorTextFromFetchResponse,
} from '@trello/error-handling';
import { trelloFetch } from '@trello/fetch';
import { getInvitationTokens } from '@trello/invitation-tokens/getInvitationTokens';

interface ErrorResponse {
  name: string;
  message: string;
  statusCode: number;
  stack: string;
}
type SuccessResponse = Record<'200', object>;

export const trelloBatchFetch = async <TResponseBody>(
  urls: string[],
  options: {
    operationName: string;
    headers?: Record<string, boolean | string | undefined>;
  },
) => {
  let apiUrl = `/1/batch?urls=${encodeURIComponent(urls.join(','))}`;

  const invitationTokens = getInvitationTokens();
  if (invitationTokens) {
    apiUrl = `${apiUrl}&invitationTokens=${encodeURIComponent(
      invitationTokens || '',
    )}`;
  }

  const response = await trelloFetch(
    apiUrl,
    {
      method: 'GET',
      headers: {
        ...(options.headers || {}),
      },
    },
    {
      networkRequestEventAttributes: {
        source: 'batch',
        operationName: options.operationName,
      },
    },
  );

  const results: [string, Error | null, TResponseBody | null][] = [];

  if (!response.ok) {
    const errorMessage = await getErrorTextFromFetchResponse(response);
    const error = getApiError(response.status, errorMessage);
    throw error;
  }

  const data: [ErrorResponse | SuccessResponse] = await response.json();

  for (let i = 0; i < data.length; i++) {
    const result = data[i];
    const url = urls[i];

    if ('200' in result) {
      results.push([url, null, result['200'] as unknown as TResponseBody]);
    } else {
      const apiError = getApiError(result.statusCode, result.message);
      results.push([url, apiError, null]);
    }
  }

  return results;
};
