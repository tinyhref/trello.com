import { makeErrorEnum } from './makeErrorEnum';

export const ApiError = makeErrorEnum('API', [
  'Unauthorized',
  'Unauthenticated',
  'Unconfirmed',
  'Timeout',
  'NoResponse',
  'NotFound',
  'PreconditionFailed',
  'Server',
  'RequestBlocked',
  'BadRequest',
  'Conflict',
  'TooManyRequests',
  'Other',
]);
