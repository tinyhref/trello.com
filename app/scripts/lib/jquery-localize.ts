// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// eslint-disable-next-line no-restricted-imports
import $ from '@trello/jquery';

import { l } from 'app/scripts/lib/localize';

// @ts-expect-error TS(2339): Property 'format' does not exist on type 'JQuery<H... Remove this comment to see the full error message
// eslint-disable-next-line @typescript-eslint/no-explicit-any
$.fn.format = function (key: any, data: any) {
  this.text(l(key, data, { raw: true }));
  return this;
};

// @ts-expect-error TS(2339): Property 'formatHtml' does not exist on type 'JQue... Remove this comment to see the full error message
// eslint-disable-next-line @typescript-eslint/no-explicit-any
$.fn.formatHtml = function (key: any, data: any) {
  this.html(l(key, data));
  return this;
};
