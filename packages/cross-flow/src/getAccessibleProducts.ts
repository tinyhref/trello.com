import { getApiGatewayUrl } from '@trello/api-gateway';
import { Analytics } from '@trello/atlassian-analytics';
import { clientVersion } from '@trello/config';
import { getErrorTextFromFetchResponse } from '@trello/error-handling';
import { sendErrorEvent, sendNetworkErrorEvent } from '@trello/error-reporting';

import {
  cacheAccessibleProducts,
  getCachedAccessibleProducts,
} from './getCachedAccessibleProducts';

type IDPAFPermissionIdType =
  | 'add-products'
  | 'external-collaborator-write'
  | 'invite-users'
  | 'manage'
  | 'write';

interface Workspace {
  cloudId?: string;
  cloudUrl?: string;
  workspaceAri: string;
  workspacePermissionIds: IDPAFPermissionIdType[];
  workspaceUrl: string;
  workspaceDisplayName: string;
  workspaceAvatarUrl: string;
  orgId: string;
}

interface Product {
  productId: string;
  productDisplayName: string;
  workspaces: Workspace[];
}

const productIds = [
  'confluence.ondemand',
  'jira-software.ondemand',
  'jira-servicedesk.ondemand',
  'jira-core.ondemand',
  'opsgenie',
  'trello',
  'bitbucket',
  'statuspage',
  'compass',
  'jira-product-discovery',
  'beacon',
  'atlassian-analytics-free',
  'mercury',
  'unified-help',
];

export interface AccessibleProductsResponse {
  products: Product[];
}

export const getAccessibleProductsUrl = () =>
  getApiGatewayUrl('/v2/accessible-products');

export const getAccessibleProducts =
  async (): Promise<AccessibleProductsResponse> => {
    try {
      const cachedAccessibleProducts = getCachedAccessibleProducts();
      if (cachedAccessibleProducts !== null) {
        return Promise.resolve({ products: cachedAccessibleProducts });
      }
      const url = getAccessibleProductsUrl();
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-Trello-Client-Version': clientVersion,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productIds }),
      });
      if (response.ok) {
        Analytics.sendOperationalEvent({
          action: 'fetched',
          actionSubject: 'fetchAccessibleProducts',
          source: 'crossFlowEssentials',
        });
        const resolvedResponse = await response.json();
        cacheAccessibleProducts(resolvedResponse.data);
        return Promise.resolve(resolvedResponse.data);
      } else {
        sendNetworkErrorEvent({
          status: response.status,
          response: await getErrorTextFromFetchResponse(response),
          url,
          operationName: 'getAccessibleProducts',
        });
      }

      return { products: [] };
    } catch (error) {
      sendErrorEvent(error, {
        tags: {
          ownershipArea: 'trello-ghost',
          feature: 'Atlassian Switcher',
        },
      });

      return { products: [] };
    }
  };
