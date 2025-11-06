import { Analytics } from '@trello/atlassian-analytics';
import { SharedState } from '@trello/shared-state';

interface EditCommentState {
  [idComment: string]: {
    isEditing: boolean;
  };
}

/**
 * Editing a comment is triggered from a Backbone view directly, so we need to
 * make our EditComment component aware of when an edit action is taken.
 * Since multiple editable comments can be rendered on a single card, we key
 * each comment to its ID, and clear the state out as we go.
 */
export const editCommentState = new SharedState<EditCommentState>({});

export const editComment = (idComment: string) => {
  requestAnimationFrame(() => {
    editCommentState.setValue({ [idComment]: { isEditing: true } });

    Analytics.sendClickedButtonEvent({
      buttonName: 'editCommentButton',
      source: 'cardDetailScreen',
    });
  });
};
