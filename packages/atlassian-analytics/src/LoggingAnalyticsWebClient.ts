import type {
  ProductInfoType,
  SettingsType,
} from '@atlassiansox/analytics-web-client';
import AnalyticsWebClient from '@atlassiansox/analytics-web-client';

/**
 * A version of the Analytics client that does not actually send
 * events, instead logging them to the console.
 *
 * This is useful where:
 * 1. we want to listen for analytics events without waiting for
 *    batch requests to be sent
 * 2. we don't care to actually send analytics events
 *
 * Note that this class only overrides public methods on
 * {@link AnalyticsWebClient} and does not prevent the client from
 * otherwise making outbound requests to its configured endpoint(s).
 */
export class LoggingAnalyticsWebClient extends AnalyticsWebClient {
  private async logEvent(e: unknown, callback?: unknown): Promise<void> {
    // eslint-disable-next-line no-console
    console.log(e);
    if (typeof callback === 'function') {
      callback();
    }
  }

  constructor(productInfo: ProductInfoType, settings?: SettingsType) {
    super(productInfo, settings);

    this.sendOperationalEvent = this.logEvent;
    this.sendPageEvent = this.logEvent;
    this.sendScreenEvent = this.logEvent;
    this.sendTrackEvent = this.logEvent;
    this.sendUIEvent = this.logEvent;
  }
}
