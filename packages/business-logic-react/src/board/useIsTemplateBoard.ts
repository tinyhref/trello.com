import { checkIsTemplate } from '@trello/business-logic/board';

import { useIsTemplateBoardFragment } from './IsTemplateBoardFragment.generated';

export const useIsTemplateBoard = (boardId: string) => {
  const { data } = useIsTemplateBoardFragment({
    from: { id: boardId },
    optimistic: true,
  });
  const { prefs, premiumFeatures } = data || {};
  return checkIsTemplate({
    isTemplate: prefs?.isTemplate,
    permissionLevel: prefs?.permissionLevel,
    premiumFeatures,
  });
};
