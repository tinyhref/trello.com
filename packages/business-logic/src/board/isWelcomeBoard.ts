import { getMemberId } from '@trello/authentication';
import { idToDate } from '@trello/dates';

export const isWelcomeBoard = (board: {
  id: string;
  creationMethod?: 'ai' | 'assisted' | 'automatic' | 'demo' | null;
}) => {
  const delta =
    idToDate(board.id).getTime() - idToDate(getMemberId() ?? '').getTime();

  return board.creationMethod === 'demo' || (0 <= delta && delta < 1000);
};
