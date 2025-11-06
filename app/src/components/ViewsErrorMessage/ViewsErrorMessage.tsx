import type { FunctionComponent } from 'react';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import type { SourceType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';

import * as styles from './ViewsErrorMessage.module.less';

interface ViewsErrorMessageProps {
  headerMessage?: string;
  secondaryMessage?: string;
  screenEventName: SourceType;
  analyticsContainers?: Parameters<
    typeof Analytics.sendScreenEvent
  >[0]['containers'];
  analyticsAttributes?: Parameters<
    typeof Analytics.sendScreenEvent
  >[0]['attributes'];
}

const emptyObj = {};

export const ViewsErrorMessage: FunctionComponent<ViewsErrorMessageProps> = ({
  headerMessage,
  secondaryMessage,
  screenEventName,
  analyticsContainers = emptyObj,
  analyticsAttributes = emptyObj,
}: ViewsErrorMessageProps) => {
  useEffect(() => {
    Analytics.sendScreenEvent({
      name: screenEventName,
      containers: analyticsContainers,
      attributes: analyticsAttributes,
    });
  }, [screenEventName, analyticsContainers, analyticsAttributes]);

  return (
    <>
      <h1 className={styles.headerMessage}>
        {headerMessage ? (
          headerMessage
        ) : (
          <FormattedMessage
            id="templates.error.we-couldnt-load-this-view"
            defaultMessage="We couldn't load this view."
            description="An error message indicating that the view was not loaded"
          />
        )}
      </h1>
      <p className={styles.secondaryMessage} data-testid="secondaryMessage">
        {secondaryMessage ? (
          secondaryMessage
        ) : (
          <FormattedMessage
            id="templates.error.try-refreshing-the-page"
            defaultMessage="Try refreshing the page."
            description="Subtext indicating the user should try refreshing the page"
          />
        )}
      </p>
    </>
  );
};
