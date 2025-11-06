import type { FunctionComponent, ReactNode } from 'react';

import { MemberAvatar } from '@trello/member-avatar';
import type { PIIString } from '@trello/privacy';
import type { RequestAccessWhenBlockedTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import * as styles from './AvatarComponent.module.less';

export interface AvatarComponentProps {
  fullName: PIIString;
  avatarDescription: ReactNode;
  email: PIIString;
  id: string;
}

export const AvatarComponent: FunctionComponent<AvatarComponentProps> = ({
  fullName,
  email,
  avatarDescription,
  id,
}) => {
  return (
    <div className={styles.innerContainer}>
      <p className={styles.description}>{avatarDescription}</p>
      <div className={styles.memberInfoContainer}>
        <MemberAvatar
          idMember={id}
          className={styles.memberAvatar}
          size={32}
          testId={getTestId<RequestAccessWhenBlockedTestIds>(
            'request-access-member-avatar',
          )}
        />
        <div>
          <p className={styles.fullName}>{fullName}</p>
          <p className={styles.email}>{email}</p>
        </div>
      </div>
    </div>
  );
};
