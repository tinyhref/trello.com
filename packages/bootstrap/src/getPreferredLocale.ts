import { getDefaultLocale } from './getDefaultLocale';
import { getSupportedLocales } from './getSupportedLocales';

function getCookie(name: string) {
  const value = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split('=')?.[1];

  if (!value) {
    return;
  }

  return decodeURIComponent(value);
}

/**
 * Gets Member locale from local storage
 * Uses window.localStorage directly instead of @trello/storage to avoid added
 * dependencies to bootstrap
 */
function getMemberPrefFromLocalStorage(memberId: string) {
  try {
    // eslint-disable-next-line no-restricted-syntax
    const localStorageValue = window.localStorage.getItem(`locale-${memberId}`);
    const memberPref = localStorageValue ? JSON.parse(localStorageValue) : null;
    return memberPref;
  } catch (e) {
    // Return null if localStorage is inaccessible
    return null;
  }
}

export function getPreferredLocale() {
  const langOverride = getCookie('langOverride');

  if (langOverride && getSupportedLocales().includes(langOverride)) {
    return langOverride;
  }

  const memberId = getCookie('idMember');

  if (!memberId) {
    return getDefaultLocale();
  }

  const memberPref = getMemberPrefFromLocalStorage(memberId);

  if (memberPref && getSupportedLocales().includes(memberPref)) {
    return memberPref;
  }

  return getDefaultLocale();
}
