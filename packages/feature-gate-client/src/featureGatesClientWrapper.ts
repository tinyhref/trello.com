import type { CustomAttributes } from '@atlaskit/feature-gate-js-client';
import {
  FeatureGateEnvironment,
  PerimeterType,
} from '@atlaskit/feature-gate-js-client';
import type { FetcherOptions } from '@atlaskit/feature-gate-js-client/dist/types/client/fetcher';
import { Analytics } from '@trello/atlassian-analytics';
import { getAaId } from '@trello/authentication';
import { atlassianFeatureFlagClientKey, environment } from '@trello/config';

import { updateAllSharedStateFeatureGatesAndExperiments } from './state/updateAllSharedStateFeatureGatesAndExperiments';
import { isFetchCancellationError } from './isFetchCancellationError';

const expectedErrorPatterns = [
  /signal timedout/i,
  /NetworkError when attempting to fetch resource/i,
  /The operation timed out/i,
  /Load failed/i,
  /Network request failed/i,
  /request has been terminated/i,
  /aborted/i,
  /signal is aborted without reason/i,
  /The Internet connection appears to be offline./i,
];

const isExpectedError = (error: Error) =>
  isFetchCancellationError(error) ||
  expectedErrorPatterns.some(
    (pattern) =>
      typeof error.message === 'string' && pattern.test(error.message),
  );

export type FeatureGatesClientWrapperParams = {
  customAttributes: CustomAttributes;
  workspaceId: string | null;
};

export type InitParams = {
  fetchOptions: ReturnType<typeof getFetchOptions>;
  identifiers: ReturnType<typeof getIdentifiers>;
  customAttributes: CustomAttributes;
};

const getFeatureGateEnvironment = () => {
  let clientEnv = FeatureGateEnvironment.Development;
  if (environment === 'staging') {
    clientEnv = FeatureGateEnvironment.Staging;
  } else if (environment === 'prod') {
    clientEnv = FeatureGateEnvironment.Production;
  }
  return clientEnv;
};

const getFetchOptions: () => FetcherOptions = () => ({
  apiKey: atlassianFeatureFlagClientKey,
  environment: getFeatureGateEnvironment(),
  targetApp: 'trello_web',
  useGatewayURL: false,
  perimeter: PerimeterType.COMMERCIAL, // default to commercial until we need fedramp
});

const getIdentifiers = ({ workspaceId }: { workspaceId: string | null }) => ({
  trelloWorkspaceId: workspaceId || undefined,
  atlassianAccountId: getAaId() || undefined,
  analyticsAnonymousId:
    Analytics?.analytics?.getAnonymousId() ?? 'unidentified',
});

export const featureGatesClientWrapper =
  ({
    workspaceId,
    customAttributes,
    step,
  }: FeatureGatesClientWrapperParams & { step: 'init' | 'refresh' }) =>
  async (
    next: ({
      fetchOptions,
      identifiers,
    }: InitParams) => Promise<void> | undefined,
  ): Promise<void> => {
    const identifiers = getIdentifiers({ workspaceId });
    try {
      const fetchOptions = getFetchOptions();
      await next({
        fetchOptions,
        identifiers,
        customAttributes,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (!isExpectedError(error)) {
          Analytics.sendOperationalEvent({
            action: 'errored',
            actionSubject: 'featureGateClient',
            actionSubjectId:
              step === 'init'
                ? 'initFeatureGateClient'
                : 'refreshFeatureGatesClient',
            source: 'lib:featureGateClient',
            attributes: {
              identifiers,
              customAttributes,
              error: error.message,
            },
          });
        }
      }
    } finally {
      updateAllSharedStateFeatureGatesAndExperiments();
    }
  };
