import { environment } from '@trello/config';
import { monitor } from '@trello/monitor';

const BASE_REFRESH_INTERVAL_IN_MS_STG = 60_000; // 60 seconds (the endpoint proxy only fetches at most every 60 seconds)
const BASE_REFRESH_INTERVAL_IN_MS_PROD = 300_000; // 300 seconds = 5 mins

const INACTIVE_REFRESH_POLLING_FACTOR = 12; // decreased polling rate for hidden/inactive tabs

/**
 * A generic poller
 *
 * It will execute the given promise at the set interval, and increase the interval if there are errors.
 */
export class Poller {
  private intervalId: NodeJS.Timeout | undefined;
  private currentInterval: number;
  private maxInterval: number;
  private backoffFactor: number;
  private pollFunction: () => Promise<void>;
  private basePollingIntervalsMs: {
    staging: number;
    prod: number;
  };

  constructor(
    pollFunction: () => Promise<void>,
    basePollingIntervalsMs?: {
      staging: number;
      prod: number;
    },
  ) {
    this.pollFunction = pollFunction;
    this.basePollingIntervalsMs = basePollingIntervalsMs ?? {
      staging: BASE_REFRESH_INTERVAL_IN_MS_STG,
      prod: BASE_REFRESH_INTERVAL_IN_MS_PROD,
    };
    this.currentInterval = this.calculateInterval();
    this.maxInterval = this.currentInterval * 10;
    this.backoffFactor = 2;
  }

  /**
   * Start the polling.
   */
  start = (): void => {
    this.intervalId = setTimeout(() => this.poll(), 0);
  };

  /**
   * Stops the polling.
   */
  stop = (): void => {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = undefined;
    }
  };

  /**
   * Get the current polling interval.
   *
   * @returns number: The current polling interval in milliseconds.
   */
  getCurrentInterval = (): number => {
    return this.currentInterval;
  };

  /**
   * Check if the polling is active.
   *
   * @returns boolean: Whether the polling is active.
   */
  isPolling = (): boolean => {
    return !!this.intervalId;
  };

  private poll = async (): Promise<void> => {
    try {
      await this.pollFunction();
      this.currentInterval = this.calculateInterval(); // Reset interval on success
    } catch (error) {
      if (environment !== 'prod') {
        console.error('Polling error:', error);
      }
      // Increase interval on error
      this.currentInterval = Math.min(
        this.currentInterval * this.backoffFactor,
        this.maxInterval,
      );
    }

    this.intervalId = setTimeout(() => this.poll(), this.currentInterval);
  };

  /**
   * Calculate the polling interval based on the whether the client is on prod or staging
   * and the user is active or not.
   *
   * @returns The resulting polling interval in milliseconds.
   */
  private calculateInterval = (): number => {
    const status = monitor.getStatus();
    const baseInterval =
      environment === 'prod'
        ? this.basePollingIntervalsMs.prod
        : this.basePollingIntervalsMs.staging;
    return status === 'active'
      ? baseInterval
      : baseInterval * INACTIVE_REFRESH_POLLING_FACTOR;
  };
}
