import { Cookies } from '@trello/cookies';

const cookieName = 'aaId';

export let aaId: string | null;

export const getAaIdFromCookie = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return Cookies.get(cookieName) || null;
};

export const getAaId = (): string | null => {
  return aaId || null;
};

export const setAaId = (id: string | null): void => {
  aaId = id;

  if (id) {
    Cookies.set(cookieName, id, {}, 'necessary');
  } else {
    Cookies.remove(cookieName);
  }
};

aaId = getAaIdFromCookie();
