// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// eslint-disable-next-line no-restricted-imports
import $ from '@trello/jquery';

import { WindowSize } from 'app/scripts/lib/window-size';

$(function () {
  WindowSize.calc();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let resize: any = null;
  return $(window).on('resize', function () {
    clearTimeout(resize);
    resize = setTimeout(() => WindowSize.calc(), 200);
  });
});
