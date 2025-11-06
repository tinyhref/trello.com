import { setMemberId } from '@trello/authentication';
import { Cookies } from '@trello/cookies';

const cookieName = 'token';
const defaultPort = '3000';

export let token: string | null;

export const detectDuplicateCookies = (name: string): number => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts.length - 1;
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return (
    Cookies.get(cookieName) ||
    Cookies.get(`${cookieName}${window.location.port}`) ||
    Cookies.get(`${cookieName}${defaultPort}`) ||
    null
  );
};

export const clearCookie = (): void => {
  setMemberId(null);
  token = null;
  Cookies.remove(cookieName, { path: '/' });
};

token = getToken();
