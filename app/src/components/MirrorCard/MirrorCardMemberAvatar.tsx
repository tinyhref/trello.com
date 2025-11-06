import type { FunctionComponent } from 'react';
import { useCallback } from 'react';
import { useContextSelector } from 'use-context-selector';

import { MemberAvatar } from '@trello/member-avatar';
import type { TestId } from '@trello/test-ids';

import { BoardMembersContext } from 'app/src/components/BoardMembersContext';

interface MirrorCardMemberAvatarProps {
  memberId: string;
  testId?: TestId;
}

export const MirrorCardMemberAvatar: FunctionComponent<
  MirrorCardMemberAvatarProps
> = ({ memberId, testId }) => {
  const isDeactivated = useContextSelector(
    BoardMembersContext,
    useCallback((value) => value.isMemberDeactivated(memberId), [memberId]),
  );

  return (
    <MemberAvatar
      deactivated={isDeactivated}
      idMember={memberId}
      size={24}
      tabIndex={-1}
      testId={testId}
      hoverable={false}
    />
  );
};
