// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Naive check to see if it looks like the text contains a URL
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const containsUrl = (text: any) => new RegExp(`\\bhttps?://`).test(text);
