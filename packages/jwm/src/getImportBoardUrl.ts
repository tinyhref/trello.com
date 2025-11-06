export const getImportBoardUrl = ({
  jwmSiteUrl,
  boardId,
  workspaceId,
}: {
  jwmSiteUrl: string;
  boardId: string;
  workspaceId: string;
}) => {
  const params = new URLSearchParams({
    importType: 'Trello',
    workspaceId,
    entityId: boardId,
  }).toString();

  return `${jwmSiteUrl}/jira/create-project?${params}`;
};
