interface Limits {
  [key: string]: {
    value: number; // number of a items allowed before reaching limit
    within: number; // time frame to limit
  };
}

/**
 * Class for configuring rate limiting.
 * For instance:
 * const rateLimiter = new RateLimiter({
 *  limits: {
 *    fiveMinute: {
 *      value: 100,
 *      within: 5 * 60 * 1000
 *    }
 *  },
 * });
 * This rateLimiter would allow 100 items within a 5 minute window.
 * You can configure more than 1 type of rate limit by defining more keys.
 * Add items as you go using rateLimiter.addItem and rateLimiter.removeItem.
 */
export class RateLimiter<TLimits extends Limits> {
  limits: TLimits;
  items: Date[];

  constructor(config: { limits: TLimits }) {
    this.limits = config.limits;
    this.items = [];
  }

  reset() {
    this.items = [];
  }

  addItem() {
    this.items = this.items.concat([new Date()]);
  }

  removeItem() {
    this.items = this.items.slice(0, this.items.length - 1);
  }

  /**
   * Get the number of items for a given range.
   * Eg getAttemptsWithin([Date.now() - 1000, Date.now()]) gets the items
   * made in the last 1000 ms.
   * @param range [Time, Time]
   * @returns number of items in range
   */
  getAttemptsWithin(range: number[]) {
    const [lower, upper] = range;
    return this.items.filter(
      (date) => date.getTime() >= lower && date.getTime() <= upper,
    ).length;
  }

  /**
   * Get the number of items in your window based on your configuration.
   * E.g. getAttemptsForWindow('fiveMinutes') with a configuration of:
   * const rateLimiter = new RateLimiter({
   *  limits: {
   *    fiveMinute: {
   *      value: 100,
   *      within: 5 * 60 * 1000
   *    }
   *  },
   * });
   * @param key defined key in your configuration for the rate limiter
   * @returns number of items in range
   */
  getAttemptsForWindow(key: keyof TLimits) {
    const limit = this.limits[key];
    return this.getAttemptsWithin([Date.now() - limit.within, Date.now()]);
  }

  /**
   * Whether or not the limit has been reached
   * @param key defined key in your configuration for the rate limiter
   * @returns true or false
   */
  hasReachedLimit(key: keyof TLimits) {
    const limit = this.limits[key];
    return this.getAttemptsForWindow(key) >= limit.value;
  }

  /**
   * Get total number of items across all configuration keys
   */
  getTotalCount() {
    return this.items.length;
  }
}
