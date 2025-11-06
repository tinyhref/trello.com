/**
 * IMPORTANT: Do not move the side-effectful imports from lower in the file to
 * the top section, as the execution order matters.  See more details in the comment below.
 * Import sort order plugin is disabled for this file.
 */
import type { TrelloWindow } from '@trello/window-types';

import './configure-promise-queue';
import './error-test';
import './globals';
import './live-updater';
import { subscriber } from './subscriber';
import type { Board as BoardModel } from 'app/scripts/models/Board';
import type { Card } from 'app/scripts/models/Card';
import type { Organization } from 'app/scripts/models/Organization';
import { currentModelManager } from 'app/scripts/controller/currentModelManager';
import type { Enterprise } from 'app/scripts/models/Enterprise';

declare const window: TrelloWindow;

// This code was previously running as a side effect of importing subscriber.ts. It has been moved here to avoid side
// effects on import, but placed inline to avoid changing execution order significantly. A more ideal place for this to
// live would probably be as a hook in TrelloOnline.
currentModelManager.currentModel?.subscribe?.(function (
  model: BoardModel | Card | Enterprise | Organization,
) {
  // eslint-disable-next-line eqeqeq
  if (model != null) {
    subscriber.addModel(model);
  } else {
    subscriber.ensureSubscriptions();
  }
});
import './session-watcher';
import './vendor-patches';
import './window-resize-watcher';
import { setWebSocketsActive } from '@trello/web-sockets';

window.activateWebSockets = () => setWebSocketsActive(true);
window.deactivateWebSockets = () => setWebSocketsActive(false);
