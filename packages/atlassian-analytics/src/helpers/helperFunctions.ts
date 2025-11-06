import type {
  ActionSubjectIdType,
  ActionSubjectType,
  EventAttribute,
  EventAttributes,
  EventContainer,
  SourceType,
  Task,
} from '@trello/analytics-types';
import { scrubMessage } from '@trello/strings';

import type {
  OperationalEvent,
  TaskSessionManager,
  TrackEvent,
  UIEvent,
} from '../AnalyticsWebClient';

export interface SendClickedButtonEvent {
  buttonName: ActionSubjectIdType;
  source: SourceType;
  containers?: EventContainer;
  attributes?: EventAttributes;
  objectType?: string;
  objectId?: string;
}
export const sendClickedButtonEvent = (
  e: SendClickedButtonEvent,
  sendUIEvent: (e: UIEvent) => void,
): void => {
  sendUIEvent({
    action: 'clicked',
    actionSubject: 'button',
    actionSubjectId: e.buttonName,
    source: e.source,
    containers: e.containers,
    attributes: e.attributes,
    objectType: e.objectType,
    objectId: e.objectId,
  });
};

export interface SendClickedLinkEvent {
  linkName: ActionSubjectIdType;
  source: SourceType;
  containers?: EventContainer;
  attributes?: EventAttributes;
  objectType?: string;
  objectId?: string;
}
export const sendClickedLinkEvent = (
  e: SendClickedLinkEvent,
  sendUIEvent: (e: UIEvent) => void,
): void => {
  sendUIEvent({
    action: 'clicked',
    actionSubject: 'link',
    actionSubjectId: e.linkName,
    source: e.source,
    containers: e.containers,
    attributes: e.attributes,
    objectType: e.objectType,
    objectId: e.objectId,
  });
};

// For UI components that are closed with a companion call to the dismissal API
export interface SendDismissedComponentEvent {
  componentType: ActionSubjectType;
  componentName: ActionSubjectIdType;
  source: SourceType;
  containers?: EventContainer;
  attributes?: EventAttributes;
  objectType?: string;
  objectId?: string;
}
export const sendDismissedComponentEvent = (
  e: SendDismissedComponentEvent,
  sendUIEvent: (e: UIEvent) => void,
): void => {
  sendUIEvent({
    action: 'dismissed',
    actionSubject: e.componentType,
    actionSubjectId: e.componentName,
    source: e.source,
    containers: e.containers,
    attributes: e.attributes,
    objectType: e.objectType,
    objectId: e.objectId,
  });
};

// For closing UI components that aren't dismissed
export interface SendClosedComponentEvent {
  componentType: ActionSubjectType;
  componentName: ActionSubjectIdType;
  source: SourceType;
  containers?: EventContainer;
  attributes?: EventAttributes;
  objectType?: string;
  objectId?: string;
}
export const sendClosedComponentEvent = (
  e: SendClosedComponentEvent,
  sendUIEvent: (e: UIEvent) => void,
): void => {
  sendUIEvent({
    action: 'closed',
    actionSubject: e.componentType,
    actionSubjectId: e.componentName,
    source: e.source,
    containers: e.containers,
    attributes: e.attributes,
    objectType: e.objectType,
    objectId: e.objectId,
  });
};

// For keyboard shortcuts
export interface SendPressedShortcutEvent {
  shortcutName: ActionSubjectIdType;
  keyValue: string;
  source: SourceType;
  containers?: EventContainer;
  attributes?: EventAttributes;
  objectType?: string;
  objectId?: string;
}
export const sendPressedShortcutEvent = (
  e: SendPressedShortcutEvent,
  sendUIEvent: (e: UIEvent) => void,
): void => {
  sendUIEvent({
    action: 'pressed',
    actionSubject: 'shortcut',
    actionSubjectId: e.shortcutName,
    source: e.source,
    containers: e.containers,
    attributes: {
      keyValue: e.keyValue,
      ...e.attributes,
    },
    objectType: e.objectType,
    objectId: e.objectId,
  });
};

// This is the UI version of the operational "component rendered" event.
// Since operational events aren't sent to Amplitude, we should send a
// companion (or replacement) user-centric "component viewed" event.
// The event should be used to track views on any components that are not
// screens, modals, drawers, or inlineDialogs.
export interface SendViewedComponentEvent {
  componentType: ActionSubjectType;
  componentName: ActionSubjectIdType;
  source: SourceType;
  containers?: EventContainer;
  attributes?: EventAttributes;
  objectType?: string;
  objectId?: string;
}
export const sendViewedComponentEvent = (
  e: SendViewedComponentEvent,
  sendUIEvent: (e: UIEvent) => void,
): void => {
  sendUIEvent({
    action: 'viewed',
    actionSubject: e.componentType,
    actionSubjectId: e.componentName,
    source: e.source,
    containers: e.containers,
    attributes: e.attributes,
    objectType: e.objectType,
    objectId: e.objectId,
  });
};

export interface SendViewedBannerEvent {
  bannerName: ActionSubjectIdType;
  source: SourceType;
  containers?: EventContainer;
  attributes?: EventAttributes;
  objectType?: string;
  objectId?: string;
}
export const sendViewedBannerEvent = (
  e: SendViewedBannerEvent,
  sendUIEvent: (e: UIEvent) => void,
): void => {
  sendUIEvent({
    action: 'viewed',
    actionSubject: 'banner',
    actionSubjectId: e.bannerName,
    source: e.source,
    containers: e.containers,
    attributes: e.attributes,
    objectType: e.objectType,
    objectId: e.objectId,
  });
};

export interface SendCreatedBoardEvent {
  source: SourceType;
  // Require relevant containers for a create board event
  // Remove if/when container attribution is automated
  containers: {
    board: { id: string | null | undefined };
    organization: { id: string | null | undefined };
    enterprise?: { id: string | null | undefined };
  };
  attributes: {
    // Require certain attributes, but allow other attributes
    isTemplate: boolean | null | undefined;
    visibility: string | null | undefined;
    [key: string]: EventAttribute;
  };
}
export const sendCreatedBoardEvent = (
  e: SendCreatedBoardEvent,
  sendTrackEvent: (e: TrackEvent) => void,
): void => {
  sendTrackEvent({
    action: 'created',
    actionSubject: 'board',
    source: e.source,
    containers: e.containers,
    attributes: e.attributes,
  });
};

export interface SendCopiedBoardEvent {
  source: SourceType;
  // Require relevant containers for a copy board event
  // Remove if/when container attribution is automated
  containers: {
    board: { id: string | null | undefined };
    organization: { id: string | null | undefined };
    enterprise?: { id: string | null | undefined };
  };
  attributes: {
    // Require certain attributes, but allow other attributes
    sourceBoardId: string | null | undefined;
    templateCategory?: string | null | undefined;
    fromTemplate: boolean | null | undefined;
    visibility: string | null | undefined;
    [key: string]: EventAttribute;
  };
}
export const sendCopiedBoardEvent = (
  e: SendCopiedBoardEvent,
  sendTrackEvent: (e: TrackEvent) => void,
): void => {
  sendTrackEvent({
    action: 'copied',
    actionSubject: 'board',
    source: e.source,
    containers: e.containers,
    attributes: e.attributes,
  });
};

// For parity with Server track events
// https://bitbucket.org/trello/server/src/1fe036fec1decd4fff109e9eed4ffbdbc054b87d/app/lib/tracker/index.js#lines-414
export interface SendUpdatedBoardFieldEvent {
  field: ActionSubjectType;
  value?: boolean | number | string | null | undefined;
  source: SourceType;
  containers: {
    // Board container is required
    board: { id: string | null | undefined };
    organization?: { id: string | null | undefined };
    enterprise?: { id: string | null | undefined };
    list?: { id: string | null | undefined };
    card?: { id: string | null | undefined };
    workspace?: { id: string | null | undefined };
  };
  attributes?: object;
}
export const sendUpdatedBoardFieldEvent = (
  e: SendUpdatedBoardFieldEvent,
  sendTrackEvent: (e: TrackEvent) => void,
): void => {
  sendTrackEvent({
    action: 'updated',
    actionSubject: e.field,
    source: e.source,
    containers: e.containers,
    attributes: {
      updatedOn: 'board',
      // Both unique ids (which would otherwise be actionSubjectIds) and
      // discrete values for consistency
      // Org id goes into the organization container, not in value
      // https://hello.atlassian.net/wiki/spaces/MEASURE/pages/134329319/Track+Events
      value: e.value,
      ...e.attributes,
    },
  });
};

export interface SendUpdatedCardFieldEvent {
  field: ActionSubjectType;
  value?: boolean | number | string | null | undefined;
  source: SourceType;
  containers: EventContainer;
  attributes?: object;
}
export const sendUpdatedCardFieldEvent = (
  e: SendUpdatedCardFieldEvent,
  sendTrackEvent: (e: TrackEvent) => void,
): void => {
  sendTrackEvent({
    action: 'updated',
    actionSubject: e.field,
    source: e.source,
    containers: e.containers,
    attributes: {
      updatedOn: 'card',
      // Both unique ids (which would otherwise be actionSubjectIds) and
      // discrete values for consistency
      // Org id goes into the organization container, not in value
      // https://hello.atlassian.net/wiki/spaces/MEASURE/pages/134329319/Track+Events
      value: e.value,
      ...e.attributes,
    },
  });
};

export interface StartEventTask {
  taskName: Task;
  source: SourceType;
  containers?: EventContainer;
  attributes?: object;
  traceId?: string;
}
export const startTask = (
  e: StartEventTask,
  traceId: string,
  senderHelperOperationalEvent: (e: OperationalEvent) => void,
  taskSessionManager: TaskSessionManager,
): void => {
  taskSessionManager.createTaskSessionWithProvidedId(e.taskName, traceId);
  senderHelperOperationalEvent({
    action: 'taskStart',
    actionSubject: 'ui',
    source: 'ui',
    containers: e.containers,
    attributes: {
      task: e.taskName,
      taskId: traceId,
      source: e.source,
      ...e.attributes,
    },
  });
};

export interface TracedError extends Error {
  taskName?: Task;
  traceId?: string;
}

export interface EndEventTask {
  taskName: Task;
  traceId: string;
  spanId?: string;
  source: SourceType;
  containers?: EventContainer;
  attributes?: object;
}
export const taskSucceeded = (
  e: EndEventTask,
  senderHelperOperationalEvent: (e: OperationalEvent) => void,
  taskSessionManager: TaskSessionManager,
  trelloServerVersion: string | undefined,
  featureFlags: Record<string, boolean | string>,
): void => {
  senderHelperOperationalEvent({
    action: 'taskSuccess',
    actionSubject: 'ui',
    source: 'ui',
    containers: e.containers,
    attributes: {
      task: e.taskName,
      taskId: e.traceId,
      spanId: e.spanId,
      source: e.source,
      ...(trelloServerVersion && {
        versions: { trelloServer: trelloServerVersion },
      }),
      ...e.attributes,
      ...(Object.keys(featureFlags).length !== 0 && {
        flags: featureFlags,
      }),
    },
  });
  taskSessionManager.completeTaskSession(e.taskName);
};

export interface FailEventTask extends EndEventTask {
  error: Error | unknown;
}

export interface AbortEventTask extends EndEventTask {
  error?: Error | unknown;
}

interface ErrorAttributes {
  errorName?: string;
  errorMessage?: string;
}

export const getErrorAttributes = (
  e: AbortEventTask | FailEventTask,
): ErrorAttributes => {
  const errorAttributes: ErrorAttributes = {};
  if (e?.error instanceof Error) {
    if (e.error.name) {
      errorAttributes.errorName = e.error.name;
    }

    if (e.error.message) {
      errorAttributes.errorMessage = scrubMessage(e.error.message);
    }
  }

  return errorAttributes;
};

export const getTracedError = (
  e: AbortEventTask | FailEventTask,
  senderHelperOperationalEvent: (e: OperationalEvent) => void,
): TracedError | undefined => {
  // It's theoretically possible to send a non-object e.error from JS. This conservative
  // approach ensures we only append a traceId if e.error is an object. Otherwise,
  // it sends a GAS event with the err so we can investigate if/where this happens.
  if (e.error) {
    if (typeof e.error === 'object') {
      (e.error as TracedError).traceId = e.traceId;
      (e.error as TracedError).taskName = e.taskName;
    } else {
      senderHelperOperationalEvent({
        action: 'evaluated',
        actionSubject: 'nonObjectError',
        source: 'packages:atlassian-analytics',
        attributes: {
          error: e.error as Error,
        },
      });
    }
  }

  return e.error as TracedError | undefined;
};

export const taskFailed = (
  e: FailEventTask,
  senderHelperOperationalEvent: (e: OperationalEvent) => void,
  taskSessionManager: TaskSessionManager,
  trelloServerVersion: string | undefined,
  featureFlags: Record<string, boolean | string>,
): TracedError | undefined => {
  const errorAttributes: ErrorAttributes = getErrorAttributes(e);

  senderHelperOperationalEvent({
    action: 'taskFail',
    actionSubject: 'ui',
    source: 'ui',
    containers: e.containers,
    attributes: {
      task: e.taskName,
      taskId: e.traceId,
      source: e.source,
      ...(trelloServerVersion && {
        versions: { trelloServer: trelloServerVersion },
      }),
      ...e.attributes,
      ...errorAttributes,
      ...(Object.keys(featureFlags).length !== 0 && {
        flags: featureFlags,
      }),
    },
  });
  taskSessionManager.completeTaskSession(e.taskName);

  const tracedError = getTracedError(e, senderHelperOperationalEvent);
  return tracedError;
};

export const taskAborted = (
  e: EndEventTask,
  senderHelperOperationalEvent: (e: OperationalEvent) => void,
  taskSessionManager: TaskSessionManager,
  trelloServerVersion: string | undefined,
  featureFlags: Record<string, boolean | string>,
): TracedError | undefined => {
  const errorAttributes: ErrorAttributes = getErrorAttributes(e);
  senderHelperOperationalEvent({
    action: 'taskAbort',
    actionSubject: 'ui',
    source: 'ui',
    containers: e.containers,
    attributes: {
      task: e.taskName,
      taskId: e.traceId,
      source: e.source,
      ...(trelloServerVersion && {
        versions: { trelloServer: trelloServerVersion },
      }),
      ...e.attributes,
      ...errorAttributes,
      ...(Object.keys(featureFlags).length !== 0 && {
        flags: featureFlags,
      }),
    },
  });
  taskSessionManager.completeTaskSession(e.taskName);

  const tracedError = getTracedError(e, senderHelperOperationalEvent);
  return tracedError;
};
