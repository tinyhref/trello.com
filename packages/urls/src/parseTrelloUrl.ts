import { getShortLinkFromTrelloUrl } from './getShortLinkFromTrelloUrl';
import { getTrelloUrlType } from './getTrelloUrlType';
import { isTrelloUrl } from './isTrelloUrl';
import { isUrl } from './isUrl';

export const parseTrelloUrl = function (url: string): {
  type: 'board' | 'card' | 'enterprise' | 'unknown';
  shortLink?: string;
} {
  if (!isUrl(url) || !isTrelloUrl(url)) {
    return { type: 'unknown' };
  }

  const type = getTrelloUrlType(url);
  const shortLink = getShortLinkFromTrelloUrl(url);

  return {
    type,
    shortLink,
  };
};
