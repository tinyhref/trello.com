// Don't import from index so that we can keep bundle size as low as possible

import { getInvitationTokens } from '@trello/invitation-tokens/getInvitationTokens';

/**
 * Utility function to share with loadApiDataFromQuickLoad so that the same
 * formatting is applied to urls in the same place. That way, we get a cache hit
 * @param url the QuickLoad url
 * @returns string url
 */
export const formatUrl = (
  url: string,
  { rootId, idModel }: { rootId: string; idModel: string },
): string => {
  // url will contain /1/Board/:idBoard or something similar, which we need to replace with the
  // ID grabbed from the url regexp.
  let finalUrl = url.replace(rootId, idModel);
  const cookie = window?.document?.cookie;

  if (new RegExp('^/1/search').test(url)) {
    const dscToken = /dsc=([^;]+)/.exec(cookie)?.[1];
    // We probably shouldn't be setting this to the string "undefined", but this
    // was to preserve the functionality of the code after conversion to TypeScript.
    finalUrl += `&dsc=${dscToken ?? 'undefined'}`;
  }

  const invitationTokens = getInvitationTokens();
  const hasQueryParams = finalUrl.includes('?');
  const separator = hasQueryParams ? '&' : '?';
  finalUrl += invitationTokens
    ? `${separator}invitationTokens=${invitationTokens}`
    : '';

  return finalUrl;
};
