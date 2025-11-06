/**
 * Used across Trello to decide whether Jira site linking details should be displayed
 * to the user.  Currently there are no cases where we want to do this.
 * @param orgId
 * @returns
 */
export const shouldHideLinkingDetails = (orgId?: string): boolean => {
  return false;
};
