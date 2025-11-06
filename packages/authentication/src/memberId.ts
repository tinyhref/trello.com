import { Cookies } from '@trello/cookies';

const cookieName = 'idMember';

export let memberId: string | null;

export const getMemberIdFromCookie = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return Cookies.get(cookieName) || null;
};

export const getMemberId = (): string | null => {
  return memberId || null;
};

export const setMemberId = (id: string | null): void => {
  memberId = id;

  if (id) {
    Cookies.set(cookieName, id, {}, 'necessary');
  } else {
    Cookies.remove(cookieName);
  }
};

memberId = getMemberIdFromCookie();
