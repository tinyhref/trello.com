import { useCallback } from 'react';

import { client } from '@trello/graphql';
import { useWorkspaceId } from '@trello/id-context';

import { ClipboardWorkspaceAttachmentRestrictionsFragmentDoc } from './ClipboardWorkspaceAttachmentRestrictionsFragment.generated';

export const useCanAddFileType = () => {
  const workspaceId = useWorkspaceId();

  const canAddFileType = useCallback(
    (attachmentType: string): boolean => {
      const workspace = client.readFragment({
        id: `Organization:${workspaceId}`,
        fragment: ClipboardWorkspaceAttachmentRestrictionsFragmentDoc,
      });
      const attachmentRestrictions = workspace?.prefs?.attachmentRestrictions;
      return attachmentRestrictions?.includes(attachmentType) ?? true;
    },
    [workspaceId],
  );

  return { canAddFileType };
};
