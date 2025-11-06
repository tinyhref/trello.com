const FILTER_QUERY_PARAMS = new Set([
  // SBV
  'filter',
  // WSV
  'due',
  'idBoards',
  'idLists',
  'idMembers',
  'labels',
  'mode',
  'sort',
  'title',
  'dateLastActivity',
]);

/**
 * Hack: The URL api auto-encodes commas and colons, but we want to use
 * "invalid" urls with `,` and `:` characters in the filter param.
 * To be fixed: https://trello.atlassian.net/browse/PANO-2013
 */
export const toQueryStringWithDecodedFilterParams = (
  params: URLSearchParams,
): string =>
  params
    .toString()
    .split('&')
    .map((param) => {
      const [key] = param.split('=');
      if (FILTER_QUERY_PARAMS.has(key)) {
        return param.replace(/%2C/g, ',').replace(/%3A/g, ':');
      }
      return param;
    })
    .join('&');
