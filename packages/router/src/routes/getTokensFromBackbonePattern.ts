/**
 * Used to get the list of tokens present in a backbone / legacy route pattern.
 * WARNING: Don't use this with react-router patterns.  Use `matchPath` from `react-router` instead.
 * https://reactrouter.com/api/utils/matchPath
 */
export const getTokensFromBackbonePattern = (pattern: string) => {
  const tokenArray = pattern.match(/[:*]([a-zA-Z]+)/g);
  return tokenArray ? tokenArray.map((token) => token.replace(/[:*]/, '')) : [];
};
