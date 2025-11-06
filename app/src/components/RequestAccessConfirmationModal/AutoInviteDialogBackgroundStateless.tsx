/* eslint-disable @trello/assets-alongside-implementation */
import type { FunctionComponent, ReactNode } from 'react';

import type { PIIString } from '@trello/privacy';
import { EMPTY_PII_STRING } from '@trello/privacy';

import { AvatarComponent } from './AvatarComponent';

import * as styles from './AutoInviteDialogBackgroundStateless.module.less';

import genericerror from 'resources/images/request-access/generic-error.svg';
import headerimage from 'resources/images/request-access/header-image.svg';
import inviterestrictionerror from 'resources/images/request-access/invite-restriction-error.svg';
import successcontent from 'resources/images/request-access/success-content.svg';
import workspacerestriction from 'resources/images/request-access/workspace-restriction.svg';

type RequestAccessImagePath =
  | 'generic-error.svg'
  | 'header-image.svg'
  | 'invite-restriction-error.svg'
  | 'success-content.svg'
  | 'workspace-restriction.svg';

const getRequestAccessImage = (imagePath: RequestAccessImagePath): string => {
  switch (imagePath) {
    case 'generic-error.svg':
      return genericerror;
    case 'header-image.svg':
      return headerimage;
    case 'invite-restriction-error.svg':
      return inviterestrictionerror;
    case 'success-content.svg':
      return successcontent;
    case 'workspace-restriction.svg':
      return workspacerestriction;
    default:
      return '';
  }
};

export interface AutoInviteDialogBackgroundStatelessProps {
  fullName?: PIIString;
  email?: PIIString;
  title?: ReactNode;
  id?: string;
  description: ReactNode;
  avatarDescription?: ReactNode;
  buttons?: ReactNode;
  imagePath: RequestAccessImagePath;
}

export const AutoInviteDialogBackgroundStateless: FunctionComponent<
  AutoInviteDialogBackgroundStatelessProps
> = ({
  fullName,
  title,
  email,
  id,
  description,
  avatarDescription,
  buttons,
  imagePath,
}) => {
  const showAvatar = fullName && id && avatarDescription;

  return (
    <div className={styles.container}>
      <img
        alt=""
        aria-hidden="true"
        className={styles.modalImage}
        src={getRequestAccessImage(imagePath)}
      />
      <h1 className={styles.modalTitle}>{title}</h1>
      <div className={styles.modalText}>{description}</div>
      {showAvatar && (
        <AvatarComponent
          fullName={fullName}
          avatarDescription={avatarDescription}
          email={email || EMPTY_PII_STRING}
          id={id}
        />
      )}
      <div className={styles.buttonContainer}>{buttons}</div>
    </div>
  );
};
