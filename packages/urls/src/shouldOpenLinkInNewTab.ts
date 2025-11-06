import { isTrelloUrl } from './isTrelloUrl';

export const shouldOpenLinkInNewTab = (url: string) => {
  return !isTrelloUrl(url);
};
