import { SharedState } from '@trello/shared-state';

interface CardComposerState {
  /**
   * When this is not null, we can infer that the card composer is open.
   */
  listId: string | null;
  /**
   * The active position for the card composer. Cards are rendered with position
   * in the list, and the card composer is meant to be opened in a single place
   * matching a target position.
   */
  position: number | null;
}

const defaultValue: CardComposerState = {
  listId: null,
  position: null,
};

/**
 * This state keeps track of whether the card composer is open, and if so,
 * where. The list card composer can be rendered in several different places
 * (above and below each card in each list), but is treated as a singleton that
 * can only be open in a single place at a time.
 */
export const cardComposerState = new SharedState<CardComposerState>(
  defaultValue,
);

/**
 * Open the card composer in a given position on a list.
 */
export const openCardComposer = (value: CardComposerState) => {
  cardComposerState.setValue(value);
};

export const closeCardComposer = ({
  closeMethod,
}: {
  closeMethod?: 'cancel' | 'click-outside' | 'escape' | 'submit';
} = {}) => {
  cardComposerState.setValue(defaultValue);
};
