import type { RefObject } from 'react';
import { useEffect } from 'react';

import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useOrganizationMembershipType } from '@trello/business-logic-react/organization';

type DraggableMemberData = {
  type: 'trello/member';
  memberId: string;
  isDeactivated: boolean;
};

export const isDraggableMember = (
  data: Record<string | symbol, unknown>,
): data is DraggableMemberData => {
  return 'type' in data && data.type === 'trello/member';
};

interface UseMemberDragAndDropOptions {
  avatarRef: RefObject<HTMLElement> | undefined;
  memberId: string;
  organizationId?: string;
  isEnabled?: boolean;
}

export function useDraggableMemberAvatar({
  avatarRef,
  memberId,
  organizationId,
  isEnabled,
}: UseMemberDragAndDropOptions) {
  const isDeactivated =
    useOrganizationMembershipType({
      idMember: memberId,
      idOrganization: organizationId,
    }) === 'deactivated';

  useEffect(() => {
    if (!avatarRef?.current || !isEnabled) {
      return;
    }

    return draggable({
      element: avatarRef.current,
      getInitialData: () => {
        return {
          type: 'trello/member',
          memberId,
          isDeactivated,
        };
      },
    });
  }, [avatarRef, isEnabled, memberId, isDeactivated]);
}
