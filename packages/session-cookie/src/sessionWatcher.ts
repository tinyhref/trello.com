import { getMemberIdFromCookie } from '@trello/authentication';

let sessionWatchInterval: number = 0;

let memberId: string | null = null;

/*
 * After the POST /logout returned (erasing your cookie, with a 303), it started
 * a race between the redirect loading (/logged-out) and the cookie change
 * checker noticing that your cookie disappeared and doing a refresh. If it
 * looks like we're trying to change pages, just stop checking for a cookie
 * change.
 */
const beforeUnloadListener = (): void => {
  window.clearInterval(sessionWatchInterval);
};

export const stopSessionWatcher = (): void => {
  window.clearInterval(sessionWatchInterval);
  window.removeEventListener('beforeunload', beforeUnloadListener);
};

/*
 * Check to see if the idMember changes; if it does, then it means that they've
 * logged out in another window, or logged in as someone else, or cleared their
 * cookies or something, and any requests we make now might be unauthorized.
 */
export const startSessionWatcher = (): void => {
  memberId = getMemberIdFromCookie();

  const sessionWatcher = () => {
    const newMemberId = getMemberIdFromCookie();
    if (memberId !== newMemberId) {
      window.location.reload();
    }
  };

  window.clearInterval(sessionWatchInterval);
  sessionWatchInterval = window.setInterval(sessionWatcher, 3000);
  window.addEventListener('beforeunload', beforeUnloadListener);
};
