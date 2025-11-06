import type { ApolloError } from '@apollo/client';
import { isApolloError } from '@apollo/client';

import { NetworkError } from './network-error';

interface ApolloGraphQLNetworkError extends ApolloError {
  networkError: NetworkError;
}

const isApolloGraphQLNetworkError = (
  error: ApolloError | Error | unknown,
): error is ApolloGraphQLNetworkError => {
  if (error instanceof Error && isApolloError(error)) {
    const networkError = error?.networkError as NetworkError;
    return (
      networkError?.code !== undefined &&
      networkError?.message !== undefined &&
      networkError?.status !== undefined
    );
  }
  return false;
};

export const getNetworkError = (
  error: ApolloError | Error | unknown,
): NetworkError | null => {
  if (isApolloGraphQLNetworkError(error)) {
    const { code, message, status, ...meta } = error.networkError;
    return new NetworkError(message || code, { code, status, ...meta });
  }
  return null;
};
