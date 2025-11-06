import type { FunctionComponent, MouseEventHandler } from 'react';

import { Avatar } from '@atlassian/trello-canonical-components';
import { MemberIcon } from '@trello/nachos/icons/member';
import { token, useGlobalTheme } from '@trello/theme';

import { ProfileCardWrapper } from './ProfileCardWrapper';

import * as styles from './ProfileCardSkeleton.module.less';

interface Props {
  onClose: MouseEventHandler<HTMLButtonElement>;
}

export const ProfileCardSkeleton: FunctionComponent<Props> = ({ onClose }) => {
  const { effectiveColorMode } = useGlobalTheme();
  const useLightBackground = effectiveColorMode !== 'dark';

  return (
    <ProfileCardWrapper onClose={onClose}>
      <div className={styles.cardTop}>
        <Avatar
          size={88}
          lightBackground={useLightBackground}
          className={styles.avatar}
        >
          <MemberIcon
            size="large"
            color={token('color.icon.subtle', '#626F86')}
          />
        </Avatar>
        <div className={styles.profileInfo}>
          <div className={styles.fullName}>
            <div className={styles.fullNameSkeleton} />
          </div>
          <div className={styles.atName}>
            @<div className={styles.atNameSkeleton} />
          </div>
        </div>
      </div>
    </ProfileCardWrapper>
  );
};
