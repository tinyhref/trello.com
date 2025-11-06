import { Cookies } from '@trello/cookies';

export const getInvitationCookie = () => Cookies.get('invitation') || null;

export const getReferrerCookie = () => Cookies.get('referrer') || null;

export type InviteModelType = 'board' | 'organization';

export interface InvitationCookieData {
  type?: InviteModelType;
  orgOrBoardId?: string;
  secret?: string;
}

export const getInvitationCookieData = (): InvitationCookieData => {
  const invitationData = getInvitationCookie();
  const [type, orgOrBoardId, secret] = invitationData
    ? invitationData.split(':')
    : [];
  return { type: type as InviteModelType, orgOrBoardId, secret };
};
