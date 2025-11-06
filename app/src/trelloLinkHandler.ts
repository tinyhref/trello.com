import type { MouseEvent as ReactMouseEvent } from 'react';

import { siteDomain } from '@trello/config';
import { navigate } from '@trello/router/navigate';

import { currentModelManager } from 'app/scripts/controller/currentModelManager';
import { ModelCache } from 'app/scripts/db/ModelCache';
import { isWebClientPage } from 'app/src/isWebClientPage';

export const navigatesOffBoard = (urlTarget: string) => {
  const currentBoard = currentModelManager.getCurrentBoard();

  // If we're not on a board right now, don't worry about navigating
  // off of it
  if (!currentBoard) {
    return false;
  }

  // If we're not a relative URL for a card or board, then we can't be on
  // the same board
  const parts = new RegExp(`^([bc])/([^/]+)`).exec(urlTarget);

  if (!parts) {
    return true;
  }

  const [, modelLetter, shortLink] = parts;

  switch (modelLetter) {
    case 'b':
      return shortLink !== currentBoard.get('shortLink');
    case 'c':
      return (
        ModelCache.get('Card', shortLink)?.getBoard().get('id') !==
        currentBoard.get('id')
      );
    default:
      return true;
  }
};

export const trelloLinkHandler = (
  e: MouseEvent | ReactMouseEvent,
  linkElem: HTMLAnchorElement,
) => {
  if (!linkElem || linkElem.type === 'a') return;

  const href = linkElem.href;
  const target = linkElem.target;

  const targetUrl = href
    ?.replace(new RegExp(`^${siteDomain}`), '')
    ?.replace(new RegExp(`^/(?=.)`), '');

  // location.pathname has a leading "/"; targetUrl does not
  const isNewUrl = targetUrl !== location.pathname.slice(1);

  // In cases where we're framed, we want to intercept navigation to other parts
  // of Trello, and open those in new windows
  if (window !== window.top && navigatesOffBoard(targetUrl)) {
    e?.preventDefault();
    window.open(targetUrl);
    return;
  }

  // If the page is just a virtual route served by the controller, we don't
  // need to reload the page. Unless it has target="_blank", because when
  // you "attach" a Trello card to another card you get an "open in a new
  // tab" link that we don't want to intercept.
  if (href && isWebClientPage(href) && !target) {
    e?.preventDefault();
    if (isNewUrl && targetUrl) {
      navigate(targetUrl, { trigger: true });
    }
  }
};
