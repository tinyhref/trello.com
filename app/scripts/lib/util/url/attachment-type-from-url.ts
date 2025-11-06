// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { isTrelloUrl } from '@trello/urls';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const attachmentTypeFromUrl = function (url: any) {
  switch (false) {
    case !isTrelloUrl(url):
      return 'trello';
    case !new RegExp(`docs\\.google\\.com/`, 'i').test(url) &&
      !new RegExp(`drive\\.google\\.com/`, 'i').test(url):
      return 'google-drive';
    case !new RegExp(`dropbox\\.com/`, 'i').test(url):
      return 'dropbox';
    case !new RegExp(`onedrive\\.live\\.com/`, 'i').test(url) &&
      !new RegExp(`1drv\\.ms/`, 'i').test(url) &&
      !new RegExp(`sharepoint\\.com/`, 'i').test(url):
      return 'onedrive';
    case !new RegExp(`app\\.box\\.com/`, 'i').test(url):
      return 'box';
    default:
      return 'link';
  }
};
