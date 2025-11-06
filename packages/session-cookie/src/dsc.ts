import { Cookies } from '@trello/cookies';

export const getDsc = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return Cookies.get('dsc') || null;
};
