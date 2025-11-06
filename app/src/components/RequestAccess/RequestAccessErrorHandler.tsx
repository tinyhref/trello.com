import type { FunctionComponent } from 'react';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import type { ErrorHandlerProps } from '@trello/error-boundaries';
import {
  useBoardShortLink,
  useCardShortLink,
  useRouteId,
} from '@trello/router';

import { RequestAccessPageSkeleton } from './RequestAccessPageSkeleton';

import * as styles from './RequestAccessErrorHandler.module.less';

export const RequestAccessErrorHandler: FunctionComponent<
  ErrorHandlerProps
> = ({ caughtError }) => {
  const { error, info } = caughtError;
  const boardShortLink = useBoardShortLink();
  const cardShortLink = useCardShortLink();
  const routeId = useRouteId();

  useEffect(() => {
    Analytics.sendOperationalEvent({
      action: 'errored',
      actionSubject: 'requestAccess',
      actionSubjectId: 'requestAccessError',
      source: 'requestAccessScreen',
      attributes: {
        error,
        info,
        flow: routeId,
        shortLink: boardShortLink || cardShortLink,
      },
    });
  }, [boardShortLink, cardShortLink, routeId, error, info]);

  return (
    <RequestAccessPageSkeleton>
      <h1 className={styles.textCenter}>
        <FormattedMessage
          id="templates.request_access.request-access-page-error-title"
          defaultMessage="Something went wrong"
          description="Generic error title"
        />
      </h1>
      <p className={styles.textCenter}>
        <FormattedMessage
          id="templates.request_access.request-access-page-error-description"
          defaultMessage="We’re having trouble sending your access request. Please refresh the page and try again."
          description="Generic error description"
        />
      </p>
    </RequestAccessPageSkeleton>
  );
};
