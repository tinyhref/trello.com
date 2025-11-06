import { payloadPublisher } from '@atlassian/ufo';
import { Analytics } from '@trello/atlassian-analytics';
import { clientVersion } from '@trello/config';

/**
 * Set up the UFO publisher. `payloadPublisher` is an exported singleton that
 * hooks into our Analytics client to publish emitted performance metrics.
 *
 * Since this is a singleton, we should be careful to only initialize this once;
 * in the future if we have many different experiences that utilize UFO events,
 * we can consider running this step one time early in the stack, but for now,
 * import and call this close to your component when necessary.
 */
export const initializeUFOPublisher = () => {
  // Loose proxy for determining whether the payloadPublisher has already been
  // set up. If product is defined, no need to set up again.
  if (!payloadPublisher.product) {
    payloadPublisher.setup({
      product: 'trello',
      app: { version: { web: clientVersion } },
      gasv3: Analytics.dangerouslyGetAnalyticsWebClient(),
    });
  }
};
