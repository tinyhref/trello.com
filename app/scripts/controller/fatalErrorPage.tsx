import { ComponentWrapper, renderReactRoot } from '@trello/component-wrapper';
import { sendCrashEvent, sendErrorEvent } from '@trello/error-reporting';

import { LazyError } from 'app/src/components/Error/LazyError';
import { controllerEvents } from './controllerEvents';

export function fatalErrorPage({
  errorType,
  error,
}: {
  errorType: 'serverError';
  error: Error;
}) {
  try {
    controllerEvents.trigger('clearPreviousView', {
      isNextViewReact: true,
    });
    sendErrorEvent(error, {
      tags: {
        ownershipArea: 'trello-platform',
        feature: 'Error Page',
      },
    });
    renderReactRoot(
      <ComponentWrapper>
        <LazyError errorType={errorType} />
      </ComponentWrapper>,
      document.getElementById('content'),
      false,
      'fatal-error-page',
    );
  } catch (e) {
    sendCrashEvent(error);
  }
}
