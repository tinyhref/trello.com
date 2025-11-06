// TODO: Convert to use graphql data layer
import type { FunctionComponent } from 'react';
import { useMemo } from 'react';

import { TrelloIntlProvider } from '@trello/i18n';

import { ModelCache } from 'app/scripts/db/ModelCache';
import { AddGuestToWorkspacePopoverContent } from 'app/src/components/AddGuestToWorkspace/AddGuestToWorkspacePopoverContent';

interface Props {
  onBack: () => void;
  memberId: string;
  boardId: string;
}

export const AddBoardMemberToWorkspace: FunctionComponent<Props> = ({
  onBack,
  memberId,
  boardId,
}) => {
  const board = useMemo(() => ModelCache.get('Board', boardId), [boardId]);

  const org = board?.getOrganization();

  // we shouldn't ever return null here, but gotta have a fallback of some kind to be safe
  if (!org?.id) {
    return null;
  }

  return (
    <TrelloIntlProvider>
      <AddGuestToWorkspacePopoverContent
        hide={onBack}
        memberId={memberId}
        workspaceId={org.id}
      />
    </TrelloIntlProvider>
  );
};
