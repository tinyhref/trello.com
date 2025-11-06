import { useEffect, useState } from 'react';

// eslint-disable-next-line no-restricted-imports
import type { RequestAccessModelType } from '@trello/graphql/generated';
import {
  useBoardShortLink,
  useCardShortLink,
  useRouteId,
} from '@trello/router';

export const useRequestAccessPage = ({
  isLoggedIn,
  errorType,
  reason,
}: {
  isLoggedIn: boolean;
  errorType: string;
  reason?: string;
}) => {
  const [adjustedErrorType, setAdjustedErrorType] = useState(errorType);
  const routeId = useRouteId();
  const boardShortLink = useBoardShortLink();
  const cardShortLink = useCardShortLink();
  const modelType = routeId as RequestAccessModelType;
  const modelId = boardShortLink || cardShortLink || '';

  useEffect(() => {
    if (
      isLoggedIn &&
      reason === 'Unauthorized' &&
      (errorType === 'boardNotFound' || errorType === 'cardNotFound')
    ) {
      setAdjustedErrorType('requestAccess');
    }
    if (
      !isLoggedIn &&
      (errorType === 'boardNotFound' || errorType === 'cardNotFound')
    ) {
      setAdjustedErrorType('requestAccessLoggedout');
    }
  }, [errorType, reason, isLoggedIn, modelType, modelId]);

  return { adjustedErrorType };
};
