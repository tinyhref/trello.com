import { kebabCase } from 'change-case';

import { addUFOCustomData } from '@atlaskit/react-ufo/custom-data';
import {
  init,
  type GenericAnalyticWebClientPromise,
} from '@atlaskit/react-ufo/interaction-metrics-init';
import _traceUFOPageLoad from '@atlaskit/react-ufo/trace-pageload';
import { Analytics } from '@trello/atlassian-analytics';
import { clientVersion, environment } from '@trello/config';
import { dangerouslyGetDynamicConfigSync } from '@trello/dynamic-config/dangerouslyGetDynamicConfigSync';

type DeviceClass = 'computer' | 'phone';

export const getDeviceClass = (userAgent: string): DeviceClass => {
  // Mobile should _always_ indicate a phone, as per this article:
  // https://developers.google.com/search/blog/2011/03/mo-better-to-also-detect-mobile-user
  if (userAgent.toLowerCase().includes('mobile')) {
    return 'phone';
  }

  return 'computer';
};

/** Flag to track whether UFO has been initialized */
let ufoV2Initialized = false;
let ufoEverDisabled = false;
let initialSampleRate: number = -1;

/**
 * Checks if UFO is enabled and initialized. Automatically disables UFO on the client side if a change to the sample
 * rate is detected, since UFO is not currently capable of changing this after initialization.
 *
 * @returns True if UFO is both initialized and enabled via dynamic config
 */
export const isUFOEnabled = (): boolean => {
  // If the dynamic config indicates UFO is disabled, drop all traffic
  if (!dangerouslyGetDynamicConfigSync('trello_web_enable_ufo') as boolean) {
    ufoEverDisabled = true;
    return false;
  }

  // If the sample rate changes, and UFO has ever been disabled (on this page load), we might be experiencing an active incident.
  // Drop all traffic until the next page load.
  if (
    initialSampleRate !==
      (dangerouslyGetDynamicConfigSync(
        'trello_web_ufo_sampling_rate',
      ) as number) &&
    ufoEverDisabled
  ) {
    return false;
  }

  // Reset everDisabled flag if UFO is enabled again, to clear the state for long running tabs
  ufoEverDisabled = false;
  return true;
};

async function getAnalyticsClient(): Promise<GenericAnalyticWebClientPromise> {
  /* logic to get/initialise your app's analytics client */
  return {
    getAnalyticsWebClientPromise: () =>
      new Promise((resolve) =>
        resolve({
          getInstance: () => {
            return {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is the specified type in the upstream UFO library
              sendOperationalEvent: (payload: any) => {
                // Ensure UFO is enabled before sending events, allows us to cut off event volume without a page reload
                if (isUFOEnabled()) {
                  Analytics.sendOperationalEvent(payload);
                }
              },
            };
          },
        }),
      ),
  };
}

/**
 * Type definition for route change handler function.
 *
 * @param routeName - The name of the route being navigated to
 */
type RouteChangeHandler = (routeName: string) => void;

/** Internal handler for route changes, defaults to no-op */
let onRouteChangeHandler: RouteChangeHandler = () => {};

/**
 * Initializes UFO (Unified Frontend Observability) for performance monitoring and analytics.
 *
 * This function sets up UFO with Trello-specific configuration including:
 * - Visual change detection with heatmap tracking
 * - Selector configuration to avoid PII/UGC exposure
 * - Performance metrics for page loads and transitions
 * - Integration with GASv3
 *
 * @param initialRouteName - The name of the initial route to trace on page load
 * @returns A route change handler function that can be called when routes change.
 *
 * @example
 * ```typescript
 * const handleRouteChange = initializeUFOv2('dashboard');
 * // Later, when route changes:
 * handleRouteChange('board-view');
 * ```
 */
export const initializeUFOWrapper = (
  initialRouteName: string,
): RouteChangeHandler => {
  if (
    !dangerouslyGetDynamicConfigSync('trello_web_enable_ufo') ||
    ufoV2Initialized
  ) {
    return () => {};
  }

  // For a full list of UFO config options, see the `Config` type definition
  // Tip: set config fields via feature flag
  const config = {
    vc: {
      enabled: true,
      heatmapSize: 200,
      oldDomUpdates: false,
      devToolsEnabled: true,

      // Account for possible UGC/PII in DOM attributes here
      selectorConfig: {
        id: false,
        'aria-label': false,
        role: true,
        className: true,
        testId: true,
      },
    },
    product: 'trello',
    region: 'unknown',
    environment,
    app: { version: { web: clientVersion } },
    // Sampling rates for experience IDs 0-1
    rates: {
      ['experienceId']: 0,
    },
    // Sampling rates for event types 0-1
    kind: {
      page_load: dangerouslyGetDynamicConfigSync(
        'trello_web_ufo_sampling_rate',
      ) as number,
      transition: dangerouslyGetDynamicConfigSync(
        'trello_web_ufo_sampling_rate',
      ) as number,
      press: dangerouslyGetDynamicConfigSync(
        'trello_web_ufo_sampling_rate',
      ) as number,
      typing: 0,
      legacy: 0,
      hover: 0,
    },
  };

  initialSampleRate = dangerouslyGetDynamicConfigSync(
    'trello_web_ufo_sampling_rate',
  ) as number;

  ufoV2Initialized = true;
  init(getAnalyticsClient(), config);
  _traceUFOPageLoad(kebabCase(initialRouteName));

  addUFOCustomData({
    userAgent: navigator.userAgent,
    deviceClass: getDeviceClass(navigator.userAgent),
  });

  return (routeName: string) => {
    onRouteChangeHandler(routeName);
  };
};

/**
 * Sets a custom route change handler for UFO v2.
 *
 * This allows external code to register a handler that will be called
 * whenever the route change handler returned by `initializeUFOv2` is invoked.
 *
 * @param handler - Function to be called when routes change
 *
 * @example
 * ```typescript
 * setRouteChangeHandler((routeName) => {
 *   console.log(`Route changed to: ${routeName}`);
 *   // Additional custom logic here
 * });
 * ```
 */
export const setRouteChangeHandler = (handler: (routeName: string) => void) => {
  onRouteChangeHandler = handler;
};
