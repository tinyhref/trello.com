import { isUrl } from './isUrl';

export const getTrelloUrlType = (url: string) => {
  if (!isUrl(url)) {
    return 'unknown';
  }

  const parsed = new URL(url);
  const [identifier] = parsed.pathname.split('/').slice(1);

  switch (identifier) {
    case 'b':
      return 'board';
    case 'c':
      return 'card';
    case 'e':
      return 'enterprise';
    default:
      return 'unknown';
  }
};
