import { useMemo } from 'react';

import { useMemberId } from '@trello/authentication';
import { isEmbeddedInAtlassian } from '@trello/browser';
import { checkIsTemplate, isPluginEnabled } from '@trello/business-logic/board';
import { useBoardMembers } from '@trello/business-logic-react/board';

// eslint-disable-next-line no-restricted-imports
import { Controller } from 'app/scripts/controller';
import { LegacyPowerUps } from 'app/scripts/data/legacy-power-ups';
import { useAboutThisBoardFragment } from './AboutThisBoardFragment.generated';

interface HookProps {
  boardId: string;
}

export function useAboutThisBoardModal({ boardId }: HookProps) {
  const memberId = useMemberId();
  const { data: board } = useAboutThisBoardFragment({
    from: { id: boardId },
    optimistic: true,
  });

  const { isMember } = useBoardMembers(boardId);

  const idMemberCreator = board?.idMemberCreator;
  const premiumFeatures = board?.premiumFeatures;
  const boardPlugins = board?.boardPlugins;
  const isTemplate = board?.prefs?.isTemplate ?? false;
  const permissionLevel = board?.prefs?.permissionLevel;
  const description = board?.desc;
  const closed = board?.closed;

  const hasDescription = Boolean(description);
  const isClosed = Boolean(closed);
  const isMemberCreator = idMemberCreator === memberId;
  const isBoardMember = isMember(memberId);

  const isBoardTemplate = useMemo(() => {
    return checkIsTemplate({
      isTemplate,
      permissionLevel,
      premiumFeatures,
    });
  }, [isTemplate, permissionLevel, premiumFeatures]);

  const isReadMePluginEnabled = useMemo(() => {
    return isPluginEnabled(LegacyPowerUps.readMe, {
      boardPlugins: boardPlugins ?? [],
    });
  }, [boardPlugins]);

  const embeddedInAtlassian = useMemo(() => {
    return isEmbeddedInAtlassian();
  }, []);

  const wouldRender =
    !isMemberCreator &&
    // TODO don't use Controller for this... :)
    Controller.isFirstTimeViewingBoard &&
    hasDescription &&
    !isClosed &&
    !isReadMePluginEnabled &&
    !embeddedInAtlassian &&
    (!isBoardTemplate || (isBoardTemplate && !isBoardMember));

  return {
    wouldRender,
  };
}
