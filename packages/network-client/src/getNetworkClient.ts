import { TrelloNetworkClient } from './TrelloNetworkClient';

let networkClient: TrelloNetworkClient;

export const getNetworkClient = () => {
  if (!networkClient) {
    networkClient = new TrelloNetworkClient();
  }

  return networkClient;
};
