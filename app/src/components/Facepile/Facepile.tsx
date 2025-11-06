import cx from 'classnames';
import type {
  FunctionComponent,
  MouseEvent as ReactMouseEvent,
  Ref,
} from 'react';
import { useCallback } from 'react';

import { DynamicButton } from '@trello/dynamic-tokens';
import { MemberAvatar } from '@trello/member-avatar';
import { Popover, usePopover } from '@trello/nachos/popover';

import { LazyProfileCard } from 'app/src/components/ProfileCard';
import { DraggableAvatar } from './DraggableAvatar';

import * as styles from './Facepile.module.less';

interface FacepileProps {
  className?: string;
  avatarSize?: number;
  maxFaceCount?: number;
  showMore?: boolean;
  memberIds: string[];
  renderAvatar?: (memberId: string) => JSX.Element;
  onShowMoreClick?: () => void;
  showMoreRef?: Ref<HTMLButtonElement>;
  showMoreTestId?: string;
  showProfileCards?: boolean;
  boardId?: string;
  idOrganization?: string;
  renderingInMenu?: boolean;
}

const AvatarPopover = ({
  idMember,
  avatarSize,
  showProfileCards,
}: {
  idMember: string;
  avatarSize: number;
  showProfileCards: boolean;
}) => {
  const { triggerRef, toggle, popoverProps } = usePopover<HTMLButtonElement>();

  const onCloseProfileCard = useCallback(
    (e: ReactMouseEvent) => {
      e.stopPropagation();

      toggle();
    },
    [toggle],
  );

  const onOpenProfileCard = useCallback(
    (e: ReactMouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      toggle();
    },
    [toggle],
  );

  return (
    <div key={idMember}>
      <MemberAvatar
        idMember={idMember}
        size={avatarSize}
        onClick={showProfileCards ? onOpenProfileCard : undefined}
        avatarRef={triggerRef}
        testId="facepile-member-avatar"
      />
      <Popover {...popoverProps} noVerticalPadding>
        <LazyProfileCard onClose={onCloseProfileCard} memberId={idMember} />
      </Popover>
    </div>
  );
};

export const Facepile: FunctionComponent<FacepileProps> = ({
  className = '',
  avatarSize = 30,
  maxFaceCount = 5,
  showMore = true,
  memberIds,
  renderAvatar,
  onShowMoreClick,
  showMoreRef,
  showMoreTestId,
  showProfileCards = true,
  idOrganization,
  renderingInMenu,
}) => {
  const avatars = memberIds.slice(0, maxFaceCount).map((idMember) => {
    if (renderAvatar) {
      return renderAvatar(idMember);
    }

    return (
      <AvatarPopover
        key={idMember}
        idMember={idMember}
        avatarSize={avatarSize}
        showProfileCards={showProfileCards}
      />
    );
  });

  const shouldRenderShowMore = !!showMore && memberIds.length > maxFaceCount;

  const showMoreButton = onShowMoreClick ? (
    <div>
      <DynamicButton
        className={cx({
          [styles.showMore]: true,
          [styles.showMoreClickable]: true,
          [styles.boardMenuShowMoreClickable]: renderingInMenu,
        })}
        ref={showMoreRef}
        onClick={onShowMoreClick}
        style={{ width: avatarSize, height: avatarSize }}
        data-testid={showMoreTestId}
      >
        +{memberIds.length - maxFaceCount}
      </DynamicButton>
    </div>
  ) : (
    <div
      className={cx(styles.showMore, styles.showMoreDisabled)}
      style={{ width: avatarSize, height: avatarSize }}
    >
      +{memberIds.length - maxFaceCount}
    </div>
  );

  return (
    <div
      className={cx(styles.facepile, className)}
      ref={
        !shouldRenderShowMore && renderingInMenu
          ? (showMoreRef as Ref<HTMLDivElement>)
          : null
      }
    >
      {avatars.map((avatar, index) => (
        <DraggableAvatar
          key={memberIds[index]}
          index={index}
          memberId={memberIds[index]}
          organizationId={idOrganization}
          avatarSize={avatarSize}
          avatarCount={avatars.length}
        >
          {avatar}
        </DraggableAvatar>
      ))}
      {shouldRenderShowMore && <>{showMoreButton}</>}
    </div>
  );
};
