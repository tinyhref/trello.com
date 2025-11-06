export const isTrelloUrl = (
  url: string,
  overrideTrelloHost: string = location.host,
): boolean => {
  try {
    const { host } = new URL(url);
    return host === overrideTrelloHost;
  } catch (e) {
    return false;
  }
};
