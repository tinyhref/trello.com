import type { HistoryActionType, HistoryEntry } from '@trello/action-history';
import { ActionHistory } from '@trello/action-history';
import type {
  ActionSubjectType,
  ActionType,
  Task,
} from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';
import { sendErrorEvent } from '@trello/error-reporting';

import { Alerts } from 'app/scripts/views/lib/Alerts';
import { doMap, undoMap } from './action-map';
import type { ActionMap } from './ActionMapTypes';
import { NoopError } from './NoopError';
import { trackLastAction } from './track-last-action';
import type { UserContext } from './validate-user-context';
import {
  isValidActionTypeContext,
  isValidBoardContext,
  isValidCardContext,
  isValidListContext,
} from './validate-user-context';

// Exhaustive mapping from HistoryActionType to task fields for tracing.
// This includes action.types that may not currently be traced or repeatable.
const taskMap: {
  [type in HistoryActionType]: {
    taskName: Task;
    field: ActionSubjectType;
  };
} = {
  'add-checklist': {
    taskName: 'create-checklist',
    field: 'checklist',
  },
  'add-label': {
    taskName: 'edit-card/idLabels',
    field: 'idLabels',
  },
  'add-member': {
    taskName: 'edit-card/idMembers',
    field: 'idMembers',
  },
  archive: {
    taskName: 'edit-card/closed',
    field: 'closed',
  },
  'archive-list': {
    taskName: 'edit-list/closed',
    field: 'closed',
  },
  delete: {
    taskName: 'delete-card',
    field: 'id',
  },
  join: {
    taskName: 'edit-card/idMembers',
    field: 'idMembers',
  },
  leave: {
    taskName: 'edit-card/idMembers',
    field: 'idMembers',
  },
  move: {
    taskName: 'edit-card/pos',
    field: 'position',
  },
  'remove-label': {
    taskName: 'edit-card/idLabels',
    field: 'idLabels',
  },
  'remove-member': {
    taskName: 'edit-card/idMembers',
    field: 'idMembers',
  },
  rename: {
    taskName: 'edit-card/name',
    field: 'name',
  },
  'set-dates': {
    taskName: 'edit-card/due',
    field: 'due',
  },
  'update-description': {
    taskName: 'edit-card/desc',
    field: 'description',
  },
  unarchive: {
    taskName: 'edit-card/closed',
    field: 'closed',
  },
  'unarchive-list': {
    taskName: 'edit-list/closed',
    field: 'closed',
  },
};

export function handle({
  analyticsAction,
  entry: { action, context },
  userContext,
  map,
  callback,
}: {
  analyticsAction: ActionType;
  entry: HistoryEntry;
  userContext: UserContext;
  map: ActionMap;
  callback?: () => void;
}): void {
  const handler = map[action.type];
  if (!handler) {
    return;
  }

  const cardId =
    analyticsAction === 'repeated' ? userContext.idCard : context.idCard;
  const listId = context.idList;

  let message;

  const taskFields = taskMap[action.type];
  const { taskName, field } = taskFields;
  const task = {
    traceId:
      action.type !== 'move'
        ? Analytics.startTask({
            taskName,
            source: userContext.source,
          })
        : '',
    taskName,
    field,
    source: userContext.source,
  };

  try {
    if (action.type === 'archive-list') {
      message = handler(listId, action, task, context);
    } else {
      message = handler(cardId || '', action, task, context);
    }

    callback?.();
  } catch (error) {
    if (error instanceof NoopError) {
      const { traceId, taskName, source } = task;
      if (traceId) {
        // Since this is a noop or cancelation, abort the task.
        Analytics.taskAborted({
          traceId,
          taskName,
          source,
          attributes: { useGraphQlActions: true },
        });
      }
      return;
    }
    sendErrorEvent(error as Error, {
      tags: {
        ownershipArea: 'trello-web-eng',
        feature: 'Undo Action',
      },
      extraData: {
        analyticsAction,
        actionType: action.type,
        idCard: context.idCard,
        idList: context.idList,
        idBoard: context.idBoard,
        source: userContext.source,
        viewingCard: userContext.idCard ?? '',
        viewingBoard: userContext.idBoard ?? '',
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { traceId, taskName, source } = task;
    if (traceId) {
      Analytics.taskFailed({
        traceId,
        taskName,
        source,
        error,
        attributes: { useGraphQlActions: true },
      });
    }
    return;
  }
  if (message) {
    Alerts.showLiteralText(message, 'subtle', 'lastAction', 2000);
  }
  trackLastAction({
    analyticsAction,
    actionType: action.type,
    cardId: context.idCard,
    boardId: context.idBoard,
    source: userContext.source,
  });
}

export function undoAction(userContext: UserContext): void {
  const [entry] = ActionHistory.get();
  if (
    !entry ||
    Object.prototype.hasOwnProperty.call(entry, 'count') ||
    !isValidBoardContext(userContext, entry) ||
    !isValidListContext(userContext, entry) ||
    !isValidCardContext(userContext, entry) ||
    !isValidActionTypeContext(userContext, entry)
  ) {
    return;
  }
  handle({
    analyticsAction: 'undone',
    entry,
    userContext,
    map: undoMap,
    callback: () => ActionHistory.undo(),
  });
}

export function redoAction(userContext: UserContext): void {
  const [entry] = ActionHistory.getUndoStack();
  if (
    !entry ||
    !isValidBoardContext(userContext, entry) ||
    !isValidCardContext(userContext, entry) ||
    !isValidActionTypeContext(userContext, entry)
  ) {
    return;
  }
  handle({
    analyticsAction: 'redone',
    entry,
    userContext,
    map: doMap,
    callback: () => ActionHistory.redo(),
  });
}

export function repeatAction(userContext: UserContext): void {
  const [entry] = ActionHistory.get();
  if (
    !entry ||
    Object.prototype.hasOwnProperty.call(entry, 'count') ||
    !isValidBoardContext(userContext, entry) ||
    // Exit early if we're on the same card; only repeat on different cards.
    isValidCardContext(userContext, entry) ||
    !isValidActionTypeContext(userContext, entry)
  ) {
    return;
  }
  handle({
    analyticsAction: 'repeated',
    entry,
    userContext,
    map: doMap,
  });
}
