import { useCallback } from 'react';

import { SharedState, useSharedStateSelector } from '@trello/shared-state';

interface JiraIssueModalState {
  currentListId: string | null;
  isCreateJiraListModalOpen: boolean;
  isEditJiraListModalOpen: boolean;
}

export const defaultValue: JiraIssueModalState = {
  currentListId: null,
  isCreateJiraListModalOpen: false,
  isEditJiraListModalOpen: false,
};

export const jiraIssueModalState = new SharedState<JiraIssueModalState>(
  defaultValue,
);

export const openCreateJiraListModal = () => {
  jiraIssueModalState.setValue({
    currentListId: null,
    isCreateJiraListModalOpen: true,
    isEditJiraListModalOpen: false,
  });
};

export const closeCreateJiraListModal = () => {
  jiraIssueModalState.setValue(defaultValue);
};

export const useIsCreateJiraListModalOpen = () => {
  return useSharedStateSelector(
    jiraIssueModalState,
    useCallback((state) => {
      return state.isCreateJiraListModalOpen;
    }, []),
  );
};

export const openEditJiraListModal = (listId: string) => {
  jiraIssueModalState.setValue({
    currentListId: listId,
    isCreateJiraListModalOpen: false,
    isEditJiraListModalOpen: true,
  });
};

export const closeEditJiraListModal = () => {
  jiraIssueModalState.setValue(defaultValue);
};

export const useIsEditJiraListModalOpen = (listId: string) => {
  return useSharedStateSelector(
    jiraIssueModalState,
    useCallback(
      (state) => {
        return state.isEditJiraListModalOpen && listId === state.currentListId;
      },
      [listId],
    ),
  );
};
