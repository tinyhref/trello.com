import type { RefObject } from 'react';
import { createContext } from 'use-context-selector';

import type { CardType } from 'app/src/components/CardType';
import { noop } from 'app/src/noop';

export interface CardBackContextValue {
  /**
   * The card type.
   * @default 'default'
   */
  cardType: CardType;
  /**
   * The parent element of the card back, used for operations like
   * drag-and-drop.
   */
  dialogRef: RefObject<HTMLElement>;
  /**
   * Callback for dismissing the card back dialog.
   */
  dismissCardBackDialog: () => void;
  /**
   * Whether the card is opened from the source board.
   * When this is false, the card back should include more information about the
   * source board (e.g. disclaimers for mirror cards).
   * @default true
   */
  isOpenedFromSourceBoard: boolean;
  /**
   * Callback for navigating between open card backs, e.g. via arrow keys.
   */
  openCardBackDialog: (cardId: string) => void;

  /**
   * Don't use this, this is temporary for a quick mirror card fix
   */
  dangerous_mirrorCardId?: string;
  /**
   * Whether the card is opened from the inbox board. Only use this prop to
   * check if "mirror cards" are opened from the inbox board.
   * @default false
   */
  isInboxBoard?: boolean;
}

export const initialCardBackContextValue: CardBackContextValue = {
  cardType: 'default',
  dialogRef: { current: null },
  dismissCardBackDialog: noop,
  isOpenedFromSourceBoard: true,
  openCardBackDialog: noop,
  dangerous_mirrorCardId: undefined,
  isInboxBoard: undefined,
};

export const CardBackContext = createContext<CardBackContextValue>(
  initialCardBackContextValue,
);
