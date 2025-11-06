import { orderedRouteList, routeDefinitions } from '@trello/router/routes';

const applyMatchers = (url: string): string => {
  // let's remove the starting slash to allow our matchers to use ^ properly
  const partialUrl = url.substring(1, url.length);

  for (const { regExp, backbonePattern, pattern } of orderedRouteList) {
    if (partialUrl.match(regExp)) {
      return pattern ?? backbonePattern;
    }
  }

  return routeDefinitions.errorPage.backbonePattern;
};

/**
 * Replace actual url with route pattern to avoid sending PII / UGC in error logs
 */
export const scrubUrl = (url: string) => {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    try {
      // Relative paths will fail the initial parse, so let's add a fake host to simulate a full URL (and discard the host later)
      parsedUrl = new URL(`http://invalid${url}`);
    } catch {
      // If we can't parse it even with a fake host, return the catchall pattern
      return routeDefinitions.errorPage.backbonePattern;
    }
  }

  const searchParams = parsedUrl.searchParams.toString();
  const partialUrl = `${parsedUrl.pathname}${searchParams ? `?${searchParams}` : ''}`;
  const result = applyMatchers(partialUrl);

  return parsedUrl.host !== 'invalid'
    ? `${parsedUrl.protocol}//${parsedUrl.host}/${result}`
    : `/${result}`;
};
