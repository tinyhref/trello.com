import { Analytics } from '@trello/atlassian-analytics';
import { browserStr, osStr } from '@trello/browser';
import { internetConnectionState } from '@trello/internet-connection-state';
import { monitorStatus } from '@trello/monitor';
import { logConnectionInformation } from '@trello/web-sockets';

const INITIAL_STATE: {
  startedAt: number;
  userIdleDuringReconnection: boolean;
  browserHiddenDuringConnection: boolean;
  internetUnhealthyDurationDuringConnection: number;
  internetUnhealthyTimestamp: number;
} = {
  startedAt: -1,
  userIdleDuringReconnection: false,
  browserHiddenDuringConnection: false,
  internetUnhealthyDurationDuringConnection: 0,
  internetUnhealthyTimestamp: -1,
};

let unsubscribeFromInternetConnectionState: ReturnType<
  typeof internetConnectionState.subscribe
>;

let unsubscribeFromMonitorStatus: ReturnType<typeof monitorStatus.subscribe>;

let state = {
  ...INITIAL_STATE,
};

function markInternetUnhealthy() {
  state.internetUnhealthyTimestamp = Date.now();
}

function markInternetHealthy() {
  state.internetUnhealthyDurationDuringConnection +=
    state.internetUnhealthyTimestamp !== -1
      ? Date.now() - state.internetUnhealthyTimestamp
      : 0;
}

function markInternetConnectionChange(
  currentInternetConnectionState: typeof internetConnectionState.value,
) {
  if (currentInternetConnectionState === 'healthy') {
    markInternetHealthy();
  } else {
    markInternetUnhealthy();
  }
}

function updateBrowserState() {
  if (!state.browserHiddenDuringConnection) {
    state.browserHiddenDuringConnection = document.visibilityState === 'hidden';
  }
}

function updateMonitorStatus(monitorState: typeof monitorStatus.value) {
  if (!state.userIdleDuringReconnection) {
    state.userIdleDuringReconnection = monitorState === 'idle';
  }
}

export function resetSocketConnectionTransaction() {
  if (unsubscribeFromInternetConnectionState) {
    unsubscribeFromInternetConnectionState();
  }
  if (unsubscribeFromMonitorStatus) {
    unsubscribeFromMonitorStatus();
  }
  document.removeEventListener('visibilitychange', updateBrowserState);
  state = { ...INITIAL_STATE };
}

export function startSocketConnectionTransaction({
  isFirstConnection,
}: {
  isFirstConnection: boolean;
}) {
  resetSocketConnectionTransaction();
  markInternetConnectionChange(internetConnectionState.value);
  unsubscribeFromInternetConnectionState = internetConnectionState.subscribe(
    markInternetConnectionChange,
    {
      onlyUpdateIfChanged: true,
    },
  );

  updateMonitorStatus(monitorStatus.value);
  unsubscribeFromMonitorStatus = monitorStatus.subscribe(updateMonitorStatus);

  updateBrowserState();
  document.addEventListener('visibilitychange', updateBrowserState);

  state.startedAt = Date.now();

  if (isFirstConnection) {
    return Analytics.startTask({
      taskName: 'create-session/socket',
      source: 'network:socket',
    });
  } else {
    /**
     * For reconnections, just send a trace id so that server can still trace the request,
     * but we want to avoid using a capability here because of the massive volume of events.
     */
    return Analytics.get128BitTraceId();
  }
}

export function connectionFailed({
  error,
  traceId,
}: {
  error: Error;
  traceId: string;
}) {
  Analytics.taskFailed({
    taskName: 'create-session/socket',
    source: 'network:socket',
    traceId,
    error,
  });
  resetSocketConnectionTransaction();
}

export function connectionSucceeded({
  isFirstConnection,
  traceId,
  analyticsAttributes,
}: {
  isFirstConnection: boolean;
  traceId: string;
  analyticsAttributes: object;
}) {
  if (isFirstConnection) {
    Analytics.taskSucceeded({
      taskName: 'create-session/socket',
      source: 'network:socket',
      traceId,
    });
  }

  const eventAttributes = {
    duration: Math.max(
      Date.now() -
        state.startedAt -
        state.internetUnhealthyDurationDuringConnection,
      0,
    ),
    wasUserIdle: state.userIdleDuringReconnection,
    wasBrowserHidden: state.browserHiddenDuringConnection,
    wasInternetUnhealthy: state.internetUnhealthyDurationDuringConnection > 0,
    internetUnhealthyDuration: state.internetUnhealthyDurationDuringConnection,
    browser: browserStr,
    os: osStr,
    traceId,
    ...analyticsAttributes,
  };
  logConnectionInformation({
    source: 'socketConnection',
    eventName: isFirstConnection ? 'connected' : 'reconnected',
    payload: eventAttributes,
  });
  Analytics.sendOperationalEvent({
    action: isFirstConnection ? 'connected' : 'reconnected',
    actionSubject: 'socketConnection',
    source: 'network:socket',
    attributes: eventAttributes,
  });
  resetSocketConnectionTransaction();
}
