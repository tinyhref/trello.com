/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from 'underscore';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const actionFilterFromString = function (str: any) {
  const map = _.reduce(
    str.split(','),
    // eslint-disable-next-line @typescript-eslint/no-shadow
    function (map, actionEntry) {
      const [actionType, attr] = Array.from(actionEntry.split(':'));

      if (attr != null) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        if (map[actionType] == null) {
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          map[actionType] = [];
        }
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        map[actionType].push(attr);
      } else {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        map[actionType] = true;
      }

      return map;
    },

    {},
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (action: any) {
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const entry = map[action.get('type')];
    if (entry == null) {
      return false;
    } else if (entry === true) {
      return true;
    } else {
      // For actionTypes like updateCard:idList
      const { old } = action.get('data');
      return (
        old != null &&
        _.any(entry, (attr) => Object.prototype.hasOwnProperty.call(old, attr))
      );
    }
  };
};
