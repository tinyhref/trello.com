import AnalyticsWebClient, {
  tenantType as analyticsTenantType,
  envType,
  originType,
  platformType,
} from '@atlassiansox/analytics-web-client';
import type {
  EventAttribute,
  EventAttributes,
  EventContainer,
  EventContainerType,
  MarketingScreen,
  SourceType,
  Task,
} from '@trello/analytics-types';
import { isDesktop, isLinux, isMac, isWindows } from '@trello/browser';
import {
  analyticsWebClientApiHost,
  analyticsWebClientApiHostProtocol,
  analyticsWebClientEnv,
  clientVersion,
  locale,
} from '@trello/config';
import { getEmailMatches } from '@trello/emails';
import { TrelloSessionStorage } from '@trello/storage';
import type { TrelloWindow } from '@trello/window-types';

import type { TracedError } from './helpers/helperFunctions';
import type {
  AnalyticsWebClientConfig,
  AnalyticsWebClientSettings,
  ContextType,
  DefaultAnalyticsContext,
  DefaultIdContext,
  OperationalEvent,
  ScreenEvent,
  TaskSessionManager,
  TaskSessions,
  TrackEvent,
  UIEvent,
} from './AnalyticsWebClient';
import { getMarketingAttributes } from './getMarketingAttributes';
import { getQueryParamOrHash } from './getQueryParamOrHash';
import { getReferrerMarketingAttributes } from './getReferrerMarketingAttributes';
// Helper validators, functions, and interfaces
import type {
  AbortEventTaskInterface,
  EndEventTaskInterface,
  FailEventTaskInterface,
  SendClickedButtonEventInterface,
  SendClickedLinkEventInterface,
  SendClosedComponentEventInterface,
  SendCopiedBoardEventInterface,
  SendCreatedBoardEventInterface,
  SendDismissedComponentEventInterface,
  SendPressedShortcutEventInterface,
  SendUpdatedBoardFieldEventInterface,
  SendUpdatedCardFieldEventInterface,
  SendViewedBannerEventInterface,
  SendViewedComponentEventInterface,
  StartEventTaskInterface,
} from './helpers';
import {
  checkForScreenHelper,
  sendClickedButtonEvent,
  sendClickedLinkEvent,
  sendClosedComponentEvent,
  sendCopiedBoardEvent,
  sendCreatedBoardEvent,
  sendDismissedComponentEvent,
  sendPressedShortcutEvent,
  sendUpdatedBoardFieldEvent,
  sendUpdatedCardFieldEvent,
  sendViewedBannerEvent,
  sendViewedComponentEvent,
  startTask,
  taskAborted,
  taskFailed,
  taskSucceeded,
} from './helpers';
import { LoggingAnalyticsWebClient } from './LoggingAnalyticsWebClient';

declare const window: TrelloWindow;

type EnvironmentVariableType = 'DEV' | 'PROD' | 'STAGING';

function getPlatform():
  | platformType.LINUX
  | platformType.MAC
  | platformType.WINDOWS
  | undefined {
  if (isDesktop()) {
    switch (true) {
      case isMac():
        return platformType.MAC;

      case isWindows():
        return platformType.WINDOWS;

      case isLinux():
        return platformType.LINUX;
      default:
    }
  }
}

const config = {
  env: envType[analyticsWebClientEnv as EnvironmentVariableType],
  product: 'trello',
  version: clientVersion,
  origin: isDesktop() ? originType.DESKTOP : originType.WEB,
  platform: getPlatform(),
  locale,
} as AnalyticsWebClientConfig;

const settings = {
  apiHost: analyticsWebClientApiHost,
  apiHostProtocol: analyticsWebClientApiHostProtocol,
  disableCookiePersistence: true,
} as AnalyticsWebClientSettings;

declare type PrimitiveSupportedFlagTypes = boolean | number | string;
export declare type SupportedFlagTypes =
  | Array<PrimitiveSupportedFlagTypes>
  | PrimitiveSupportedFlagTypes
  | {
      [key: string]: PrimitiveSupportedFlagTypes;
    };

interface SendValidationFailureEvent {
  event:
    | MarketingScreenEvent
    | OperationalEvent
    | ScreenEvent
    | TrackEvent
    | UIEvent;
  failedEventType: string;
  sentEvent: boolean;
  hasHelper?: string | undefined;
}

/**
 * Represents GAS attributes that might be added at a foundational/root level.
 */

interface DefaultAttributes {
  context?: DefaultAnalyticsContext;
  idContext?: DefaultIdContext;
  iframeSource?: string;
  searchId?: string;
  trelloMemberId?: string;
  hasPersonalProductivity?: boolean;
  newCardBack?: boolean;
}

interface MarketingScreenEvent {
  name: MarketingScreen;
  source: SourceType;
  containers?: EventContainer;
  attributes?: Parameters<typeof Analytics.sendScreenEvent>[0]['attributes'];
}
class AnalyticsWrapper {
  analytics: AnalyticsWebClient;
  defaultContext: DefaultAnalyticsContext;
  defaultIdContext: DefaultIdContext;
  trelloServerVersionMap: Map<string, string>;
  flagEvaluations: Record<string, boolean | string>;
  traceIdTimestampMap: Map<string, number>;
  traceIdTaskMap: Map<string, Task>;
  trelloMemberId: string | undefined;
  FIVE_MINUTES: number;

  private hasPersonalProductivity: boolean | null = null;
  private newCardBack: boolean | null = null;

  constructor(
    clientConfig: AnalyticsWebClientConfig,
    clientSettings?: AnalyticsWebClientSettings,
  ) {
    this.analytics = window.__useLoggingAnalytics
      ? new LoggingAnalyticsWebClient(clientConfig, clientSettings)
      : new AnalyticsWebClient(clientConfig, clientSettings);
    this.task = this.analytics.task;
    this.defaultContext = {};
    this.defaultIdContext = {};
    this.trelloServerVersionMap = new Map();
    this.flagEvaluations = {};
    this.traceIdTimestampMap = new Map();
    this.traceIdTaskMap = new Map();
    this.trelloMemberId = undefined;
    this.FIVE_MINUTES = 300 * 1000;

    this.abortTasksOnTabClose();
  }

  // Validate events against helpers and glossaries
  sendValidationFailureEvent(attributes: SendValidationFailureEvent): void {
    this.analytics.sendOperationalEvent({
      action: 'failed',
      actionSubject: 'eventValidation',
      source: '@trello/atlassian-analytics',
      attributes,
    });
  }

  // Only send valid containers
  private normalizeContainers(
    e:
      | MarketingScreenEvent
      | OperationalEvent
      | ScreenEvent
      | TrackEvent
      | UIEvent,
  ): void {
    if (!e.containers) {
      return;
    }
    const normalizedContainers: EventContainer = {};
    (Object.keys(e.containers) as EventContainerType[]).forEach(
      (container): void => {
        if (
          e.containers?.[container]?.id // ? only to keep TypeScript happy
        ) {
          normalizedContainers[container] = { id: e.containers[container]?.id };
          if (normalizedContainers?.organization) {
            //double publish organization container with workspace
            normalizedContainers.workspace = {
              id: normalizedContainers?.organization.id,
            };
          }
        }
      },
    );
    if (Object.keys(normalizedContainers).length > 0) {
      e.containers = normalizedContainers;
    } else {
      // Remove containers key if no valid containers to send
      delete e.containers;
    }
  }

  private updateWorkspaceInfo(
    e:
      | MarketingScreenEvent
      | OperationalEvent
      | ScreenEvent
      | TrackEvent
      | UIEvent,
  ): void {
    if (!e.containers?.workspace?.id) {
      return;
    }
    this.analytics.setWorkspaceInfo(e.containers.workspace.id);
  }

  /**
   * Normalizes all GAS events to make sure they contain proper
   * containers, a workspace ID, and all the default attributes
   *
   * All events should go through this method before being fired
   */
  private normalizeEvent(
    e: OperationalEvent | ScreenEvent | TrackEvent | UIEvent,
  ): void {
    this.normalizeContainers(e);
    this.updateWorkspaceInfo(e);
    this.addDefaultAttributes(e);
    this.scrubEmailFromAttributes(e);
  }

  abortTasksOnTabClose(): void {
    window.addEventListener('beforeunload', (): void => {
      const taskSessions = this.getTaskSessions();
      for (const task in taskSessions) {
        const traceId = taskSessions[task];
        this.taskAborted({
          taskName: task as Task,
          traceId,
          source: 'packages:atlassian-analytics',
          error: new Error('User closed the tab'),
        });
      }
    });
  }

  // Added specifically for marketing events, see HOT-99015
  // use sendScreenEvent for new screen events.
  sendMarketingScreenEvent({
    event,
    url,
    referrerUrl,
    referrerScreenName,
  }: {
    event: MarketingScreenEvent;
    url: URL;
    referrerUrl: URL | undefined;
    referrerScreenName: SourceType;
  }): void {
    // Convert marketing screen event to screen event for
    // the AnalyticsWebClient.
    const { source } = event;
    const screenEvent: ScreenEvent = event as ScreenEvent;

    this.normalizeEvent(screenEvent);
    const referrerAttributes = referrerUrl
      ? getReferrerMarketingAttributes(referrerUrl, referrerScreenName)
      : undefined;

    const marketingAttributes = getMarketingAttributes(
      source,
      url,
      referrerAttributes,
    );

    screenEvent.attributes = {
      ...marketingAttributes,
      ...screenEvent.attributes,
    };

    const helperMatch = checkForScreenHelper(screenEvent);
    if (helperMatch) {
      // If the event should be `viewedComponent` instead of a screen event,
      // prompt the dev to change and prevent invalid screen event from firing
      this.sendValidationFailureEvent({
        event,
        hasHelper: helperMatch,
        sentEvent: false,
        failedEventType: 'screen',
      });
      return;
    }

    this.analytics.sendScreenEvent(screenEvent);
  }
  // Main events
  sendScreenEvent(e: ScreenEvent): void {
    this.normalizeEvent(e);

    const helperMatch = checkForScreenHelper(e);
    if (helperMatch) {
      // If the event should be `viewedComponent` instead of a screen event,
      // prompt the dev to change and prevent invalid screen event from firing
      this.sendValidationFailureEvent({
        event: e,
        hasHelper: helperMatch,
        sentEvent: false,
        failedEventType: 'screen',
      });
      return;
    }

    this.analytics.sendScreenEvent(e);
  }

  sendUIEvent(e: UIEvent): void {
    this.normalizeEvent(e);
    this.analytics.sendUIEvent(e);
  }

  sendTrackEvent(e: TrackEvent): void {
    this.normalizeEvent(e);
    this.analytics.sendTrackEvent(e);
  }

  sendOperationalEvent(e: OperationalEvent): void {
    this.normalizeEvent(e);
    this.analytics.sendOperationalEvent(e);
  }

  // Helpers
  sendClickedButtonEvent = (e: SendClickedButtonEventInterface): void => {
    sendClickedButtonEvent(e, this.sendUIEvent.bind(this));
  };
  sendClickedLinkEvent = (e: SendClickedLinkEventInterface): void => {
    sendClickedLinkEvent(e, this.sendUIEvent.bind(this));
  };
  sendPressedShortcutEvent = (e: SendPressedShortcutEventInterface): void => {
    sendPressedShortcutEvent(e, this.sendUIEvent.bind(this));
  };
  sendClosedComponentEvent = (e: SendClosedComponentEventInterface): void => {
    sendClosedComponentEvent(e, this.sendUIEvent.bind(this));
  };
  sendDismissedComponentEvent = (
    e: SendDismissedComponentEventInterface,
  ): void => {
    sendDismissedComponentEvent(e, this.sendUIEvent.bind(this));
  };
  sendViewedComponentEvent = (e: SendViewedComponentEventInterface): void => {
    sendViewedComponentEvent(e, this.sendUIEvent.bind(this));
  };
  sendViewedBannerEvent = (e: SendViewedBannerEventInterface): void => {
    sendViewedBannerEvent(e, this.sendUIEvent.bind(this));
  };
  sendCreatedBoardEvent = (e: SendCreatedBoardEventInterface): void => {
    sendCreatedBoardEvent(e, this.sendTrackEvent.bind(this));
  };
  sendCopiedBoardEvent = (e: SendCopiedBoardEventInterface): void => {
    sendCopiedBoardEvent(e, this.sendTrackEvent.bind(this));
  };
  sendUpdatedBoardFieldEvent = (
    e: SendUpdatedBoardFieldEventInterface,
  ): void => {
    sendUpdatedBoardFieldEvent(e, this.sendTrackEvent.bind(this));
  };
  sendUpdatedCardFieldEvent = (e: SendUpdatedCardFieldEventInterface): void => {
    sendUpdatedCardFieldEvent(e, this.sendTrackEvent.bind(this));
  };

  // Pageview event
  /**
   * Send a GAS pageview event when navigating to a new route.
   * Source should correspond to the provided url.
   * **NOT** to be used in place of screen events.
   */
  sendPageviewEvent({
    url,
    screen,
    referrerUrl,
    referrerScreen,
  }: {
    url: URL;
    screen: SourceType;
    referrerUrl: URL | undefined;
    referrerScreen: SourceType;
  }): void {
    const referrerAttributes = referrerUrl
      ? getReferrerMarketingAttributes(referrerUrl, referrerScreen)
      : undefined;

    const marketingAttributes = getMarketingAttributes(
      screen,
      url,
      referrerAttributes,
    );
    this.sendUIEvent({
      action: 'displayed',
      actionSubject: 'pageV2',
      source: screen,
      attributes: { ...marketingAttributes },
    });
  }

  // Initialization events
  setTenantInfo(
    tenantType: Parameters<AnalyticsWebClient['setTenantInfo']>[0],
    tenantId?: string,
  ): void {
    this.analytics.setTenantInfo(tenantType, tenantId);

    if (tenantId && tenantType === analyticsTenantType.TRELLO_WORKSPACE_ID) {
      this.analytics.setWorkspaceInfo(tenantId);
    } else {
      this.analytics.clearWorkspaceInfo();
    }
  }

  setOrgInfo(orgId: string): void {
    this.analytics.setOrgInfo(orgId);
  }

  clearUserInfo(): void {
    this.analytics.clearUserInfo();
  }

  setUserInfo(
    userType: 'atlassianAccount' | 'hashedEmail' | 'opsgenie' | 'trello',
    userId: string,
  ): void {
    this.analytics.setUserInfo(userType, userId);
  }

  clearTrelloMemberId(): void {
    this.trelloMemberId = undefined;
    this.analytics.clearUIViewedAttributes();
  }

  setTrelloMemberId(memberId: string): void {
    this.trelloMemberId = memberId;
    this.analytics.setUIViewedAttributes({ trelloMemberId: memberId });
  }

  sendIdentifyEvent(
    userType: 'atlassianAccount' | 'hashedEmail' | 'opsgenie' | 'trello',
    userId: string,
  ): void {
    this.analytics.sendIdentifyEvent(userType, userId);
  }

  startUIViewedEvent(): void {
    this.analytics.startUIViewedEvent();
  }

  stopUIViewedEvent(): void {
    this.analytics.stopUIViewedEvent();
  }

  /**
   * Some child components (e.g. @atlassian/switcher) require consumers
   * to fire their events. In these cases, we don't want to do any validation.
   *
   * This function is appropriate inspired by React's dangerouslySetInnerHTML as it
   * bypasses in-built allow-lists. Use with care!
   */
  dangerouslyGetAnalyticsWebClient(): AnalyticsWebClient {
    return this.analytics;
  }

  // Task Sessions
  readonly task: TaskSessionManager;

  // Tracing
  get128BitTraceId(): string {
    // Return 128 bit trace ids (32 hexadecimal digits)
    // https://github.com/openzipkin/zipkin-js/blob/98f7796d54199ccb2a81dea04c466a40814ccb24/packages/zipkin/src/tracer/index.js#L77
    // but support B3 single format with fist 32 bits (8 digits) as epoch seconds
    // https://github.com/openzipkin/b3-propagation/blob/master/STATUS.md#epoch128

    const epochSeconds = Math.floor(Date.now() / 1000).toString(16);
    const remainingBits =
      this.get64BitSpanId().slice(8) + this.get64BitSpanId();

    return epochSeconds + remainingBits;
  }
  get64BitSpanId(): string {
    // Generates 64 bit string
    // Taken from openzipkin/zipkin-js
    // https://github.com/openzipkin/zipkin-js/blob/50d9c3afb662c2d18d688ecef66883d6c5326f4b/packages/zipkin/src/tracer/randomTraceId.js
    const digits = '0123456789abcdef';
    let n = '';
    for (let i = 0; i < 16; i += 1) {
      const rand = Math.floor(Math.random() * 16);
      n += digits[rand];
    }
    return n;
  }

  startTask = (e: StartEventTaskInterface): string => {
    const traceId = e.traceId || this.get128BitTraceId();
    startTask(e, traceId, this.sendOperationalEvent.bind(this), this.task);
    this.traceIdTaskMap.set(traceId, e.taskName);
    return traceId;
  };

  getTaskSessions = (): TaskSessions => {
    return this.task.getAllTaskSessions();
  };

  taskSucceeded = (e: EndEventTaskInterface): void => {
    taskSucceeded(
      e,
      this.sendOperationalEvent.bind(this),
      this.task,
      this.getTrelloServerVersion(e),
      this.getFlags(),
    );
  };

  taskFailed = (e: FailEventTaskInterface): TracedError | undefined => {
    return taskFailed(
      e,
      this.sendOperationalEvent.bind(this),
      this.task,
      this.getTrelloServerVersion(e),
      this.getFlags(),
    );
  };

  /**
   * Used to cancel or noop a task. Should NOT be used for handled errors, but to mark the "rollback"
   * of a task. Good examples of this are navigating away from a page/tab.
   *
   * @param {AbortEventTaskInterface} e (required) abort parameters
   * @param {string} e.traceId (required) traceId from taskStart
   * @param {string} e.taskName (required) name of the task being aborted
   * @param {string} e.source (required) where this task is being aborted
   * @example
   * // Typically used when interacting with Backbone models
   * Analytics.taskAborted({ traceId, taskName, source });
   */
  taskAborted = (e: AbortEventTaskInterface): TracedError | undefined => {
    return taskAborted(
      e,
      this.sendOperationalEvent.bind(this),
      this.task,
      this.getTrelloServerVersion(e),
      this.getFlags(),
    );
  };

  getTaskForTraceId = (traceId: string): Task => {
    return this.traceIdTaskMap.get(traceId) || 'not-implemented';
  };

  /**
   * Returns the proper vitalstats request headers for a given traceID.
   * Currently:
   *  X-Trello-TraceId: legacy custom header containing the traceId
   *  X-Trello-Task: The name of a capability, if any, associated
   *    with the traceId. For example create-card/timeline
   *  X-B3-TraceId: Standard zipkin tracing header containing the traceId
   *  X-B3-SpanId: Standard zipkin tracing header containing a spanId.
   *    Note: This header *must* be set in order for Global Edge to
   *          propagate the X-B3-TraceId header
   */
  getTaskRequestHeaders = (
    traceId: string | null | undefined,
  ): Record<string, string> => {
    if (!traceId) {
      return {};
    }

    return {
      'X-Trello-TraceId': traceId,
      'X-Trello-Task': this.getTaskForTraceId(traceId),
      'X-B3-SpanId': this.get64BitSpanId(),
      'X-B3-TraceId': traceId,
    };
  };

  removeTraceIdFromMaps = (traceId: string): void => {
    this.trelloServerVersionMap.delete(traceId);
    this.traceIdTimestampMap.delete(traceId);
    this.traceIdTaskMap.delete(traceId);
  };

  expireTraceIds = (): void => {
    const now = Date.now();
    this.traceIdTimestampMap.forEach((timestamp, traceId): void => {
      if (timestamp && now - timestamp > this.FIVE_MINUTES) {
        this.removeTraceIdFromMaps(traceId);
      }
    });
  };

  setTrelloServerVersion = (
    traceId: string | null | undefined,
    trelloServerVersion: string | null | undefined,
  ): void => {
    if (traceId && trelloServerVersion) {
      this.trelloServerVersionMap.set(traceId, trelloServerVersion);
      this.traceIdTimestampMap.set(traceId, Date.now());
    }

    this.expireTraceIds();
  };

  getTrelloServerVersion = (e: EndEventTaskInterface): string | undefined => {
    // It's possible to receive the socket delta before the Trello API response. In this
    // case, we'll send taskSuccess for send-message before sending taskSuccess for
    // the initial capability. Since the send-message task contains the same traceId,
    // this would get and remove the key-value pair form trelloServerVersionMap. As a result,
    // the taskSuccess for the initial capability would not contain the trelloServerVersion.
    // We don't want that to happen, and we don't need to associate trelloServerVersion with
    // send-message tasks anyway, so we should just return early in this case.
    if (e.taskName === 'send-message') {
      return;
    }

    const trelloServerVersion = this.trelloServerVersionMap.get(e.traceId);
    this.removeTraceIdFromMaps(e.traceId);
    return trelloServerVersion;
  };

  // Set flag attributes for VitalStats monitoring

  setFlagEvaluation = (
    flagName: string,
    flagEvaluation: SupportedFlagTypes,
  ): void => {
    if (
      typeof flagEvaluation === 'boolean' ||
      typeof flagEvaluation === 'string'
    ) {
      this.flagEvaluations[flagName] = flagEvaluation;
    }
  };

  getFlags = (): Record<string, boolean | string> => {
    return this.flagEvaluations;
  };

  // Default Attributes

  private addDefaultAttributes = (
    e: OperationalEvent | ScreenEvent | TrackEvent | UIEvent,
  ): void => {
    const attrsToAdd: DefaultAttributes = {};

    if (this.trelloMemberId) {
      attrsToAdd.trelloMemberId = this.trelloMemberId;
    }

    if (this.hasPersonalProductivity !== null) {
      attrsToAdd.hasPersonalProductivity = this.hasPersonalProductivity;
    }

    if (this.newCardBack !== null) {
      attrsToAdd.newCardBack = this.newCardBack;
    }

    const iframeSrcParam = getQueryParamOrHash('iframeSource');
    if (iframeSrcParam) {
      attrsToAdd.iframeSource = iframeSrcParam;
    }

    const searchId = TrelloSessionStorage.get('searchSessionId');
    if (searchId) {
      attrsToAdd.searchId = searchId;
    }

    if (Object.entries(this.defaultContext).length) {
      attrsToAdd.context = this.defaultContext;
    }

    if (Object.entries(this.defaultIdContext).length) {
      attrsToAdd.idContext = this.defaultIdContext;
    }

    // Next line prevents unnecessarily adding an empty attributes object to an event with no attributes
    if (!Object.entries(attrsToAdd).length) return;

    if (!e.attributes) e.attributes = {};
    e.attributes = {
      ...(attrsToAdd as EventAttributes),
      ...e.attributes,
    };
  };

  private scrubEmailFromAttributes = (
    e: OperationalEvent | ScreenEvent | TrackEvent | UIEvent,
  ): void => {
    if (!e.attributes) return;

    const scrubbedAttributes = Object.entries(e.attributes).map(
      ([key, value]): EventAttribute[] => {
        const matches = typeof value === 'string' && getEmailMatches(value);
        if (matches && matches.length > 0) {
          let redactedValue = value;
          matches.forEach(
            (match) =>
              (redactedValue = redactedValue.replaceAll(
                match,
                '<EMAIL_REDACTED>',
              )),
          );
          return [key, redactedValue];
        }
        return [key, value];
      },
    );

    e.attributes = Object.fromEntries(scrubbedAttributes);
  };

  setContext = (attributes: DefaultAnalyticsContext): void => {
    this.defaultContext = attributes;
  };

  setHasPersonalProductivity = (hasPersonalProductivity: boolean): void => {
    this.hasPersonalProductivity = hasPersonalProductivity;
  };

  setNewCardBack = (newCardBack: boolean): void => {
    this.newCardBack = newCardBack;
  };

  /** Restores the entire `defaultAttributes` object to an empty state,
   * unless a specific context type to clear is passed in, in which
   * case only that field is cleared from the `context` object
   * */
  clearContext = (type?: ContextType): void => {
    if (type) delete this.defaultContext[type];
    else {
      this.defaultContext = {};
    }
  };

  public clearHasPersonalProductivity = (): void => {
    this.hasPersonalProductivity = null;
  };

  public clearNewCardBack = (): void => {
    this.newCardBack = null;
  };

  mergeContext = (attributes: Partial<DefaultAnalyticsContext>): void => {
    for (const key in attributes) {
      const context = key as keyof DefaultAnalyticsContext;
      this.defaultContext[context] = {
        ...this.defaultContext[context],
        ...attributes[context],
      };
    }
  };

  setIdContext = (idContext: DefaultIdContext): void => {
    this.defaultIdContext = idContext;
  };

  clearIdContext = (): void => {
    this.defaultIdContext = {};
  };
}

export const Analytics = new AnalyticsWrapper(config, settings);

// TL;DR -- DON'T DELETE THIS YET :pray:
// Okay, so here's the deal. Deleting all references to Google Analytics (GA) in one go results in a spike of
// reference errors in Sentry:
// https://sentry.prod.atl-paas.net/atlassian/trello-web/issues/785705/?query=is%3Aunresolved%20ga%20is%20not%20defined
// To assess whether the deletion can go as planned, we need more data on whether (and if so, how quickly) the errors
// taper off after initial release.
// Because GA is defined and called in index.template.ts, we have limited tracking capabilities.
// We've no-oped GA in index.template.ts and here because non useful errors continued to fire
window.ga = (): void => {};
