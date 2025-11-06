export const makeTemplateUrlSlug = (
  category: string,
  name: string,
  shortLink: string,
) => {
  return `${category}/${(name || '')
    .replace(/\s+/g, '-')
    .toLowerCase()}-${shortLink}`;
};
