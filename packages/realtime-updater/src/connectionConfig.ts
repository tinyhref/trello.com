export const connectionConfig = {
  /**
   * The base delay for polling, which gets used to exponentially backoff as consecutive errors occur.
   */
  getBasePollingDelay() {
    return 5000;
  },
  /**
   * The multipliers used for active vs idle users when calculating delay between polling requests.
   */
  getBasePollingMultipliers() {
    return { active: 1, idle: 4 };
  },
  /**
   * The maximum number of connection attempts that can be made (within the reconnect rate window) before the user will be rate limited.
   * If a user reaches 8 reconnection attempts within 3 minutes they will be rate limited. Rate limited users will be disconnected from
   * Trello (and shown a message). To reconnect they will need to reload the page.
   */
  getActiveReconnectRateLimit() {
    return 9;
  },
  /**
   * The maximum number of connection attempts that can be made (within the day) before the user will be blocked.
   * If a user reaches 100 reconnection attempts within 24 hours they will be rate limited. Rate limited users will be disconnected from
   * Trello (and shown a message). To reconnect they will need to reload the page.
   */
  getDailyReconnectLimit() {
    return 200;
  },
  /**
   * The time window (in ms) where reconnection attempts will be counted towards the rate limit. If a user reaches 8 reconnection attempts
   * within 3 minutes they will be rate limited. Rate limited users will be disconnected from Trello (and shown a message). To reconnect
   * they will need to reload the page.
   */
  getActiveReconnectRateWindow() {
    return 180000;
  },
  /**
   * The time window (in ms) where reconnection attempts will be counted towards the rate limit. If a user reaches 8 reconnection attempts
   * within 20 minutes they will be rate limited. Rate limited users will be disconnected from Trello (and shown a message). To reconnect
   * they will need to reload the page.
   */
  getIdleReconnectRateWindow() {
    return 1200000;
  },
  /**
   * The amount of time (in ms) that we will wait for pings from server before closing the socket due to Ping Timeout.
   */
  getClientPingTimeout() {
    return 24000;
  },
  /**
   * The amount of time (in ms) that we will wait for the websocket connection to be acknowledged by the server. If acknowledgement is not
   * received within 15 seconds, the connection attempt will be aborted.
   */
  getClientAcknowledgementTimeout() {
    return 15000;
  },
};
