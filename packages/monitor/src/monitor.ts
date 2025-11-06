import { TrelloStorage } from '@trello/storage';

import { monitorEvents } from './monitorEvents';
import type { MonitorStatus } from './monitorStatus';
import { monitorStatus } from './monitorStatus';

interface DocumentHidden extends Document {
  mozHidden?: string;
  msHidden?: string;
  webkitHidden?: string;
}
type HiddenPropertyOptions = keyof typeof documentHidden;
let hiddenProperty: HiddenPropertyOptions;
let visibilityChange: string | null = null;

const documentHidden: DocumentHidden = document;

// From https://developer.mozilla.org/en-US/docs/Web/Guide/User_experience/Using_the_Page_Visibility_API
if (typeof documentHidden.hidden !== 'undefined') {
  // Opera 12.10 and Firefox 18 and later support
  hiddenProperty = 'hidden';
  visibilityChange = 'visibilitychange';
} else if (typeof documentHidden.mozHidden !== 'undefined') {
  hiddenProperty = 'mozHidden';
  visibilityChange = 'mozvisibilitychange';
} else if (typeof documentHidden.msHidden !== 'undefined') {
  hiddenProperty = 'msHidden';
  visibilityChange = 'msvisibilitychange';
} else if (typeof documentHidden.webkitHidden !== 'undefined') {
  hiddenProperty = 'webkitHidden';
  visibilityChange = 'webkitvisibilitychange';
}

let lastActivity = 0;
let checkIntervalId: number;

export const monitor = {
  init(
    /**
     * @deprecated Only exposed for testing. Do not use.
     */
    enablePolling = true,
  ) {
    if (enablePolling) {
      checkIntervalId = window.setInterval(monitor.check, 10 * 1000);
    }

    // Mark the user active if the window gets the focus, or they click or type
    // Note: since we can also detect when the window
    // loses the focus, we can make it so a window that
    // has no interaction but has the focus stays active
    // e.g. if someone is just staring at the board, but not
    // doing anything
    window.addEventListener('focus', monitor.addActivity);
    window.addEventListener('keydown', monitor.addActivity);
    window.addEventListener('mousedown', monitor.addActivity);

    if (visibilityChange !== null) {
      document.addEventListener(visibilityChange, () => {
        if (!monitor.getHidden()) {
          monitor.addActivity();
        }
        monitorEvents.trigger('visibilitychange');
      });
    }
  },

  /***
   * @deprecated Only exposed for testing. Do not use.
   */
  destroy() {
    window.clearInterval(checkIntervalId);
    TrelloStorage.unset('lastActivity');
  },

  getHidden() {
    if (hiddenProperty) {
      return documentHidden[hiddenProperty];
    }
    return false;
  },

  addActivity() {
    lastActivity = Date.now();

    TrelloStorage.set('lastActivity', lastActivity);

    monitor.setStatus('active');
  },

  check() {
    const delta =
      Date.now() -
      Math.max(
        lastActivity,
        TrelloStorage.isEnabled()
          ? parseInt(TrelloStorage.get('lastActivity'), 10)
          : 0,
      );

    if (delta > 5 * 60 * 1000) {
      monitor.setStatus('idle');
    } // 5 minutes

    if (delta > 30 * 60 * 1000) {
      monitorEvents.trigger('setStale');
    } // 30 minutes, for userSession tracking
  },

  setStatus(newStatus: MonitorStatus) {
    if (newStatus !== monitorStatus.value) {
      monitorEvents.trigger('setStatus', newStatus);
      monitorStatus.setValue(newStatus);
    }
  },

  getStatus() {
    return monitorStatus.value;
  },

  getLastActivity() {
    return lastActivity;
  },
};
