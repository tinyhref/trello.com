import type {
  FunctionComponent,
  MouseEventHandler,
  PropsWithChildren,
} from 'react';

import { BackIcon } from '@trello/nachos/icons/back';
import { CloseIcon } from '@trello/nachos/icons/close';
import type { ProfileCardTestIds } from '@trello/test-ids';
import { token } from '@trello/theme';

import { CloseButton } from 'app/src/components/CloseButton';

import * as styles from './ProfileCardWrapper.module.less';

// Props for a screen other than Screen.Profile
interface ProfileCardWrapperProps extends PropsWithChildren {
  onClose: MouseEventHandler<HTMLButtonElement>;
  onBack?: MouseEventHandler<HTMLButtonElement>;
  title?: string;
  testId?: ProfileCardTestIds;
}

// A wrapper that gives "back" and "close" functionalities to sub-screens of the profile card
// If title is not provided, the back and close buttons are overlaid on the children
// If title is provided, the buttons and title are shown above the children with a divider between
export const ProfileCardWrapper: FunctionComponent<ProfileCardWrapperProps> = ({
  children,
  onBack,
  onClose,
  title,
  testId,
}) => {
  return (
    <div className={styles.wrapper} data-testid={testId}>
      <div>
        {onBack && (
          <CloseButton
            className={styles.backButton}
            onClick={onBack}
            closeIcon={<BackIcon size="small" label="Back" />}
            color={
              !title
                ? token('color.icon.inverse', '#FFFFFF')
                : token('color.icon.subtle', '#626F86')
            }
          />
        )}
        {title && <div className={styles.title}>{title}</div>}
        <CloseButton
          className={styles.closeButton}
          onClick={onClose}
          closeIcon={
            <CloseIcon
              size="small"
              label="Close"
              color={
                !title
                  ? token('color.icon.inverse', '#FFFFFF')
                  : token('color.icon.subtle', '#626F86')
              }
            />
          }
        />
      </div>
      {children}
    </div>
  );
};
