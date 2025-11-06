import type { FunctionComponent, MouseEventHandler, Ref } from 'react';

import {
  avatarsFromAvatarUrl,
  getNonPublicIfAvailable,
} from '@trello/business-logic/member';
import { dangerouslyConvertPrivacyString } from '@trello/privacy';

import type { MemberAvatarFragment } from './MemberAvatarFragment.generated';
import { useMemberAvatarFragment } from './MemberAvatarFragment.generated';
import { MemberAvatarUnconnected } from './MemberAvatarUnconnected';

interface MemberAvatarProps {
  boardAdmin?: boolean;
  isGhost?: boolean;
  workspaceAdmin?: boolean;
  avatarClassName?: string;
  className?: string;
  deactivated?: boolean;
  hoverable?: boolean;
  idMember: string;
  lightBackground?: boolean;
  memberData?: MemberAvatarFragment;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  size?: number; // pixels
  testId?: string;
  isFreeWorkspace?: boolean;
  tabIndex?: number;
  avatarRef?: Ref<HTMLElement>;
  ariaExpanded?: boolean;
}

export const MemberAvatar: FunctionComponent<MemberAvatarProps> = ({
  boardAdmin,
  isGhost,
  workspaceAdmin,
  className = '',
  size = 30,
  avatarClassName,
  deactivated,
  idMember,
  onClick,
  hoverable,
  memberData,
  lightBackground,
  testId,
  isFreeWorkspace,
  tabIndex,
  avatarRef,
  ariaExpanded,
}) => {
  const { data: memberFragment } = useMemberAvatarFragment({
    from: { id: idMember },
    returnPartialData: true,
    optimistic: true,
  });

  // If memberData is passed as a prop, use that to render the avatar. If not,
  // use the data from the member fragment hook.
  const member = memberData || memberFragment;

  // Convert query results into data for the underlying CanonicalAvatar
  const username = member?.username;
  const fullName = member && getNonPublicIfAvailable(member, 'fullName');
  const initials = member && getNonPublicIfAvailable(member, 'initials');
  const avatarUrl = member && getNonPublicIfAvailable(member, 'avatarUrl');
  const avatars = avatarUrl
    ? avatarsFromAvatarUrl(dangerouslyConvertPrivacyString(avatarUrl))
    : undefined;

  return (
    <MemberAvatarUnconnected
      className={className}
      avatarClassName={avatarClassName}
      onClick={onClick}
      hoverable={hoverable}
      deactivated={deactivated}
      username={username}
      fullName={fullName}
      initials={initials}
      avatars={avatars}
      size={size}
      lightBackground={lightBackground}
      boardAdmin={boardAdmin}
      isGhost={isGhost}
      testId={testId}
      workspaceAdmin={workspaceAdmin}
      isFreeWorkspace={isFreeWorkspace}
      tabIndex={tabIndex}
      avatarRef={avatarRef}
      ariaExpanded={ariaExpanded}
    />
  );
};
