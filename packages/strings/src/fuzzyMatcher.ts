import type { PIIString } from '@trello/privacy';
import { dangerouslyConvertPrivacyString } from '@trello/privacy';

import { escapeForRegex } from './escapeForRegex';

export type Matcher = (input: PIIString | string) => boolean;

export const buildFuzzyMatcher = (query: PIIString | string): Matcher => {
  const searchExpressions: RegExp[] = (
    typeof query === 'string' ? query : dangerouslyConvertPrivacyString(query)
  )
    .split(/\s+/)
    .map((word) => new RegExp(escapeForRegex(word), 'i'));

  return (input: PIIString | string) =>
    searchExpressions.every((searchExpression) =>
      searchExpression.test(
        typeof input === 'string'
          ? input
          : dangerouslyConvertPrivacyString(input),
      ),
    );
};
