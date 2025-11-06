import type { HistoryActionType } from '@trello/action-history';
import type {
  ActionSubjectIdType,
  ActionType,
  SourceType,
} from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';

const actionTypeToActionSubjectId: {
  [type in HistoryActionType]?: ActionSubjectIdType;
} = {
  join: 'joinCardAction',
  leave: 'leaveCardAction',
  'add-member': 'addMemberToCardAction',
  'remove-member': 'removeMemberFromCardAction',
  move: 'moveCardAction',
  'add-label': 'addLabelToCardAction',
  'remove-label': 'removeLabelFromCardAction',
  archive: 'archiveCardAction',
  unarchive: 'unarchiveCardAction',
  'set-dates': 'setCardDatesAction',
  rename: 'renameCardAction',
  'update-description': 'updateCardDescriptionAction',
};

interface Props {
  analyticsAction: ActionType;
  actionType: HistoryActionType;
  cardId: string;
  boardId: string;
  source: SourceType;
}

export function trackLastAction({
  analyticsAction,
  actionType,
  cardId,
  boardId,
  source,
}: Props): void {
  return Analytics.sendTrackEvent({
    action: analyticsAction,
    actionSubject: 'action',
    actionSubjectId: actionTypeToActionSubjectId[actionType],
    source,
    containers: {
      card: { id: cardId },
      board: { id: boardId },
    },
    attributes: {
      useGraphQlActions: true,
    },
  });
}
