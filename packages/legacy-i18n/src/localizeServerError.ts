import { forNamespace } from './forNamespace';

const formatServerError = forNamespace('server error');

const tryParseJsonMessage = (str: string) => {
  try {
    return JSON.parse(str).message;
  } catch (e) {
    return null;
  }
};

export const localizeServerError = (
  resOrString: Error | XMLHttpRequest | string,
) => {
  let message = '';

  if (typeof resOrString === 'string') {
    message = tryParseJsonMessage(resOrString) || resOrString;
    // NOTE: JQuery.jqXHR is returned from ApiAjax, which is deprecated.
    // Once the types of all consumers of this method are strictly typed,
    // we should aim to deprecate this branch.
  } else if (
    Object.prototype.hasOwnProperty.call(resOrString, 'responseJSON')
  ) {
    const jqxhr = resOrString as { responseJSON?: { message?: string } };
    message = jqxhr.responseJSON?.message ?? '';
  } else if (resOrString instanceof XMLHttpRequest) {
    message = resOrString.responseText;
  } else {
    // Error message was passed in
    const error = resOrString as Error;
    message = tryParseJsonMessage(error?.message ?? '') || error.message;
  }

  const localizedError = formatServerError(message);

  if (Array.isArray(localizedError)) {
    // Could not find the key
    return localizedError.join('').replace(/^server error\./, '');
  } else if (!localizedError) {
    return message;
  } else {
    return localizedError;
  }
};
