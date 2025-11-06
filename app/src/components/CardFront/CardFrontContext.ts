import type { RefObject } from 'react';
import { createContext } from 'react';

import type { CardType } from 'app/src/components/CardType';
import { noop } from 'app/src/noop';
import type { CardFrontSource } from './CardFront';

export interface CardFrontContextValue {
  cardType: CardType;
  cardFrontRef: RefObject<HTMLDivElement>;
  editButtonRef: RefObject<HTMLButtonElement>;
  showBoardInfo: boolean;
  openQuickCardEditorOverlay: () => void;
  openCardBackDialog: (cardId: string) => Promise<void>;
  cardFrontSource?: CardFrontSource;
  plannerEventCardId?: string;
}

export const emptyCardFrontContext: CardFrontContextValue = {
  cardType: 'default',
  cardFrontRef: { current: null },
  editButtonRef: { current: null },
  showBoardInfo: false,
  openQuickCardEditorOverlay: noop,
  openCardBackDialog: () => Promise.resolve(),
};

/**
 * Context used to provide access to stable references throughout various
 * CardFront component types. Do not add more variables to this context unless
 * you know what you're doing, as it's crucial for this to be a stable render.
 */
export const CardFrontContext = createContext<CardFrontContextValue>(
  emptyCardFrontContext,
);
