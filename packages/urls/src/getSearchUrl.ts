export const getSearchUrl = (query?: string) => {
  return query ? `/search?q=${encodeURIComponent(query)}` : '/search';
};
