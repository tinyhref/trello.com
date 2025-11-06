export const RequestAccessExtensions = {
  REQUEST_NOT_FOUND: 'REQUEST_NOT_FOUND',
} as const;
type RequestAccessExtensionsType =
  (typeof RequestAccessExtensions)[keyof typeof RequestAccessExtensions];

export const RequestAccessErrors: Record<string, RequestAccessExtensionsType> =
  {
    'Access Request Not found': RequestAccessExtensions.REQUEST_NOT_FOUND,
  };
