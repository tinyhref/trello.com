/* eslint-disable @trello/enforce-variable-case */
import type {
  CLSAttribution,
  CLSMetricWithAttribution,
  FCPAttribution,
  FCPMetricWithAttribution,
  INPAttribution,
  INPMetricWithAttribution,
  LCPAttribution,
  LCPMetricWithAttribution,
  MetricWithAttribution,
  TTFBAttribution,
  TTFBMetricWithAttribution,
} from 'web-vitals/attribution';
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals/attribution';

import type { SourceType, Task } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';
import { Cookies } from '@trello/cookies';
import { dangerouslyGetDynamicConfigSync } from '@trello/dynamic-config/dangerouslyGetDynamicConfigSync';
import { getScreenFromUrl } from '@trello/marketing-screens';

const INP_DURATION_THRESHOLD = 100;

type MemoryInfo = {
  totalJSHeapSize: number;
  usedJSHeapSize: number;
  jsHeapSizeLimit: number;
};

declare global {
  interface Performance {
    memory?: MemoryInfo;
  }
}

// Mapping for screen -> taskName for the VitalStats web-vitals tasks
const sourceToTask: Partial<Record<SourceType, Task | undefined>> = {
  boardScreen: 'load-page/boardScreen',
  cardDetailScreen: 'load-page/cardDetailScreen',
  memberHomeScreen: 'load-page/memberHomeScreen',
};

function isValidScreenForTask(task: Task | undefined): task is Task {
  return task !== undefined;
}

const hasDataset = (
  el: Element,
): el is HTMLElement & { dataset?: { testid?: string } } => 'dataset' in el;

// Helper to safely extract data-testid regardless of whether `dataset` is present
// (only on HTMLElements) or we need to fall back to `getAttribute`.
const getDatasetTestId = (el?: Element | null): string | null | undefined => {
  if (!el) {
    return;
  }

  if (hasDataset(el) && el.dataset?.testid) {
    return el.dataset.testid;
  }

  if (typeof el.getAttribute === 'function') {
    return el.getAttribute('data-testid');
  }

  return;
};

type Attribution =
  | CLSAttribution
  | FCPAttribution
  | INPAttribution
  | LCPAttribution
  | TTFBAttribution;

const isFCPAttribution = (
  name: MetricWithAttribution['name'],
  _attribution: Attribution,
): _attribution is FCPAttribution => name === 'FCP';

const isLCPAttribution = (
  name: MetricWithAttribution['name'],
  _attribution: Attribution,
): _attribution is LCPAttribution => name === 'LCP';

const isTTFBAttribution = (
  name: MetricWithAttribution['name'],
  _attribution: Attribution,
): _attribution is TTFBAttribution => name === 'TTFB';

const isINPAttribution = (
  name: MetricWithAttribution['name'],
  _attribution: Attribution,
): _attribution is INPAttribution => name === 'INP';

const isCLSAttribution = (
  name: MetricWithAttribution['name'],
  _attribution: Attribution,
): _attribution is CLSAttribution => name === 'CLS';

const formatAttribution = (
  name: MetricWithAttribution['name'],
  attribution: Attribution,
) => {
  if (isFCPAttribution(name, attribution)) {
    return {
      firstByteToFCP: attribution.firstByteToFCP,
      timeToFirstByte: attribution.timeToFirstByte,
    };
  } else if (isLCPAttribution(name, attribution)) {
    return {
      datasetTestId: getDatasetTestId(attribution.lcpEntry?.element),
      element: attribution.target,
      elementRenderDelay: attribution.elementRenderDelay,
      resourceLoadDelay: attribution.resourceLoadDelay,
      resourceLoadDuration: attribution.resourceLoadDuration,
      timeToFirstByte: attribution.timeToFirstByte,
    };
  } else if (isCLSAttribution(name, attribution)) {
    return {
      largestShiftTarget: attribution.largestShiftTarget,
      largestShiftTime: attribution.largestShiftTime,
      largestShiftValue: attribution.largestShiftValue,
      loadState: attribution.loadState,
    };
  } else if (isTTFBAttribution(name, attribution)) {
    return {
      connectionDuration: attribution.connectionDuration,
      dnsDuration: attribution.dnsDuration,
      requestDuration: attribution.requestDuration,
      waitingDuration: attribution.waitingDuration,
    };
  } else if (isINPAttribution(name, attribution)) {
    return {
      interactionTarget: attribution.interactionTarget,
      interactionType: attribution.interactionType,
      interactionTime: attribution.interactionTime,
      nextPaintTime: attribution.nextPaintTime,
      inputDelay: attribution.inputDelay,
      processingDuration: attribution.processingDuration,
      presentationDelay: attribution.presentationDelay,
      loadState: attribution.loadState,
    };
  }
};

const formatMetric = (
  metric:
    | CLSMetricWithAttribution
    | FCPMetricWithAttribution
    | INPMetricWithAttribution
    | LCPMetricWithAttribution
    | TTFBMetricWithAttribution,
) => ({
  value: metric.value,
  rating: metric.rating,
  navigationType: metric.navigationType,
  attribution: formatAttribution(metric.name, metric.attribution),
});

// Ensure only a single "page-load" analytic event is sent per page even if reportWebVitals
// is invoked multiple times.
let pageLoadSentGlobal = false;

/**
 * Reports web vitals metrics to analytics.
 * The web-vitals library uses the buffered flag for PerformanceObserver,
 * allowing it to access performance entries that occurred before the library was loaded.
 * This means you do not need to load this library early in order to get accurate performance data.
 * In general, this library should be deferred until after other user-impacting code has loaded.
 */
export const reportWebVitals = (options?: {
  meta?: {
    [key: string]: boolean | number | string | null | undefined;
  };
}) => {
  // Allow runtime kill-switch via Dynamic Config.
  if (!dangerouslyGetDynamicConfigSync('trello_web_enable_web_vitals')) {
    return;
  }

  // A stable ID that links the "page-load" and "continuous" events.
  const traceId = Analytics.get128BitTraceId();

  // For now, we emit three different analytics events:
  //   - "page-load"  - sent when the initial page load metrics (FCP/LCP/TTFB) are available.
  //   - "continuous" - sent when the continuous metrics (INP or CLS, respectively) are available.
  let pageLoadSent = pageLoadSentGlobal;

  // https://web.dev/lcp
  // The Largest Contentful Paint (LCP) metric reports the render time of the largest image
  // or text block visible within the viewport, relative to when the page first started loading.
  let largestContentfulPaint: LCPMetricWithAttribution;

  // https://web.dev/fcp
  // The First Contentful Paint (FCP) metric measures the time from when the page starts loading
  // to when any part of the page's content is rendered on the screen. For this metric, "content"
  // refers to text, images (including background images), <svg> elements, or non-white <canvas> elements.
  let firstContentfulPaint: FCPMetricWithAttribution;

  // https://web.dev/ttfb
  // TTFB is a metric that measures the time between the request for a resource and when the
  // first byte of a response begins to arrive.
  let timeToFirstByte: TTFBMetricWithAttribution;

  let longTasks = 0;
  let totalLongTaskDuration = 0;
  let observer: PerformanceObserver | undefined;

  // Checks if we have all the data needed to send the page-load event.
  const hasPageLoadData = () =>
    !!largestContentfulPaint && !!firstContentfulPaint && !!timeToFirstByte;

  // Sends the page-load event *at most* once.
  function sendPageLoadEventIfReady() {
    if (pageLoadSent || !hasPageLoadData()) {
      return;
    }

    if (Cookies.get('display_web_vitals_in_console')) {
      // eslint-disable-next-line no-console
      console.log('Web Vitals: ', {
        longTasks,
        totalLongTaskDuration,
        largestContentfulPaint: formatMetric(largestContentfulPaint),
        firstContentfulPaint: formatMetric(firstContentfulPaint),
        timeToFirstByte: formatMetric(timeToFirstByte),
      });
    }

    const source = getScreenFromUrl();

    observer?.disconnect();

    Analytics.sendOperationalEvent({
      action: 'evaluated',
      actionSubject: 'web-vitals',
      source,
      attributes: {
        phase: 'page-load',
        traceId,
        meta: options?.meta,
        longTasks,
        totalLongTaskDuration,
        largestContentfulPaint: formatMetric(largestContentfulPaint),
        firstContentfulPaint: formatMetric(firstContentfulPaint),
        timeToFirstByte: formatMetric(timeToFirstByte),
        flags: Analytics.getFlags(),
        ...(window.performance?.memory
          ? {
              totalJSHeapSize: window.performance.memory.totalJSHeapSize,
              usedJSHeapSize: window.performance.memory.usedJSHeapSize,
              jsHeapSizeLimit: window.performance.memory.jsHeapSizeLimit,
            }
          : {}),
      },
    });

    pageLoadSent = true;
    pageLoadSentGlobal = true;

    const taskName = sourceToTask[source];

    if (isValidScreenForTask(taskName)) {
      const taskData = {
        taskName,
        source,
      };

      Analytics.taskSucceeded({
        ...taskData,
        traceId: Analytics.startTask(taskData),
        attributes: {
          duration: largestContentfulPaint.value,
          largestContentfulPaint: formatMetric(largestContentfulPaint),
        },
      });
    }
  }

  // https://web.dev/inp
  // INP measures the responsiveness of a page by calculating the time it takes for a user
  // to interact with a page after a previous interaction.
  function sendInpEvent(data: INPMetricWithAttribution) {
    if (Cookies.get('display_web_vitals_in_console')) {
      // eslint-disable-next-line no-console
      console.log('Web Vitals (INP): ', {
        interactionToNextPaint: formatMetric(data),
      });
    }

    Analytics.sendOperationalEvent({
      action: 'evaluated',
      actionSubject: 'web-vitals',
      source: getScreenFromUrl(),
      attributes: {
        phase: 'continuous',
        metric: 'INP',
        traceId,
        meta: options?.meta,
        interactionToNextPaint: formatMetric(data),
        flags: Analytics.getFlags(),
      },
    });
  }

  // https://web.dev/cls
  // CLS is a measure of the largest burst of layout shift scores
  // for every unexpected layout shift that occurs during the entire lifespan of a page.
  function sendClsEvent(data: CLSMetricWithAttribution) {
    if (Cookies.get('display_web_vitals_in_console')) {
      // eslint-disable-next-line no-console
      console.log('Web Vitals (CLS): ', {
        cumulativeLayoutShift: formatMetric(data),
      });
    }

    Analytics.sendOperationalEvent({
      action: 'evaluated',
      actionSubject: 'web-vitals',
      source: getScreenFromUrl(),
      attributes: {
        phase: 'continuous',
        metric: 'CLS',
        traceId,
        meta: options?.meta,
        cumulativeLayoutShift: formatMetric(data),
        flags: Analytics.getFlags(),
      },
    });
  }

  try {
    observer = new window.PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        longTasks++;
        totalLongTaskDuration += entry.duration;
      });
    });

    observer.observe({ type: 'longtask', buffered: true });

    onLCP((data) => {
      largestContentfulPaint = data;
      sendPageLoadEventIfReady();
    });

    onTTFB((data) => {
      timeToFirstByte = data;
      sendPageLoadEventIfReady();
    });

    onFCP((data) => {
      firstContentfulPaint = data;
      sendPageLoadEventIfReady();
    });

    onINP(sendInpEvent, {
      reportAllChanges: true,
      // Default is 40ms. Values less than threshold are not reported.
      // This could be a configuration option.
      durationThreshold: INP_DURATION_THRESHOLD,
    });

    onCLS(sendClsEvent, {
      reportAllChanges: true,
    });
  } catch (err) {
    // no browser support probably. Ignore
  }
};
