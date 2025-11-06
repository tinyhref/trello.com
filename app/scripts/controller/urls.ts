/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from 'underscore';

import { isShortId } from '@trello/id-cache';
import { getMemberCardsUrl, makeSlug } from '@trello/urls';

import { ModelCache } from 'app/scripts/db/ModelCache';
import { Util } from 'app/scripts/lib/util';
import type { Board } from '../models/Board';
import type { Card } from '../models/Card';
import type { NarrowModel } from '../models/internal/TrelloModel';
import type { Organization } from '../models/Organization';

const getOrganizationName = function (org: Organization | string) {
  if (_.isString(org)) {
    return org;
  } else {
    return org.get('name');
  }
};

/** @deprecated Use equivalent export from `@trello/urls` instead. */
const getOrganizationUrl = (org: Organization | string | undefined) =>
  org ? `/w/${getOrganizationName(org)}` : '';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _orgUrl = function (org: any, path: any, options?: any) {
  if (options == null) {
    options = {};
  }
  const query = options.returnUrl
    ? `?returnUrl=${encodeURIComponent(options.returnUrl)}`
    : '';
  return `${getOrganizationUrl(org)}${path}${query}`;
};

export const getEnterpriseAdminDashboardUrl = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  enterpriseOrName: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tab: any,
) => {
  const name = _.isString(enterpriseOrName)
    ? enterpriseOrName
    : enterpriseOrName.get('name');
  if (tab != null) {
    return `/e/${name}/admin/${tab}`;
  } else {
    return `/e/${name}/admin`;
  }
};

export const getEnterprisePendingWorkspaceUrl = (ent: string) =>
  getEnterpriseAdminDashboardUrl(ent, 'workspaces/pending');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getOrganizationMemberCardsUrl = (org: any, username: any) => {
  return getMemberCardsUrl(username, getOrganizationName(org));
};

/** @deprecated Use equivalent export from `@trello/urls` instead. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getOrganizationHomeUrl = (org: any) => {
  return _orgUrl(org, '/home');
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getBoardUrl = (idBoard: any, section?: any, extra?: any) => {
  // Dependency required at call site to avoid import cycles, do not lift to top of module
  let baseUrl;
  if (extra == null) {
    extra = [];
  }
  if ((idBoard != null ? idBoard.id : undefined) != null) {
    idBoard = idBoard.id;
  }

  const board: NarrowModel<Board, 'name' | 'url'> = ModelCache.get(
    'Board',
    idBoard,
  )!;

  if (board?.get('url')) {
    baseUrl = Util.relativeUrl(board.get('url'));
  } else {
    const name = board?.get('name');

    baseUrl = name
      ? `/board/${makeSlug(name)}/${idBoard}`
      : `/board/${idBoard}`;
  }

  if (section) {
    baseUrl += `/${section}`;
  }

  for (const part of Array.from(extra)) {
    baseUrl += `/${part}`;
  }

  return baseUrl;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getBoardShortUrl = (idBoard: any, section?: any) => {
  let baseUrl, shortUrl;

  if ((idBoard != null ? idBoard.id : undefined) != null) {
    idBoard = idBoard.id;
  }

  const board = ModelCache.get('Board', idBoard);

  if ((shortUrl = board != null ? board.get('shortUrl') : undefined) != null) {
    baseUrl = Util.relativeUrl(shortUrl);
  } else {
    const shortLink = board != null ? board.get('shortLink') : undefined;

    baseUrl = `/b/${shortLink}`;
  }

  if (section) {
    baseUrl += `/${section}`;
  }

  return baseUrl;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getBoardUrlFromShortLink = (shortLink: any, boardName?: any) => {
  return boardName
    ? `/b/${shortLink}/${makeSlug(boardName)}`
    : `/b/${shortLink}`;
};

/** @deprecated Use equivalent export from `@trello/urls` instead. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getTeamOnboardingUrl = (org: any) => {
  return _orgUrl(org, '/getting-started');
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getMemberBoardProfileUrl = (username: any, idBoard: any) => {
  return [getBoardUrl(idBoard), 'member', username].join('/');
};

export const getCardUrl = (
  card: Card,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  highlight?: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  replyToComment?: any,
) => {
  const baseUrl = (() => {
    let url;
    if ((url = card.get('url')) != null) {
      return Util.relativeUrl(url);
    } else {
      let left;
      const idBoard = card.get('idBoard');
      const idCard = (left = card.get('idShort')) != null ? left : card.id;
      const card_name = card.get('name');

      if (idCard == null) {
        return null;
      } else if (isShortId(idCard)) {
        return `/card/${makeSlug(card_name)}/${idBoard}/${idCard}`;
      } else {
        return `/card/board/${makeSlug(card_name)}/${idBoard}/${idCard}`;
      }
    }
  })();

  if (replyToComment) {
    return [baseUrl, `replyToComment=${replyToComment}`].join('?');
  } else if (highlight) {
    return [baseUrl, highlight].join('#');
  } else {
    return baseUrl;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getBoardInvitationLinkUrl = (board: any, secret: any) => {
  return `/invite/b/${board.get('shortLink')}/${secret}/${makeSlug(
    board.get('name'),
  )}`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getOrganizationInvitationLinkUrl = (org: any, secret: any) => {
  return `/invite/${org.get('name')}/${secret}`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getWorkspaceViewUrl = ({ shortLink, name }: any) => {
  return name ? `/v/${shortLink}/${makeSlug(name)}` : `/v/${shortLink}`;
};
