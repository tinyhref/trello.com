export type SubscriptionError = 'forbidden' | 'not found' | 'unauthorized';

export type Tags = 'allActions' | 'clientActions' | 'updates';

export interface Subscription {
  modelType: 'Board' | 'Enterprise' | 'Member' | 'Organization';
  idModel: string;
  tags: Tags[];
}

export interface MemberSubscription extends Subscription {
  modelType: 'Member';
  tags: 'updates'[];
}

export interface BoardSubscription extends Subscription {
  modelType: 'Board';
  tags: ('clientActions' | 'updates')[];
}

export interface OrganizationSubscription extends Subscription {
  modelType: 'Organization';
  tags: ('allActions' | 'updates')[];
}

export interface EnterpriseSubscription extends Subscription {
  modelType: 'Enterprise';
  tags: ('allActions' | 'updates')[];
}

// From https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
export const WebSocketReadyState = {
  Connecting: 0,
  Open: 1,
  Closing: 2,
  Closed: 3,
} as const;
