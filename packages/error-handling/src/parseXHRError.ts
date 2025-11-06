import { messageFromJSON } from './messageFromJSON';

export function parseXHRError(
  xhrResponse: Partial<
    Pick<JQuery.jqXHR, 'responseJSON' | 'responseText' | 'statusText'>
  >,
) {
  const { responseJSON, responseText, statusText } = xhrResponse;
  // Server is inconsistent w.r.t. error message formatting. It may send a JSON
  // response with the error nested in responseJSON. It may also send a string
  // in responseText.
  //
  // This establishes a hierarchy for parsing the multiple options. It
  // first looks for the JSON nested fields, then responseText. It falls
  // back to statusText as a last resort.
  return messageFromJSON(responseJSON) || responseText || statusText;
}
