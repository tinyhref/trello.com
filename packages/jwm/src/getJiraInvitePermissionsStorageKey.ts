import { getMemberId } from '@trello/authentication';

export const getJiraInvitePermissionsStorageKey = (
  cloudId: string,
): `inviteToJiraPermissions-${string}` =>
  `inviteToJiraPermissions-${getMemberId()}-${cloudId}`;
