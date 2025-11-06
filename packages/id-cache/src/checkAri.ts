const ariRegex = new RegExp(`ari:cloud:trello::[^/]+/(.+/)?[a-z0-9]{24}$`);

export function checkAri(value: string) {
  return ariRegex.test(value);
}
