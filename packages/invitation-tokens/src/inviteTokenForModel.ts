import { Cookies } from '@trello/cookies';

export const inviteTokenForModel = (idModel: string): string | null => {
  return Cookies.get(`invite-token-${idModel}`) || null;
};
