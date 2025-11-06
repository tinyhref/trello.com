import { token as getAtlaskitToken } from '@atlaskit/tokens';
import type { CSSTokenMap as AtlaskitCSSTokenMap } from '@atlaskit/tokens/token-names';

import type { TrelloCSSTokenMap } from '../tokens';
import { trelloTokens } from '../tokens';

type CSSTokenMap = AtlaskitCSSTokenMap & TrelloCSSTokenMap;

type AtlaskitToken = Parameters<typeof getAtlaskitToken>[0];
type TrelloToken = keyof typeof trelloTokens;
type Token = AtlaskitToken | TrelloToken;

const isTrelloToken = (path: Token): path is TrelloToken =>
  Object.prototype.hasOwnProperty.call(trelloTokens, path);

/**
 * Given a token name, returns its resolved CSS variable.
 * See `tokens.ts` for a reference of all custom Trello tokens.
 */
export function token<T extends Token>(
  path: T,
  fallback?: string,
): CSSTokenMap[T] {
  if (isTrelloToken(path)) {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const token = trelloTokens[path];
    const tokenCall = fallback ? `var(${token}, ${fallback})` : `var(${token})`;
    return tokenCall as CSSTokenMap[T];
  }
  return getAtlaskitToken(path, fallback) as CSSTokenMap[T];
}

export type CSSToken = ReturnType<typeof token>;
