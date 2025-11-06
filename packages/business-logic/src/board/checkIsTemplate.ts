import type { Board, Board_PermissionLevel } from '@trello/model-types';

/**
 * Checks if the board is a Template board.
 */
export function checkIsTemplate({
  isTemplate,
  permissionLevel,
  premiumFeatures,
}: {
  isTemplate?: boolean;
  permissionLevel?: Board_PermissionLevel;
  premiumFeatures?: Board['premiumFeatures'];
}) {
  if (!isTemplate) {
    return false;
  }

  // public templates are free
  if (permissionLevel === 'public') {
    return true;
  }

  // privateTemplates are a paid feature
  if (premiumFeatures?.includes('privateTemplates')) {
    return true;
  }

  return false;
}
