import type { TracedError } from '@trello/atlassian-analytics';

import type { SentryErrorMetadata } from './sendErrorEvent';
import { sendErrorEvent } from './sendErrorEvent';

/**
 * Sends a crash metric (operational event) via our analytics client
 * and also sends the error along to our Sentry endpoint
 */
export const sendCrashEvent = async (
  error: TracedError,
  metadata: SentryErrorMetadata = {
    tags: {},
    extraData: {},
  },
) => sendErrorEvent(error, metadata, true);
