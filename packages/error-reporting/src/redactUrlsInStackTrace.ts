// We use a colon to indicate the end of the url, since in stack traces
// URLs are formatted as `${url}:lineNumber:charNumber`.
const trelloUrlRegex = new RegExp(/(https\/?:\/\/trello.com\/)[^)\s:]*/, 'g');

export function redactUrlsInStackTrace(stackTrace: string) {
  return stackTrace.replaceAll(trelloUrlRegex, '$1<redacted>');
}
