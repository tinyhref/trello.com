// eslint-disable-next-line no-restricted-imports
import type { TrelloFetchOptions, TrelloRequestInit } from '@trello/fetch';
// eslint-disable-next-line no-restricted-imports
import { trelloFetch } from '@trello/fetch';
import type { SafeUrl } from '@trello/safe-urls';

/**
 * Wraps the `trelloFetch` function from `@trello/fetch` to ensure that the URL is sanitized.
 *
 * @param url - The sanitized URL to fetch.
 * @param init - The request options.
 * @param options - The trelloFetch options.
 * @returns A promise that resolves to the response.
 */
export const safeTrelloFetch = (
  url: SafeUrl,
  init?: TrelloRequestInit,
  options?: TrelloFetchOptions,
): Promise<Response> => {
  return trelloFetch(url as unknown as string, init, options);
};
