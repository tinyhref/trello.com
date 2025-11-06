import type {
  OperationalEventPayload,
  ScreenEventPayload,
  TrackEventPayload,
  UIEventPayload,
} from '@atlassiansox/analytics-web-client';
import type AnalyticsWebClient from '@atlassiansox/analytics-web-client';

import { Analytics } from './AnalyticsClient';

function isUITrackAndOperationalEventMethodString(
  p: string | symbol,
): p is 'sendOperationalEvent' | 'sendTrackEvent' | 'sendUIEvent' {
  return (
    typeof p === 'string' &&
    ['sendOperationalEvent', 'sendTrackEvent', 'sendUIEvent'].includes(p)
  );
}

function isScreenEventMethodString(p: string | symbol): p is 'sendScreenEvent' {
  return typeof p === 'string' && p === 'sendScreenEvent';
}

let analyticsClientProxy: AnalyticsWebClient | undefined;

export const getAnalyticsClientMemberIdProxy = (): AnalyticsWebClient => {
  if (!analyticsClientProxy) {
    analyticsClientProxy = new Proxy(
      Analytics.dangerouslyGetAnalyticsWebClient(),
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        get(target, p, receiver): any {
          if (isScreenEventMethodString(p)) {
            return (
              event: ScreenEventPayload | string,
              callback: unknown,
              attributes?: unknown,
            ): Promise<void> => {
              if (typeof event === 'string') {
                attributes = {
                  ...(attributes || {}),
                  trelloMemberId: Analytics.trelloMemberId,
                };
              } else {
                event.attributes = {
                  ...(event.attributes || {}),
                  trelloMemberId: Analytics.trelloMemberId,
                };
              }
              return target[p](event, callback, attributes);
            };
          } else if (isUITrackAndOperationalEventMethodString(p)) {
            return (
              event:
                | OperationalEventPayload
                | TrackEventPayload
                | UIEventPayload,
              callback: unknown,
            ): Promise<void> | undefined => {
              if (!event.attributes) {
                event.attributes = {};
              }
              event.attributes = {
                ...event.attributes,
                trelloMemberId: Analytics.trelloMemberId,
              };
              if (Object.hasOwn(target, p)) {
                return target[p](event, callback);
              }
            };
          }
          // Note: forgetting to return the Reflect.get call will cause the proxy
          // to throw on methods not defined in the proxy
          return Reflect.get(target, p, receiver);
        },
      },
    );
  }
  return analyticsClientProxy;
};
