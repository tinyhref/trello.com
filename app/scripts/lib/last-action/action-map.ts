import type {
  Rename,
  SetDates,
  UpdateDescription,
} from '@trello/action-history';
import { client } from '@trello/graphql';
import { forNamespace } from '@trello/legacy-i18n';

import { doMove, undoMove } from './actionHandlers/move';
import {
  addLabel,
  addMember,
  archive,
  join,
  leave,
  removeLabel,
  removeMember,
  unArchive,
  unArchiveList,
} from './actionHandlers';
import type { ActionMap, Trace } from './ActionMapTypes';
import type { CardActionFragment } from './CardActionFragment.generated';
import { CardActionFragmentDoc } from './CardActionFragment.generated';
import { CardActionDocument } from './CardActionMutation.generated';
import { NoopError } from './NoopError';
import { recordCardAction } from './recordCardAction';

const format = forNamespace('notificationsGrouped', {
  shouldEscapeStrings: false,
});

export const doMap: ActionMap = {
  // @ts-expect-error
  join,
  // @ts-expect-error
  leave,
  // @ts-expect-error
  'add-member': addMember,
  // @ts-expect-error
  'remove-member': removeMember,
  // @ts-expect-error
  move: doMove,
  // @ts-expect-error
  'add-label': addLabel,
  // @ts-expect-error
  'remove-label': removeLabel,
  // @ts-expect-error
  archive,
  // @ts-expect-error
  unarchive: unArchive,
  // @ts-expect-error
  'unarchive-list': unArchiveList,
  // @ts-expect-error
  'set-dates': (cardId, action: SetDates, trace) => {
    const { traceId } = trace;

    const cardFragment = client.readFragment<CardActionFragment>({
      id: `Card:${cardId}`,
      fragment: CardActionFragmentDoc,
    });

    if (!cardFragment) {
      throw new NoopError();
    }

    const previousDates: SetDates['previousDates'] = {
      start: cardFragment.start ? new Date(cardFragment.start).getTime() : null,
      due: cardFragment.due ? new Date(cardFragment.due).getTime() : null,
      dueReminder: cardFragment.dueReminder || -1,
    };

    recordCardAction(cardId, { ...action, previousDates });

    const { dates } = action;
    if (
      previousDates.start === dates.start &&
      previousDates.due === dates.due &&
      previousDates.dueReminder === dates.dueReminder
    ) {
      throw new NoopError();
    }

    // we need our dates to be strings
    const startDate = dates.start ? new Date(dates.start).toISOString() : '';

    const dueDate = dates.due ? new Date(dates.due).toISOString() : '';

    client.mutate({
      mutation: CardActionDocument,
      variables: {
        cardId,
        card: {
          start: startDate,
          due: dueDate,
          dueReminder: dates.dueReminder,
        },
        traceId,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updateCard: {
          ...cardFragment,
          __typename: 'Card',
          id: cardId,
          start: startDate,
          due: dueDate,
          dueReminder: dates.dueReminder,
        },
      },
    });

    return format('notification_changed_dates');
  },
  // @ts-expect-error
  rename: (cardId, action: Rename, trace: Trace) => {
    const { traceId } = trace;

    const cardFragment = client.readFragment({
      id: `Card:${cardId}`,
      fragment: CardActionFragmentDoc,
    });

    if (!cardFragment) {
      throw new NoopError();
    }

    recordCardAction(cardId, { ...action, previousName: cardFragment.name });

    // don't await so we don't block the UI
    client.mutate({
      mutation: CardActionDocument,
      variables: {
        cardId,
        card: {
          name: action.name,
        },
        traceId,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updateCard: {
          __typename: 'Card',
          ...cardFragment,
          id: cardId,
          name: action.name,
        },
      },
    });

    return format('notification_renamed_card');
  },
  // @ts-expect-error
  'update-description': (cardId, action: UpdateDescription, trace) => {
    const { traceId } = trace;

    const cardFragment = client.readFragment({
      id: `Card:${cardId}`,
      fragment: CardActionFragmentDoc,
    });

    recordCardAction(cardId, action);

    // don't await so we don't block the UI
    client.mutate({
      mutation: CardActionDocument,
      variables: {
        cardId,
        card: {
          desc: action.description,
        },
        traceId,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updateCard: {
          __typename: 'Card',
          ...cardFragment,
          id: cardId,
          desc: action.description,
        },
      },
    });

    return format('notification_updated_description_of_card');
  },
};

export const undoMap: ActionMap = {
  join: doMap.leave,
  leave: doMap.join,
  'add-member': doMap['remove-member'],
  'remove-member': doMap['add-member'],
  // @ts-expect-error
  move: undoMove,
  'add-label': doMap['remove-label'],
  'remove-label': doMap['add-label'],
  archive: doMap.unarchive,
  'archive-list': doMap['unarchive-list'],
  unarchive: doMap.archive,
  // @ts-expect-error
  'set-dates': (cardId, action: SetDates, trace, context) => {
    const invertedAction: SetDates = {
      ...action,
      dates: action.previousDates,
      previousDates: action.dates,
    };
    return doMap['set-dates']?.(cardId, invertedAction, trace, context);
  },
  // @ts-expect-error
  rename: (cardId, action: Rename, trace, context) => {
    const invertedAction: Rename = {
      ...action,
      name: action.previousName,
      previousName: action.name,
    };
    return doMap.rename?.(cardId, invertedAction, trace, context);
  },
  // @ts-expect-error
  'update-description': (cardId, action: UpdateDescription, trace, context) => {
    const invertedAction: UpdateDescription = {
      ...action,
      description: action.previousDescription,
      previousDescription: action.description,
    };
    return doMap['update-description']?.(
      cardId,
      invertedAction,
      trace,
      context,
    );
  },
};
