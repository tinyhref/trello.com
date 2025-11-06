import { renderReactRoot } from '@trello/component-wrapper';
import { sendChunkLoadErrorEvent } from '@trello/error-reporting';
import { TrelloIntlProvider } from '@trello/i18n';

import { appRenderState } from 'app/src/appRenderState';
import { PageError } from 'app/src/components/PageError';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const renderPage = (promise: Promise<any>) => {
  return promise
    .catch((error: Error) => {
      if (error.name === 'ChunkLoadError') {
        sendChunkLoadErrorEvent(error);
        const contentElement = document.getElementById('content');
        if (contentElement) {
          renderReactRoot(
            <TrelloIntlProvider>
              <PageError />
            </TrelloIntlProvider>,
            contentElement,
            false,
            'page-error',
          );
        }
      } else {
        throw error;
      }
    })
    .finally(() => appRenderState.setValue('afterPaint'));
};
