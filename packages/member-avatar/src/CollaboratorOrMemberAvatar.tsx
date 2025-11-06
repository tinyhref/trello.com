import {
  useMemo,
  type FunctionComponent,
  type MouseEventHandler,
  type RefObject,
} from 'react';

import {
  avatarsFromAvatarUrl,
  getNonPublicIfAvailable,
} from '@trello/business-logic/member';
import { client } from '@trello/graphql';
import { dangerouslyConvertPrivacyString } from '@trello/privacy';

import type { CollaboratorAvatarFragment } from './CollaboratorAvatarFragment.generated';
import { CollaboratorAvatarFragmentDoc } from './CollaboratorAvatarFragment.generated';
import type { MemberAvatarFragment } from './MemberAvatarFragment.generated';
import { MemberAvatarFragmentDoc } from './MemberAvatarFragment.generated';
import { MemberAvatarUnconnected } from './MemberAvatarUnconnected';

interface CollaboratorOrMemberAvatarProps {
  boardAdmin?: boolean;
  isGhost?: boolean;
  workspaceAdmin?: boolean;
  avatarClassName?: string;
  className?: string;
  deactivated?: boolean;
  hoverable?: boolean;
  idMember: string;
  lightBackground?: boolean;
  memberData?: CollaboratorAvatarFragment | MemberAvatarFragment;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  size?: number; // pixels
  testId?: string;
  isFreeWorkspace?: boolean;
  tabIndex?: number;
  avatarRef?: RefObject<HTMLElement>;
}

export const CollaboratorOrMemberAvatar: FunctionComponent<
  CollaboratorOrMemberAvatarProps
> = ({
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
}) => {
  const memberFragment = useMemo(
    () =>
      client.readFragment({
        id: `Member:${idMember}`,
        fragment: MemberAvatarFragmentDoc,
      }),
    [idMember],
  );

  const collaboratorFragment = useMemo(
    () =>
      client.readFragment({
        id: `Collaborator:${idMember}`,
        fragment: CollaboratorAvatarFragmentDoc,
      }),
    [idMember],
  );

  const isCollaborator = Boolean(
    collaboratorFragment?.username || collaboratorFragment?.fullName,
  );

  // If memberData is passed as a prop, use that to render the avatar. If not,
  // determine if this is a collaborator or a member and use the data from the
  // appropriate fragment hook.
  const member =
    memberData || isCollaborator ? collaboratorFragment : memberFragment;

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
    />
  );
};
