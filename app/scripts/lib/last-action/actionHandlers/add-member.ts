import type { AddMember } from '@trello/action-history';
import { client } from '@trello/graphql';
import { forNamespace } from '@trello/legacy-i18n';
import { dangerouslyConvertPrivacyString } from '@trello/privacy';

import type { Trace } from '../ActionMapTypes';
import type { CardActionFragment } from '../CardActionFragment.generated';
import { CardActionFragmentDoc } from '../CardActionFragment.generated';
import { CardActionDocument } from '../CardActionMutation.generated';
import { MemberNameFragmentDoc } from '../MemberNameFragment.generated';
import { NoopError } from '../NoopError';
import { recordCardAction } from '../recordCardAction';

const format = forNamespace('notificationsGrouped', {
  shouldEscapeStrings: false,
});

export const addMember = (cardId: string, action: AddMember, trace: Trace) => {
  const memberId = action.idMember;
  const { traceId } = trace;

  const cardFragment = client.readFragment<CardActionFragment>({
    id: `Card:${cardId}`,
    fragment: CardActionFragmentDoc,
  });

  // get memberId from member
  if (!cardFragment || cardFragment.idMembers.includes(memberId)) {
    throw new NoopError();
  }

  const newMembers = [...cardFragment.idMembers, memberId];

  recordCardAction(cardId, action);

  // don't await so we don't block the UI
  client.mutate({
    mutation: CardActionDocument,
    variables: {
      cardId,
      card: {
        idMembers: newMembers,
      },
      traceId,
    },
    optimisticResponse: {
      __typename: 'Mutation',
      updateCard: {
        ...cardFragment,
        __typename: 'Card',
        id: cardId,
        subscribed: true,
        idMembers: newMembers,
      },
    },
  });

  const memberFragment = client.readFragment({
    id: `Member:${memberId}`,
    fragment: MemberNameFragmentDoc,
  });
  return format('notification_added_member_to_card', {
    member: dangerouslyConvertPrivacyString(memberFragment.fullName),
  });
};
