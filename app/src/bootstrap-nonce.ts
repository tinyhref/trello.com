import type { TrelloWindow } from '@trello/window-types';

declare const window: TrelloWindow;
// This line fails inconsistently on type-checking.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const nonce: string = (__webpack_nonce__ = window.__webpack_nonce__);

export { nonce };
