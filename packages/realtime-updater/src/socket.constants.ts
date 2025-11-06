import type { SubscriptionError } from './socket.types';

export const INVALID_MODEL_ERRORS: SubscriptionError[] = [
  'unauthorized',
  'forbidden',
  'not found',
];

export const SupportedSubscriptionChannels = [
  'Board',
  'Member',
  'Organization',
] as const;
