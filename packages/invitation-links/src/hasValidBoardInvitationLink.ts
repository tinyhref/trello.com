import { isMemberLoggedIn } from '@trello/authentication';

import {
  getInvitationCookie,
  getInvitationCookieData,
  getReferrerCookie,
} from './invitationLinkCookies';

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

export const hasValidBoardInvitationLink = (
  { id: boardId, shortLink: boardShortLink }: Board,
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
    type !== 'board' ||
    alreadyHasPermission
  ) {
    return false;
  }

  return orgOrBoardId === boardId || orgOrBoardId === boardShortLink;
};
