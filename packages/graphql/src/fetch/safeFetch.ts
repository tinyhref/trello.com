// eslint-disable-next-line no-restricted-imports
import type { TrelloRequestInit } from '@trello/fetch';
// eslint-disable-next-line no-restricted-imports
import { fetch as originalFetch } from '@trello/fetch';
import type { SafeUrl } from '@trello/safe-urls';

/**
 * Wraps the `fetch` function from `@trello/fetch` to ensure that the URL is sanitized.
 *
 * @param url - The sanitized URL to fetch.
 * @param init - The request options.
 * @returns A promise that resolves to the response.
 */
export const safeFetch = (
  url: SafeUrl,
  init?: TrelloRequestInit,
): Promise<Response> => {
  return originalFetch(url as unknown as string, init as RequestInit);
};
