import cx from 'classnames';
import type { FunctionComponent, ReactNode } from 'react';
import { useRef } from 'react';

import { useDraggableMemberAvatar } from 'app/src/components/CardFront/useDraggableMemberAvatar';

// eslint-disable-next-line @trello/less-matches-component
import * as styles from './Facepile.module.less';

interface DraggableAvatarProps {
  memberId: string;
  organizationId?: string;
  index: number;
  avatarSize: number;
  avatarCount: number;
  children: ReactNode;
}

export const DraggableAvatar: FunctionComponent<DraggableAvatarProps> = ({
  memberId,
  organizationId,
  index,
  avatarSize,
  avatarCount,
  children,
}) => {
  const avatarRef = useRef<HTMLDivElement>(null);

  useDraggableMemberAvatar({
    avatarRef,
    memberId,
    organizationId,
    isEnabled: true,
  });

  return (
    <div
      className={cx(styles.avatar)}
      data-id={memberId}
      style={{
        zIndex: avatarCount - index,
        width: avatarSize,
        height: avatarSize,
      }}
      ref={avatarRef}
    >
      {children}
    </div>
  );
};
