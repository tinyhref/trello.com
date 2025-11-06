// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from 'underscore';

import { getCsrfRequestPayload } from '@trello/session-cookie/csrf';

// When you're uploading a file using ajax, you need to use FormData and tell
// jQuery not to try to do its own processing on the data
//
// It's meant to be used as follows:
//
// ajax(_.extend({
//   url: '...'
//   ...
// }, fileUploadOptions({
//   foo: 'bar'
//   file: [ fileObject, 'filename.jpg' ]
// })))
//
// You can also pass it's return value as the options parameter to a
// Backbone Collection::create
//
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fileUploadOptions = function (attributes: any) {
  const data = new FormData();

  const { dsc } = getCsrfRequestPayload();
  data.append('dsc', dsc);

  for (const key in attributes) {
    const value = attributes[key];
    if (_.isArray(value)) {
      // @ts-expect-error TS(2556): A spread argument must either have a tuple type or... Remove this comment to see the full error message
      data.append(key, ...Array.from(value));
    } else {
      data.append(key, value);
    }
  }

  return {
    data,
    contentType: false,
    processData: false,
    timeout: 6 * 60 * 60 * 1000, // 6 hours
  };
};
