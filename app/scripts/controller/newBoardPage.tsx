import { renderReactRoot } from '@trello/component-wrapper';
import { ErrorBoundary } from '@trello/error-boundaries';
import { ApolloProvider } from '@trello/graphql';
import { TrelloIntlProvider } from '@trello/i18n';

import { PopOver } from 'app/scripts/views/lib/PopOver';
import { isBoardRenderedSharedState } from 'app/src/components/Board/isBoardRenderedSharedState';
import { RuntimeError } from 'app/src/components/Error/RuntimeError';
import { LazyShortcutsOverlayDialog } from 'app/src/components/LazyShortcutsOverlayDialog';
import { SplitScreenManager } from 'app/src/components/SplitScreenManager';
import { controllerEvents } from './controllerEvents';
import type { Controller } from '.';

export function newBoardPage(this: typeof Controller) {
  // Making sure this component will not re-render
  if (isBoardRenderedSharedState.value) {
    // transitions to a new board/card pass through here, and since we don't
    // call clearPreviousView as below, we need to manually hide the popover
    if (PopOver.isVisible) {
      PopOver.hide();
    }
    return;
  }

  controllerEvents.trigger('clearPreviousView', { isNextViewReact: true });
  this.unmountReactRoot = renderReactRoot(
    <ErrorBoundary
      errorHandlerComponent={RuntimeError}
      tags={{
        ownershipArea: 'trello-web-eng',
        feature: 'Board Page',
      }}
    >
      <ApolloProvider>
        <TrelloIntlProvider>
          <SplitScreenManager />
          {/* This should eventually move up to be a sibling of a header */}
          <LazyShortcutsOverlayDialog />
        </TrelloIntlProvider>
      </ApolloProvider>
    </ErrorBoundary>,
    document.getElementById('content'),
    false,
    'new-board-page',
  ).unmount;
}
