import type { RemoveMember } from '@trello/action-history';
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

export const removeMember = (
  cardId: string,
  action: RemoveMember,
  trace: Trace,
) => {
  const memberId = action.idMember;
  const { traceId } = trace;

  const cardFragment = client.readFragment<CardActionFragment>({
    id: `Card:${cardId}`,
    fragment: CardActionFragmentDoc,
  });

  if (!cardFragment?.idMembers.includes(memberId)) {
    throw new NoopError();
  }

  const newMembers = cardFragment.idMembers.filter(
    (id: string) => id !== memberId,
  );

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
        subscribed: false,
        idMembers: newMembers,
      },
    },
  });

  const memberFragment = client.readFragment({
    id: `Member:${memberId}`,
    fragment: MemberNameFragmentDoc,
  });
  return format('notification_removed_member_from_card', {
    member: dangerouslyConvertPrivacyString(memberFragment.fullName),
  });
};
