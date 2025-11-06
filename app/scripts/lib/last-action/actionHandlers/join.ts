import type { Join } from '@trello/action-history';
import { client } from '@trello/graphql';
import { forNamespace } from '@trello/legacy-i18n';

import type { Trace } from '../ActionMapTypes';
import type { CardActionFragment } from '../CardActionFragment.generated';
import { CardActionFragmentDoc } from '../CardActionFragment.generated';
import { CardActionDocument } from '../CardActionMutation.generated';
import { NoopError } from '../NoopError';
import { recordCardAction } from '../recordCardAction';

const format = forNamespace('notificationsGrouped', {
  shouldEscapeStrings: false,
});

export const join = (cardId: string, action: Join, trace: Trace) => {
  const memberId = action.idMember;

  const { traceId } = trace;

  const cardFragment = client.readFragment<CardActionFragment>({
    id: `Card:${cardId}`,
    fragment: CardActionFragmentDoc,
  });

  if (!cardFragment) {
    return;
  }

  if (cardFragment.idMembers.includes(memberId)) {
    throw new NoopError();
  }

  const newMembers = [...cardFragment.idMembers, memberId];

  recordCardAction(cardId, action);

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

  return format('notification_joined_card');
};
