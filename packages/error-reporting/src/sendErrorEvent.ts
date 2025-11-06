import { captureException, withScope } from '@sentry/browser';

import type { EventAttributes } from '@trello/analytics-types';
import type { TracedError } from '@trello/atlassian-analytics';
import { Analytics } from '@trello/atlassian-analytics';
import {
  asString,
  getLanguage,
  isBrowserSupported,
  isDesktop,
} from '@trello/browser';
import { bifrostTrack, clientVersion, desktopVersion } from '@trello/config';
import type { NetworkError } from '@trello/graphql-error-handling';
import { getScreenFromUrl } from '@trello/marketing-screens';

import type { Feature } from './features';
import { getMemberProperty } from './getMemberProperty';
import { getSessionId } from './getSessionId';
import type { OwnershipArea } from './ownershipAreas';
import { redactUrlsInStackTrace } from './redactUrlsInStackTrace';

interface SentryEntry {
  name: string;
  msg: string;
  stack?: string;
  ua: string;
  browser: string;
  isBrowserSupported: boolean;
  language: string;
  clientVersion: { head: string; version: number; patch: number };
  tags: {
    [key: string]: boolean | string;
  };
  extra: {
    [key: string]: boolean | string;
  };
  sentryEventId: string | null;
  idMember?: string;
}

interface SentryOwnershipTags {
  ownershipArea?: OwnershipArea;
}

interface SentryFeatureTags {
  feature?: Feature;
}

interface SentryTags {
  [key: string]: string;
}

interface SentryExtraData {
  [key: string]: boolean | string | null;
}

/**
 * SentryErrorMetadata defines additional error context
 * sent to Sentry. Tags are searchable entities, whereas
 * extraData is read-only data that can be viewed on the
 * error page.
 */
export interface SentryErrorMetadata {
  tags?: SentryOwnershipTags & SentryFeatureTags & SentryTags;
  extraData?: SentryExtraData;
  networkError?: NetworkError | null;
}

interface ErrorEventAttributes extends EventAttributes {
  name: string;
  msg: string;
  stack?: string;
  trelloSessionId: string;
  channel: string | null;
  clientVersion: string | null;
  sentryEventId: string | null;
  isBrowserSupported: boolean;
  browser: string;
  isDesktop: boolean;
  desktopVersion: string;
  taskId?: string;
  task?: string;
  language?: string;
  extra?: SentryExtraData;
  tags?: SentryOwnershipTags & SentryTags;
}

const replaceSlashInSentryTag = (tagKey: string): string => {
  // Sentry doesn't seem to like forward slashes in tag keys.
  // This replaces all instances of them with dashes.
  return tagKey.replace(/\//g, '-');
};

const displayErrorInConsole = (data: SentryEntry) => {
  const { hostname } = window.location;

  if (hostname !== 'trello.com') {
    console.error(data);
  }
};

const isTracedError = (error: Error): error is TracedError =>
  Object.prototype.hasOwnProperty.call(error, 'traceId') &&
  Object.prototype.hasOwnProperty.call(error, 'taskName');

/**
 * Sends an error entry to Sentry and to GAS
 *
 * @param errorEvent the errorEvent to send to Sentry
 */
export const sendErrorEvent = async (
  error: Error | unknown,
  metadata: SentryErrorMetadata = {
    tags: {},
    extraData: {},
  },
  isCrash: boolean = false,
): Promise<void> => {
  if (!(error instanceof Error)) {
    return;
  }

  const versionParts = clientVersion.split('-');
  const head = versionParts.slice(0, -1).join('-');
  const version = parseInt(versionParts.slice(-1)[0], 10);
  const memberProperty = getMemberProperty();
  const language = getLanguage();
  let formattedNetworkError = {};
  if (metadata.networkError) {
    formattedNetworkError = {
      networkErrorCode: metadata.networkError?.code,
      networkErrorMessage: metadata.networkError?.message,
      networkErrorStatus: `${metadata.networkError?.status}`,
    };
  }

  const taskPrefix = 'task_';
  // Explicit VitalStats tracing: an error has a traceId and task
  if (isTracedError(error) && metadata.tags) {
    const taskName = error.taskName;
    const sentryKey = replaceSlashInSentryTag(`${taskPrefix}${taskName}`);
    metadata.tags[sentryKey] = error.traceId ?? '';
  }

  // Implicit VitalStats tracing: an error occured during one or more tasks
  const taskSessions = Analytics.getTaskSessions();
  if (metadata.tags) {
    for (const task in taskSessions) {
      const sentryKey = replaceSlashInSentryTag(`${taskPrefix}${task}`);
      metadata.tags[sentryKey] = taskSessions[task];
    }
  }

  const extra = {
    ...formattedNetworkError,
    ...metadata.extraData,
  };

  let sentryEventId: string | null = null;
  // Send the error to the Atlassian internal sentry
  withScope((scope) => {
    if (metadata.tags) {
      scope.setTags(metadata.tags);
    }
    if (extra) {
      scope.setExtras(extra);
    }
    sentryEventId = captureException(error);
  });

  // Send to the /err endpoint
  const entry: SentryEntry = {
    name: error.name,
    msg: error.message,
    stack: error.stack,
    ua: navigator.userAgent,
    browser: asString,
    isBrowserSupported: isBrowserSupported(),
    language,
    clientVersion: { head, version, patch: 0 },
    tags: {
      isBrowserSupported: isBrowserSupported(),
      ...(metadata.tags as SentryTags),
    },
    extra,
    sentryEventId,
    ...memberProperty,
  };

  displayErrorInConsole(entry);

  const attributes: ErrorEventAttributes = {
    name: error.name,
    msg: error.message,
    stack: error.stack ? redactUrlsInStackTrace(error.stack) : undefined,
    trelloSessionId: getSessionId(),
    channel: bifrostTrack,
    clientVersion,
    sentryEventId,
    isBrowserSupported: isBrowserSupported(),
    browser: asString,
    isDesktop: isDesktop(),
    desktopVersion,
    language,
    extra,
    tags: metadata.tags,
  };

  if (isTracedError(error)) {
    attributes.taskId = error.traceId;
    attributes.task = error.taskName;
  }

  const source = getScreenFromUrl();
  Analytics.sendOperationalEvent({
    source,
    action: isCrash ? 'crashed' : 'errored',
    actionSubject: 'app',
    attributes,
  });
};
