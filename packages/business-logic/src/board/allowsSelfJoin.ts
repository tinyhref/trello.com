import type { Board, TrelloBoardPrefs } from '@trello/model-types';

export const allowsSelfJoin = (board: {
  prefs?:
    | Pick<Partial<Board['prefs']>, 'isTemplate' | 'selfJoin'>
    | Pick<TrelloBoardPrefs, 'isTemplate' | 'selfJoin'>
    | null;
}) => {
  return (board.prefs?.selfJoin ?? false) && !board.prefs?.isTemplate;
};
