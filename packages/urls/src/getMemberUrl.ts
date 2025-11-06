import { getMemberId } from '@trello/authentication';
import type { PIIString } from '@trello/privacy';

// These were migrated from the untyped app/scripts/controller/urls.ts file,
// so we're treating all username inputs as optional just in case.
type Username = PIIString | string | null | undefined;

/**
 * All three of these options (username, member ID, or "me") should route to
 * member pages correctly, but we probably prefer this order.
 */
const getMemberUsernameOrId = (username?: Username): string =>
  // @ts-expect-error
  username || getMemberId() || 'me';

export const getMemberAccountUrl = (
  username?: Username,
  locationHash?: string,
) => `/u/${getMemberUsernameOrId(username)}/account${locationHash ?? ''}`;

export const getMemberActivityUrl = (username?: Username) =>
  `/u/${getMemberUsernameOrId(username)}/activity`;

export const getMemberBoardsUrl = (username?: Username) =>
  `/u/${getMemberUsernameOrId(username)}/boards`;

export const getMemberCardsUrl = (
  username?: Username,
  orgname?: string | null,
) => {
  if (orgname) {
    return `/u/${getMemberUsernameOrId(username)}/cards/${orgname}`;
  } else {
    return `/u/${getMemberUsernameOrId(username)}/cards`;
  }
};

export const getMemberProfileUrl = (username?: Username) =>
  `/u/${getMemberUsernameOrId(username)}`;

export const getMemberLabsUrl = (username?: Username) => {
  return `/u/${getMemberUsernameOrId(username)}/labs`;
};

export const getMemberAiSettingsUrl = (username?: Username) =>
  `/u/${getMemberUsernameOrId(username)}/ai-settings`;
