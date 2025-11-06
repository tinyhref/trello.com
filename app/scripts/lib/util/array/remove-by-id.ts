// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from 'underscore';

// Returns a copy of the collection without the element which has an id
// that matches toRemove
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const removeById = (collection: any, toRemove: any) =>
  _.reject(collection, (item) => item.id === toRemove.id);
