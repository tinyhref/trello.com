/**
 * Returns the URL query param value for the name provided. Checks the URL
 * hash if no query param value found.
 *
 * TODO: This is a good candidate for @trello/url
 *
 * @param name
 * @returns query param value, hash value, or null
 */
export const getQueryParamOrHash = (name: string): string | null => {
  const search = new URLSearchParams(location.search);
  if (search.has(name)) {
    return search.get(name);
  }

  if (location.hash.length) {
    const hash = new URLSearchParams(location.hash.substr(1));
    if (hash.has(name)) {
      return hash.get(name);
    }
  }

  return null;
};
