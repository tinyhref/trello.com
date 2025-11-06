import { sendErrorEvent } from '@trello/error-reporting';
import { TrelloStorage } from '@trello/storage';

import { getJiraInvitePermissionsStorageKey } from './getJiraInvitePermissionsStorageKey';

const DAY_IN_MS = 86_400_000;

interface JiraInvitePermissionsStorage {
  canInvite: boolean;
  hasDomainRestrictions: boolean;
}

export const getCachedInvitePermissions = (
  idCloud: string,
): JiraInvitePermissionsStorage | null => {
  const TIMESTAMP_EXPIRATION_DURATION_IN_MS = DAY_IN_MS * 7;
  try {
    const cacheKey = getJiraInvitePermissionsStorageKey(idCloud);
    const jiraInvitePermissionsStorage = TrelloStorage.get(cacheKey);

    if (!jiraInvitePermissionsStorage) {
      return null;
    } else if (typeof jiraInvitePermissionsStorage.timestamp !== 'number') {
      throw new Error('Unexpected localStorage timestamp type');
    }

    return jiraInvitePermissionsStorage.timestamp +
      TIMESTAMP_EXPIRATION_DURATION_IN_MS >=
      Date.now()
      ? {
          canInvite: jiraInvitePermissionsStorage?.data?.canInvite,
          hasDomainRestrictions:
            jiraInvitePermissionsStorage?.data?.hasDomainRestrictions,
        }
      : null;
  } catch (error) {
    sendErrorEvent(error, {
      tags: {
        ownershipArea: 'trello-ghost',
        feature: 'Invite to Jira',
      },
    });
    return null;
  }
};
