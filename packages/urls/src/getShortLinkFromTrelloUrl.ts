import { getTrelloUrlType } from './getTrelloUrlType';
import { isUrl } from './isUrl';

export const getShortLinkFromTrelloUrl = function (url: string) {
  if (!isUrl(url)) {
    return;
  }

  const type = getTrelloUrlType(url);

  const parsed = new URL(url);
  const [, shortLink] = parsed.pathname.split('/').slice(1);

  return ['card', 'board'].includes(type) ? shortLink : undefined;
};
