import { environment } from '@trello/config';

import { dynamicConfigClient as mockedDynamicConfigClient } from '../__mocks__';
import { DynamicConfigClient } from './dynamicConfigClient';

/**
 * Create the singleton dynamic config client, or mocked client for tests.
 */
const createDynamicConfigClient = () => {
  // 'test' does not exist on the type, but it's valid in the webpack config
  // @ts-expect-error TS2339: Property 'test' does not exist on type '"branch" | "dev" | "local" | "prod" | "staging"'.
  return environment === 'test' && typeof jest !== 'undefined'
    ? mockedDynamicConfigClient
    : new DynamicConfigClient();
};

export const dynamicConfigClient = createDynamicConfigClient();
