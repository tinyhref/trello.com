/* eslint-disable eqeqeq */
import { isMemberLoggedIn } from '@trello/authentication';
import { siteDomain } from '@trello/config';
import { dangerouslyConvertPrivacyString } from '@trello/privacy';
import { isMeAlias } from '@trello/urls';

import { Auth } from 'app/scripts/db/Auth';
import { ModelCache } from 'app/scripts/db/ModelCache';

export const isWebClientPage = function (url: string) {
  let possibleName;
  if (url.indexOf('/') !== 0 && url.indexOf(siteDomain + '/') !== 0) {
    return false;
  }

  url = url
    .replace(new RegExp(`^${siteDomain}`), '')
    .replace(new RegExp(`^/(?=.)`), '');

  // Drop the query or hash; those don't factor into whether a page is a
  // web client page or not
  url = url.replace(new RegExp(`[\\?\\#].*$`), '');

  if (new RegExp(`\\.[a-z]+$`, 'i').test(url)) {
    // client never handles any pages with extensions; probably an export
    return false;
  }

  if (new RegExp(`^[bceuw]/`).test(url)) {
    // client serves board, card, org, user, and workspace pages
    return true;
  }

  if (new RegExp(`^search(/|$)`).test(url)) {
    // client serves any searches
    return true;
  }

  if (new RegExp(`^templates(/|$)`).test(url)) {
    return true;
  }

  if (isMemberLoggedIn()) {
    if (
      new RegExp(
        `^${dangerouslyConvertPrivacyString(Auth.myUsername())}(/|$)`,
      ).test(url)
    ) {
      // client serves member pages
      return true;
    }
    if (url === '/') {
      // client serves the logged-in landing page (the boards page)
      return true;
    }
  }

  if (new RegExp(`^shortcuts(?:/overlay)?/?$`).test(url)) {
    return true;
  }
  if (new RegExp(`^create-first-board(/|$)`).test(url)) {
    return true;
  }
  if (new RegExp(`^get-app(/|$)`).test(url)) {
    return true;
  }

  // It might still be /username or /orgname ... or it might be a new
  // meta page like /awesome
  //
  // There's really no way to know, so check and see if we know about any
  // members or clients that have names matching the current route

  // We should aim to get rid of this code path. /username and /orgname were
  // replaced with /u/username and /e/orgname some time ago.
  if ((possibleName = new RegExp(`^[^/\\?\\#]+`).exec(url)?.[0]) != null) {
    // Handle aliases; it's unlikely that we'd actually have any links to these
    // but let's handle them just in case
    if (isMemberLoggedIn() && isMeAlias(possibleName)) {
      return true;
    }

    if (/^[a-z0-9_]{3,}$/.test(possibleName)) {
      if (ModelCache.some('Member', 'username', possibleName)) {
        return true;
      }
      if (ModelCache.some('Organization', 'name', possibleName)) {
        return true;
      }
    }
  }

  return false;
};
