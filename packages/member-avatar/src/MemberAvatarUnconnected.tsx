import cx from 'classnames';
import type { FunctionComponent, MouseEventHandler, Ref } from 'react';

import { Avatar as CanonicalAvatar } from '@atlassian/trello-canonical-components';
import type { Avatars } from '@trello/business-logic/member';
import { forTemplate } from '@trello/legacy-i18n';
import { Button } from '@trello/nachos/button';
import { MemberIcon } from '@trello/nachos/icons/member';
import type { PIIString } from '@trello/privacy';
import {
  dangerouslyConvertPrivacyString,
  EMPTY_PII_STRING,
} from '@trello/privacy';
import { token } from '@trello/theme';

import * as styles from './MemberAvatarUnconnected.module.less';

const format = forTemplate('member');

// Order matters here, if you add a new one,
// ensure it remains in ascending order
const AVATAR_SIZES = [30, 50, 170];

export interface MemberAvatarUnconnectedProps {
  className?: string;
  testId?: string;
  avatarClassName?: string;
  fullName?: PIIString | null;
  username?: PIIString;
  avatars?: Avatars;
  initials?: PIIString | null;
  size?: number; // pixels
  onClick?: MouseEventHandler<HTMLButtonElement>;
  hoverable?: boolean;
  deactivated?: boolean;
  lightBackground?: boolean;
  boardAdmin?: boolean;
  isGhost?: boolean;
  workspaceAdmin?: boolean;
  isFreeWorkspace?: boolean;
  tabIndex?: number;
  avatarRef?: Ref<HTMLElement>;
  ariaExpanded?: boolean;
}

export const MemberAvatarUnconnected: FunctionComponent<
  MemberAvatarUnconnectedProps
> = ({
  className,
  avatarClassName,
  fullName: inputFullName,
  username,
  avatars,
  initials,
  size = 30,
  onClick,
  hoverable,
  deactivated,
  lightBackground,
  boardAdmin,
  isGhost,
  workspaceAdmin,
  testId,
  isFreeWorkspace,
  tabIndex,
  avatarRef,
  ariaExpanded,
}) => {
  const fullName = inputFullName ?? EMPTY_PII_STRING;
  const interactive = hoverable || !!onClick;
  const resolution = AVATAR_SIZES.find((s) => s >= size);
  const resolution2x = AVATAR_SIZES.find((s) => s >= size * 2) || resolution;
  if (resolution === undefined || resolution2x === undefined) {
    throw new Error('Invalid member avatar size');
  }
  const showDefaultAtlassianIcon = !(initials || avatars);
  const img = avatars?.[resolution];
  const img2x = avatars?.[resolution2x];

  const dangerousFullName = dangerouslyConvertPrivacyString(fullName);
  const dangerousUsername = dangerouslyConvertPrivacyString(username);
  const dangerousTitle = dangerousUsername
    ? `${dangerousFullName} (${dangerousUsername})`
    : dangerousFullName;

  const avatarContent = (
    <>
      <CanonicalAvatar
        className={cx(
          {
            [styles.hoverable]: interactive,
            [styles.withImage]: avatars,
            [styles.transparentBackground]: img || img2x,
          },
          avatarClassName,
        )}
        img={img}
        img2x={img2x}
        initials={initials}
        size={size}
        deactivated={deactivated}
        isGhost={isGhost}
        title={dangerousTitle}
        lightBackground={lightBackground}
      >
        {showDefaultAtlassianIcon && (
          <MemberIcon
            size={size > 20 ? 'large' : undefined}
            color={token('color.text.subtle', '#44546f')}
          />
        )}
      </CanonicalAvatar>
      {(boardAdmin || (!isFreeWorkspace && workspaceAdmin)) && (
        <span
          className={styles.admin}
          title={
            boardAdmin
              ? format('member-board-admin')
              : format('this-member-is-an-admin-of-this-organization')
          }
        />
      )}
    </>
  );

  return onClick ? (
    <Button
      className={cx(
        className,
        styles.memberAvatar,
        initials && initials.length > 2 && styles.longInitials,
        styles.clickableAvatar,
      )}
      onClick={onClick}
      ref={avatarRef as Ref<HTMLButtonElement>}
      title={dangerousTitle}
      tabIndex={tabIndex}
      data-testid={testId}
      aria-expanded={ariaExpanded}
    >
      {avatarContent}
    </Button>
  ) : (
    <div
      className={cx(
        className,
        styles.memberAvatar,
        initials && initials.length > 2 && styles.longInitials,
      )}
      ref={avatarRef as Ref<HTMLDivElement>}
      title={dangerousTitle}
      data-testid={testId}
    >
      {avatarContent}
    </div>
  );
};
