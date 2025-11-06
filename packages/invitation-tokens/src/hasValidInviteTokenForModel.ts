import { inviteTokenForModel } from './inviteTokenForModel';

interface Model {
  id: string;
  members: {
    id: string;
    memberType: 'ghost' | 'normal';
  }[];
}

export const hasValidInviteTokenForModel = (model: Model): boolean => {
  const inviteToken = inviteTokenForModel(model.id);

  if (!inviteToken) {
    return false;
  }

  const memberIdFromToken = inviteToken.split('-')[0];
  const member = model.members.find(({ id }) => id === memberIdFromToken);

  if (!member) {
    return false;
  }

  return member.memberType === 'ghost';
};
