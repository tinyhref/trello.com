import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';
import { useCanImport } from '@trello/jwm';
import { useWorkspace } from '@trello/workspaces';

import { useBoardIdFromBoardOrCardRoute } from 'app/src/components/Board/useBoardIdFromBoardOrCardRoute';
import { messageKey } from './ExportToJwmBanner';
import { useExportToJwmBannerFragment } from './ExportToJwmBannerFragment.generated';

export function useExportToJwmBanner(): {
  wouldRender: boolean;
} {
  const boardId = useBoardIdFromBoardOrCardRoute() || '';
  const { workspaceId } = useWorkspace();

  const { data } = useExportToJwmBannerFragment({
    from: { id: workspaceId },
  });

  const { isOneTimeMessageDismissed } = useOneTimeMessagesDismissed();

  const isBannerDismissed = isOneTimeMessageDismissed(messageKey(data?.id));

  const jwmCloudId = data?.jwmLink?.idCloud;
  const online = !data?.jwmLink?.inaccessible;
  const canImportToJwm = useCanImport(jwmCloudId).canImport;

  const wouldRender = Boolean(
    canImportToJwm && !isBannerDismissed && boardId && online,
  );

  return {
    wouldRender,
  };
}
