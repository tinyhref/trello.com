import type { AddLabel, RemoveLabel } from '@trello/action-history';
import { client } from '@trello/graphql';
import { forNamespace } from '@trello/legacy-i18n';
import type { Card } from '@trello/model-types';

import type { Trace } from '../ActionMapTypes';
import type { CardActionFragment } from '../CardActionFragment.generated';
import { CardActionFragmentDoc } from '../CardActionFragment.generated';
import { CardActionDocument } from '../CardActionMutation.generated';
import { LabelNameFragmentDoc } from '../LabelNameFragment.generated';
import { NoopError } from '../NoopError';
import { recordCardAction } from '../recordCardAction';

const format = forNamespace('notificationsGrouped', {
  shouldEscapeStrings: false,
});

export const addLabel = (cardId: string, action: AddLabel, trace: Trace) => {
  const labelId = action.idLabel;
  const { traceId } = trace;

  const cardFragment = client.readFragment<CardActionFragment>({
    id: `Card:${cardId}`,
    fragment: CardActionFragmentDoc,
  });

  if (!cardFragment || cardFragment.idLabels.includes(labelId)) {
    throw new NoopError();
  }

  const newLabels = [...cardFragment.idLabels, labelId];

  recordCardAction(cardId, action);

  // don't await so we don't block the UI
  client.mutate({
    mutation: CardActionDocument,
    variables: {
      cardId,
      card: {
        idLabels: newLabels,
      },
      traceId,
    },
    optimisticResponse: {
      __typename: 'Mutation',
      updateCard: {
        ...cardFragment,
        __typename: 'Card',
        id: cardId,
        idLabels: newLabels,
      },
    },
    update(cache, { data: optimisticData }) {
      if (!optimisticData) {
        return;
      }
      cache.modify<Card>({
        id: cache.identify({
          id: cardId,
          __typename: 'Card',
        }),
        fields: {
          labels(existingLabels = []) {
            if (!Array.isArray(existingLabels)) {
              return existingLabels;
            }
            return [
              ...existingLabels,
              {
                __ref: cache.identify({
                  id: labelId,
                  __typename: 'Label',
                }),
              },
            ];
          },
        },
      });
    },
  });

  const labelFragment = client.readFragment({
    id: `Label:${labelId}`,
    fragment: LabelNameFragmentDoc,
  });

  return format('notification_added_label_to_card', {
    label: labelFragment?.name,
  });
};

export const removeLabel = (
  cardId: string,
  action: RemoveLabel,
  trace: Trace,
) => {
  const labelId = action.idLabel;
  const { traceId } = trace;

  const cardFragment = client.readFragment<CardActionFragment>({
    id: `Card:${cardId}`,
    fragment: CardActionFragmentDoc,
  });

  if (!cardFragment?.idLabels.includes(labelId)) {
    throw new NoopError();
  }

  const newLabels = cardFragment.idLabels.filter(
    (id: string) => id !== labelId,
  );

  recordCardAction(cardId, action);

  // don't await so we don't block the UI
  client.mutate({
    mutation: CardActionDocument,
    variables: {
      cardId,
      card: {
        idLabels: newLabels,
      },
      traceId,
    },
    optimisticResponse: {
      __typename: 'Mutation',
      updateCard: {
        ...cardFragment,
        __typename: 'Card',
        id: cardId,
        idLabels: newLabels,
      },
    },
    update(cache, { data: optimisticData }) {
      if (!optimisticData) {
        return;
      }
      cache.modify<Card>({
        id: cache.identify({
          id: cardId,
          __typename: 'Card',
        }),
        fields: {
          labels(existingLabels = [], { readField }) {
            const updatedLabels = existingLabels.filter((labelRef) => {
              return readField('id', labelRef) !== labelId;
            });
            return updatedLabels;
          },
        },
      });
    },
  });

  const labelFragment = client.readFragment({
    id: `Label:${labelId}`,
    fragment: LabelNameFragmentDoc,
  });

  return format('notification_removed_label_from_card', {
    label: labelFragment?.name,
  });
};
