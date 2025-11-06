/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from 'underscore';

import { isPlainObject } from '@trello/objects';

export const deepReplace = function (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  predicate: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform?: any,
) {
  if (transform == null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transform = (value: any, key: any, predicateResult: any) => predicateResult;
  }

  // @ts-expect-error TS(7023): 'process' implicitly has return type 'any' because... Remove this comment to see the full error message
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const process = function (value: any, key: any) {
    let predicateResult;
    if ((predicateResult = predicate(value, key))) {
      return transform(value, key, predicateResult);
    } else if (_.isArray(value)) {
      return value.map(process);
    } else if (isPlainObject(value)) {
      return _.mapObject(value, process);
    } else {
      return value;
    }
  };

  // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
  return process(obj);
};
