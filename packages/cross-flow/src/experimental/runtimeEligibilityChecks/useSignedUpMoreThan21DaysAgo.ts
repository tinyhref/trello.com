import { useMemberId } from '@trello/authentication';
import { getDateBefore, idToDate } from '@trello/dates';

export const useSignedUpMoreThan21DaysAgo = () => {
  const memberId = useMemberId();

  const signedUpMoreThan21DaysAgo =
    idToDate(memberId) < getDateBefore({ days: 21 });

  return { signedUpMoreThan21DaysAgo };
};
