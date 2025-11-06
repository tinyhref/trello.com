/**
 * Returns the correct baseUrl for making requests to the Atlassian API Gateway
 * (aka, Stargate). If a path param is provided the path will be appended to
 * the baseUrl. If a leading slash is not included, it will be added.
 *
 * Example: `getApiGatewayUrl('foo') -> /gateway/api/foo`
 *
 * @param path path to append to the baseUrl
 */
export const getApiGatewayUrl = (path: string = ''): string => {
  const maybeSlash = path && !path.startsWith('/') ? '/' : '';
  return `/gateway/api${maybeSlash}${path}`;
};
