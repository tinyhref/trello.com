// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { fromNode } from '@trello/promise-helpers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ninvoke = (obj: any, methodName: any, ...args: any[]) =>
  fromNode((next) => obj[methodName](...Array.from(args), next));
