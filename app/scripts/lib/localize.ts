// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { assert } from '@trello/error-handling';

import { tryBabble } from './try-babble';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const l = function (keyPath: any, formatArgs?: any, options?: any) {
  const result = tryBabble(keyPath, formatArgs, options);
  assert(typeof result === 'string', `babble: key ${keyPath} not found`);
  return result;
};
