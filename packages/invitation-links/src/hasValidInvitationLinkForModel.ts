import { isMemberLoggedIn } from '@trello/authentication';

import {
  getInvitationCookie,
  getInvitationCookieData,
  getReferrerCookie,
} from './invitationLinkCookies';

type InviteType = 'board' | 'organization';
type ViewPermState =
  | 'enterprise'
  | 'inviteToken'
  | 'member'
  | 'none'
  | 'observer'
  | 'org'
  | 'private'
  | 'public';

interface Board {
  id: string;
  shortLink: string;
}

interface Organization {
  id: string;
  name: string;
}

export const hasValidInvitationLinkForModel = (
  expectedType: InviteType,
  model: Board | Organization,
  viewPermState?: ViewPermState,
): boolean => {
  const referrer = getReferrerCookie();
  const invitation = getInvitationCookie();
  const { type, orgOrBoardId } = getInvitationCookieData();
  const alreadyHasPermission = viewPermState
    ? viewPermState !== 'none' && viewPermState !== 'public'
    : false;

  if (
    !isMemberLoggedIn() ||
    !referrer ||
    !invitation ||
    type !== expectedType ||
    alreadyHasPermission
  ) {
    return false;
  }

  if (expectedType === 'board') {
    return (
      orgOrBoardId === (model as Board).id ||
      orgOrBoardId === (model as Board).shortLink
    );
  }

  return (
    orgOrBoardId === (model as Organization).name ||
    orgOrBoardId === (model as Organization).id
  );
};
