import { isAIEnabledForEnterprise } from '@trello/business-logic/enterprise';
import { isAIEnabledForPremOrganization } from '@trello/business-logic/organization';

import { useWorkspaceAtlassianIntelligencePrefQuery } from './WorkspaceAtlassianIntelligencePrefQuery.generated';

export const useIsAtlassianIntelligenceEnabled = ({
  boardId,
  skip,
}: {
  boardId: string | null;
  skip?: boolean;
}): boolean => {
  // This query uses idBoard instead of workspace because for enterprise workspace
  // guests the idEnterprise field on the organization field in the CurrentBoardFull
  // query does not get populated, because guests have limited visibility to organization
  // fields. This means that we need to get idEnterprise from the board.
  const { data } = useWorkspaceAtlassianIntelligencePrefQuery({
    variables: { boardId: boardId ?? '' },
    skip: skip || !boardId,
    waitOn: ['CurrentBoardInfo'],
  });

  if (data?.board?.enterprise?.id) {
    return isAIEnabledForEnterprise(data.board.enterprise);
  }

  const workspace = data?.board?.organization;

  const isPrefEnabled = workspace && isAIEnabledForPremOrganization(workspace);
  // If the flag is on to restrict AI to only premium workspaces, check to see if the workspace is standard,
  // otherwise check if the AI is part of the feature set
  const isPartOfFeatureSet = workspace?.premiumFeatures?.includes('isStandard')
    ? false
    : workspace?.premiumFeatures?.includes('atlassianIntelligence');

  const isAtlassianIntelligenceEnabled = isPrefEnabled && isPartOfFeatureSet;

  return Boolean(isAtlassianIntelligenceEnabled);
};
