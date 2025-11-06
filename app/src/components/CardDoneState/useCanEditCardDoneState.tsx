import { useBoardPermissions } from '@trello/business-logic-react/board';

/**
 * Return true if the member can edit the card done state
 *
 * @remarks
 * This hook checks if the user has edit permissions for the board, and if the board is not closed or readonly.
 * It also checks if the source is 'Planner', in which case the user can always edit the card done state.
 *
 * @param boardId - The ID of the board
 * @param memberId - The ID of the member
 * @param source - The source using the card done state
 * @returns true if the user can edit the card done state, false otherwise
 *
 */

export const useCanEditCardDoneState = (boardId: string, memberId: string) => {
  const { canEdit } = useBoardPermissions({ boardId });
  const canEditCard = canEdit(memberId);

  return Boolean(canEditCard);
};
