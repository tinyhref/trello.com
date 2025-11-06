import { getApiGatewayUrl } from '@trello/api-gateway';
import { clientVersion } from '@trello/config';
import { getErrorTextFromFetchResponse } from '@trello/error-handling';
import { sendErrorEvent } from '@trello/error-reporting';
import { fetch } from '@trello/fetch';

export interface IdInvitationsServiceApiRequestInit {
  method: 'DELETE' | 'GET' | 'POST' | 'PUT';
  body?: string;
}

export interface IdInvitationsServiceResult<TResult> {
  result: TResult;
  error?: never;
}

export interface IdInvitationsServiceError<TError> {
  error: TError;
  result?: never;
}

export interface IdInvitationsServiceResponse {
  result: object;
}

/**
 * Generic method for making a request to IdInvitationsService.  In theory this could be * * worked into a
 * utility method for fetch/HTTP requests to any stargate service.
 *
 * @param path extension to be given over to getApiGatewayUrl to create stargate url
 * @param requestInit request HTTP verb/body
 * @param successTransformer a function to handle the translation of json response bodies in success cases
 * @param errorHandler a function to handle error cases, defaultErrorHandler can be used to handle errors generically
 * @returns
 */
export const idInvitationsService = async <TResult, TError>(
  path: string,
  requestInit: IdInvitationsServiceApiRequestInit,
  successTransformer: (json: object) => TResult,
  errorTransformer: (response: Response) => Promise<TError>,
): Promise<
  IdInvitationsServiceError<TError> | IdInvitationsServiceResult<TResult>
> => {
  const url = getApiGatewayUrl(path);

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': clientVersion,
    },
    ...requestInit,
  });

  if (response.ok) {
    return { result: successTransformer(await response.json()) };
  }
  return { error: await errorTransformer(response) };
};

/**
 * Default error handler.  Reports error event and extracts error message and returns as string
 * @param sentryComponent compnent for reporting
 *
 * @param response to be interrogated
 * @returns error string from fetch response
 */
export const reportingErrorHandler = (sentryComponent: string) => {
  return async (response: Response): Promise<string> => {
    sendErrorEvent(new Error('Error response from id-invitations-service'), {
      tags: {
        feature: 'JWM Workspace Linking',
        ownershipArea: 'trello-ghost',
      },
      extraData: {
        statusCode: String(response.status),
        statusText: response.statusText,
        component: sentryComponent,
      },
    });
    return getErrorTextFromFetchResponse(response);
  };
};
