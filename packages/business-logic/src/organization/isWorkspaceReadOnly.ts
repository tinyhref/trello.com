import { Entitlements } from '@trello/entitlements';
import type { LimitStatus, Organization } from '@trello/model-types';

export const isWorkspaceReadOnly = (
  offering: Organization['offering'] | undefined,
  status: LimitStatus | undefined,
): boolean => {
  const isWorkspaceFree = Entitlements.isFree(offering);
  const isOverLimit = status === 'maxExceeded';

  return isWorkspaceFree && isOverLimit;
};
