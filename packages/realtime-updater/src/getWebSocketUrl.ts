export const getWebSocketUrl = () => {
  const protocol = document.location.protocol === 'http:' ? 'ws:' : 'wss:';
  return `${protocol}//${document.location.host}/1/Session/socket`;
};
