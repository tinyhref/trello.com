import { sendErrorEvent } from '@trello/error-reporting';

import { ApiError } from './ApiError';
import { messageFromJSON } from './messageFromJSON';

function textFromHtml(html: string) {
  return html
    .replace(/<(style|script)[^>]*>[\s\S]*?<\/\1>|<[^>]+>/gi, ' ')
    .replace(/ *\n\s*/g, '\n')
    .replace(/ {2,}/g, ' ')
    .trim()
    .substr(0, 256);
}

export function getApiError(
  statusCode: number,
  originalText: string,
): typeof ApiError {
  if (originalText?.startsWith('{')) {
    // Often we've used parseErrorMessage before this is called, but
    // not always

    try {
      const parsed = JSON.parse(originalText);

      if (statusCode === 449) {
        // Handle the Subrequest Failed response, which wraps errors
        const { originalStatus, originalMessage } = parsed;
        return getApiError(originalStatus, originalMessage);
      } else {
        const message = messageFromJSON(parsed);
        if (message) {
          return getApiError(statusCode, message);
        }
      }
    } catch (err) {
      sendErrorEvent(err as Error, {
        tags: {
          ownershipArea: 'trello-platform',
        },
        extraData: {
          component: 'getApiError',
        },
      });
    }
  }

  if (originalText?.startsWith('<')) {
    // We've gotten an HTML error page, probably a Sleepy Taco or the Atlassian
    // "moving mountains" error, or a third party proxy blocking the request
    if (
      originalText.includes('http://www.trellostatus.com/') ||
      originalText.includes('https://trello.status.atlassian.com/')
    ) {
      return ApiError.Server('Trello Unavailable');
    }

    if (originalText.includes('https://status.atlassian.com/')) {
      return ApiError.Server('Atlassian Unavailable');
    }

    if (
      originalText.includes(
        'The Amazon CloudFront distribution is configured to block access from your country',
      )
    ) {
      return ApiError.RequestBlocked();
    }

    return ApiError.Server(
      `Unrecognized HTML error page: ${textFromHtml(originalText)}`,
    );
  }

  let text;
  if (originalText) {
    text = originalText.toLowerCase().trim();
  }

  switch (statusCode) {
    case 0:
      return ApiError.NoResponse();
    case 400:
      switch (text) {
        case 'invalid token': // [INVALID TOKEN]
        case 'auth_session_invalid_token':
          return ApiError.Unauthenticated();
        default:
          return ApiError.BadRequest(originalText);
      }
    case 401:
      switch (text) {
        case 'invalid token':
        case 'invalid cookie token':
        case 'auth_session_invalid_token':
          return ApiError.Unauthenticated();
        case 'confirm to view':
          return ApiError.Unconfirmed();
        default:
          return ApiError.Unauthorized(originalText);
      }
    case 403:
      switch (text) {
        case 'user not logged in or invalid token.': // [WTF]
          return ApiError.Unauthenticated();
        default:
          return ApiError.Unauthorized(originalText);
      }
    case 404:
      return ApiError.NotFound(originalText);
    case 408:
      return ApiError.Timeout(originalText);
    case 409:
      return ApiError.Conflict(originalText);
    case 412:
      return ApiError.PreconditionFailed(originalText);
    case 429:
      return ApiError.TooManyRequests(originalText);
    default:
      if (500 <= statusCode && statusCode < 600) {
        return ApiError.Server(originalText);
      } else {
        return ApiError.Other(`${statusCode}: ${originalText}`);
      }
  }
}
