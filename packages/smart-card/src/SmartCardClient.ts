import { CardClient } from '@atlaskit/link-provider';
import { getApiGatewayUrl } from '@trello/api-gateway';
import { SharedState } from '@trello/shared-state';

export type SmartCardClientResponse = Awaited<
  ReturnType<CardClient['fetchData']>
>;

interface CustomCardClient extends CardClient {
  isCached: (url: string) => boolean;
  authorizedProviders: SharedState<Set<string>>;
}

export class SmartCardClient extends CardClient implements CustomCardClient {
  public isCached = () => false;
  public authorizedProviders = new SharedState(new Set<string>());
}

let smartCardClient: CustomCardClient;

export const getSmartCardClient = () => {
  const envKey = undefined;
  const baseUrlOverride = getApiGatewayUrl();

  if (!smartCardClient) {
    smartCardClient = new SmartCardClient(envKey, baseUrlOverride);
  }

  return smartCardClient;
};
