import type { MonitorStatus } from '@trello/monitor';
import { monitor, monitorEvents } from '@trello/monitor';

let sessionStartTime = 0;

export const userSession = {
  init() {
    userSession.onActive();
    monitorEvents.on('setStatus', userSession.onStatusChange);
    monitorEvents.on('setStale', userSession.onStale);
    monitorEvents.on('visibilitychange', userSession.onVisibilityChange);
  },

  onStatusChange(newStatus: MonitorStatus) {
    if (newStatus === 'active') {
      userSession.onActive();
    }
  },

  onActive() {
    if (!sessionStartTime) {
      sessionStartTime = Date.now();
    }
  },

  onStale() {
    if (sessionStartTime) {
      sessionStartTime = 0;
    }
  },

  onVisibilityChange() {
    const isHidden = monitor.getHidden();
    // if we are in an active session and the page is hidden then
    // treat it as if we got a stale event
    if (sessionStartTime && isHidden) {
      sessionStartTime = 0;
    }
    // if we are not in an active session and the page is visible
    // then treat it as it got an active event
    else if (!sessionStartTime && !isHidden) {
      userSession.onActive();
    }
  },

  getSessionStartTime() {
    return sessionStartTime;
  },

  /***
   * @deprecated Only exposed for testing. Do not use.
   */
  destroy() {
    monitorEvents.off('setStatus', userSession.onStatusChange);
    monitorEvents.off('setStale', userSession.onStale);
    monitorEvents.off('visibilitychange', userSession.onVisibilityChange);
    sessionStartTime = 0;
  },
};
