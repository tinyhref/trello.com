import { getMemberId, isMemberLoggedIn } from '@trello/authentication';

interface MemberId {
  idMember: string;
}

export const getMemberProperty = (): MemberId | object => {
  // Only append the idMember property if there's a memberId.
  return isMemberLoggedIn() ? { idMember: getMemberId() } : {};
};
